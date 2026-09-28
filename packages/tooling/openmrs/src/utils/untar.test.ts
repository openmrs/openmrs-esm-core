import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { gunzipSync, gzipSync } from 'node:zlib';
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

/**
 * Builds a tar.gz whose entries have exactly the given names. `tar.create` derives entry names from
 * real files on disk, so it cannot produce the hostile names (absolute paths, `..` segments) a
 * malicious publisher would put in a header; this writes the ustar headers by hand instead.
 */
function createTarGzWithRawNames(entries: Record<string, string>): Buffer {
  const blocks: Array<Buffer> = [];

  for (const [name, content] of Object.entries(entries)) {
    const body = Buffer.from(content, 'utf8');
    const header = Buffer.alloc(512);

    header.write(name, 0, 100, 'utf8');
    header.write('0000644\0', 100, 8, 'utf8'); // mode
    header.write('0000000\0', 108, 8, 'utf8'); // uid
    header.write('0000000\0', 116, 8, 'utf8'); // gid
    header.write(body.length.toString(8).padStart(11, '0') + '\0', 124, 12, 'utf8');
    header.write('00000000000\0', 136, 12, 'utf8'); // mtime
    header.write('        ', 148, 8, 'utf8'); // checksum, blank while it is computed
    header.write('0', 156, 1, 'utf8'); // type flag: regular file
    header.write('ustar\0', 257, 6, 'utf8');
    header.write('00', 263, 2, 'utf8');

    const checksum = header.reduce((sum, byte) => sum + byte, 0);
    header.write(checksum.toString(8).padStart(6, '0') + '\0 ', 148, 8, 'utf8');

    blocks.push(header, body, Buffer.alloc((512 - (body.length % 512)) % 512));
  }

  // two zero blocks mark the end of the archive
  blocks.push(Buffer.alloc(1024));

  return gzipSync(Buffer.concat(blocks));
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

  it('rejects valid gzip wrapping non-tar data', async () => {
    const invalidTar = gzipSync(Buffer.from('this is not a tar archive'));
    const stream = Readable.from(invalidTar);

    await expect(untar(stream)).rejects.toThrow(/Unrecognized archive format/);
  });

  it('rejects an archive truncated part way through an entry', async () => {
    const tgz = await createTarGz({ 'package.json': '{"name":"test"}', 'dist/main.js': 'x'.repeat(5000) });
    // cut inside the body of the last entry, which otherwise reads back as a short file
    const truncated = gzipSync(gunzipSync(tgz).subarray(0, 2600));

    await expect(untar(Readable.from(truncated))).rejects.toThrow(/Truncated input/);
  });

  it('rejects an archive that expands beyond the size limit', async () => {
    const tgz = await createTarGz({ 'dist/main.js': 'x'.repeat(100_000) });

    await expect(untar(Readable.from(tgz), 4096)).rejects.toThrow(/expands to more than 4096 bytes/);
  });

  it('rejects entries whose path escapes the archive root', async () => {
    const tgz = createTarGzWithRawNames({ 'package/dist/../../../../evil.js': 'pwned' });

    await expect(untar(Readable.from(tgz))).rejects.toThrow(/escapes the archive root/);
  });

  it('rejects entries with an absolute path', async () => {
    const tgz = createTarGzWithRawNames({ '/etc/evil.conf': 'pwned' });

    await expect(untar(Readable.from(tgz))).rejects.toThrow(/absolute path/);
  });

  it('rejects entries with an absolute Windows path', async () => {
    const tgz = createTarGzWithRawNames({ 'C:\\Windows\\evil.dll': 'pwned' });

    await expect(untar(Readable.from(tgz))).rejects.toThrow(/absolute path/);
  });

  it('normalizes entry paths that stay inside the archive root', async () => {
    const tgz = createTarGzWithRawNames({
      './package/package.json': '{"name":"test"}',
      'package/dist/../main.js': 'console.log("main");',
    });

    const files = await untar(Readable.from(tgz));

    expect(Object.keys(files)).toEqual(['package/package.json', 'package/main.js']);
    expect(files['package/main.js'].toString('utf-8')).toBe('console.log("main");');
  });
});
