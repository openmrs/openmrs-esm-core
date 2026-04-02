import { Readable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import { Header } from 'tar';
import { describe, expect, it } from 'vitest';
import { untar } from './untar';

function createTarGz(files: Record<string, string>): Buffer {
  const chunks: Buffer[] = [];

  for (const [path, content] of Object.entries(files)) {
    const data = Buffer.from(content);
    const header = new Header({
      path,
      type: 'File',
      mode: 0o644,
      size: data.length,
    });
    header.encode();
    chunks.push(header.block!, data);

    // Tar entries are padded to 512-byte blocks
    const remainder = data.length % 512;
    if (remainder > 0) {
      chunks.push(Buffer.alloc(512 - remainder));
    }
  }

  // Two 512-byte zero blocks mark end of archive
  chunks.push(Buffer.alloc(1024));

  return gzipSync(Buffer.concat(chunks));
}

describe('untar', () => {
  it('should extract files from a gzipped tarball', async () => {
    const tgz = createTarGz({
      'package/package.json': JSON.stringify({ name: 'test-package', version: '1.0.0' }),
      'package/dist/main.js': 'console.log("hello");',
    });

    const stream = Readable.from(tgz);
    const files = await untar(stream);

    expect(Object.keys(files).sort()).toEqual(['package/dist/main.js', 'package/package.json']);
    expect(JSON.parse(files['package/package.json'].toString('utf8'))).toEqual({
      name: 'test-package',
      version: '1.0.0',
    });
    expect(files['package/dist/main.js'].toString('utf8')).toBe('console.log("hello");');
  });

  it('should return an empty object for an empty tarball', async () => {
    const tgz = gzipSync(Buffer.alloc(1024));

    const stream = Readable.from(tgz);
    const files = await untar(stream);

    expect(files).toEqual({});
  });
});
