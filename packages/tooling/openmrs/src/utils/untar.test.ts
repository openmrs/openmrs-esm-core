import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import * as tar from 'tar';
import { untar } from './untar';

/**
 * Creates a tar.gz buffer from files written to a temp directory.
 * The archive entries will have paths relative to the temp root, prefixed
 * with the given `prefix` directory (mimicking npm package tarballs which
 * use "package/" as the root).
 */
async function createTarGz(files: Record<string, string | Buffer>, prefix: string = 'package'): Promise<Buffer> {
  const tmpDir = mkdtempSync(join(tmpdir(), 'untar-test-'));

  try {
    // Write files into a prefix directory inside the temp dir
    const prefixDir = join(tmpDir, prefix);
    mkdirSync(prefixDir, { recursive: true });

    for (const [relativePath, content] of Object.entries(files)) {
      const fullPath = join(prefixDir, relativePath);
      mkdirSync(join(fullPath, '..'), { recursive: true });
      writeFileSync(fullPath, content);
    }

    // Create tar.gz into a buffer by collecting stream output
    const chunks: Buffer[] = [];
    const stream = tar.create({ gzip: true, cwd: tmpDir }, [prefix]);

    for await (const chunk of stream) {
      chunks.push(chunk as Buffer);
    }

    return Buffer.concat(chunks);
  } finally {
    rmSync(tmpDir, { recursive: true, force: true });
  }
}

describe('untar', () => {
  it('extracts a single file from a tar.gz archive', async () => {
    const tgz = await createTarGz({ 'hello.txt': 'Hello, world!' });
    const stream = Readable.from(tgz);

    const files = await untar(stream);

    expect(files['package/hello.txt']).toBeDefined();
    expect(files['package/hello.txt'].toString('utf-8')).toBe('Hello, world!');
  });

  it('extracts multiple files preserving directory structure', async () => {
    const tgz = await createTarGz({
      'dist/main.js': 'console.log("main");',
      'dist/styles.css': 'body {}',
      'package.json': '{"name":"test"}',
    });
    const stream = Readable.from(tgz);

    const files = await untar(stream);

    expect(Object.keys(files)).toEqual(
      expect.arrayContaining(['package/dist/main.js', 'package/dist/styles.css', 'package/package.json']),
    );
    expect(files['package/dist/main.js'].toString('utf-8')).toBe('console.log("main");');
    expect(files['package/package.json'].toString('utf-8')).toBe('{"name":"test"}');
  });

  it('handles binary file content', async () => {
    const binaryContent = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe, 0xfd]);
    const tgz = await createTarGz({ 'data.bin': binaryContent });
    const stream = Readable.from(tgz);

    const files = await untar(stream);

    expect(Buffer.compare(files['package/data.bin'], binaryContent)).toBe(0);
  });

  it('rejects on invalid gzip data', async () => {
    const invalidData = Buffer.from('this is not gzip data');
    const stream = Readable.from(invalidData);

    await expect(untar(stream)).rejects.toThrow();
  });

  it('returns an empty object for valid gzip wrapping non-tar data', async () => {
    // tar.Parse gracefully handles non-tar data by emitting no entries
    const invalidTar = gzipSync(Buffer.from('this is not a tar archive'));
    const stream = Readable.from(invalidTar);

    const files = await untar(stream);
    expect(files).toEqual({});
  });
});
