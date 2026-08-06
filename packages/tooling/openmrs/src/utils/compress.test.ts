import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type * as Crypto from 'node:crypto';
import { randomBytes } from 'node:crypto';
import {
  chmod,
  lstat,
  mkdir,
  mkdtemp,
  readdir,
  readFile,
  rm,
  stat,
  symlink,
  utimes,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { promisify } from 'node:util';
import type * as Zlib from 'node:zlib';
import { brotliDecompress, gunzip, gzip } from 'node:zlib';

vi.mock('./logger', () => ({
  logInfo: vi.fn(),
  logWarn: vi.fn(),
}));

import { logWarn } from './logger';
import { compressAssets, resolveCompression } from './compress';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);
const brotliDecompressAsync = promisify(brotliDecompress);

/** Reads as root, so a mode-based read failure cannot be provoked. */
const runningAsRoot = process.getuid?.() === 0;

let dir: string;

/**
 * Content large enough to clear the minimum-size threshold and repetitive enough that
 * both encodings comfortably beat the original size.
 */
function compressibleContent(seed = 'const value = "openmrs";\n') {
  return seed.repeat(200);
}

async function writeAsset(name: string, content: string | Buffer) {
  const path = join(dir, name);
  await mkdir(join(path, '..'), { recursive: true });
  await writeFile(path, content);
  return path;
}

/**
 * Lists the base names of every file in the temp directory, at any depth. Names alone are
 * enough for these fixtures because none of them reuse a name across directories.
 */
async function listFiles() {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
}

beforeEach(async () => {
  dir = await mkdtemp(join(tmpdir(), 'openmrs-compress-'));
});

afterEach(async () => {
  await rm(dir, { recursive: true, force: true });
  vi.clearAllMocks();
});

describe('compressAssets', () => {
  it('emits .gz and .br siblings whose contents round-trip to the original', async () => {
    const content = compressibleContent();
    await writeAsset('main.js', content);

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(await gunzipAsync(await readFile(join(dir, 'main.js.gz')))).toEqual(Buffer.from(content));
    expect(await brotliDecompressAsync(await readFile(join(dir, 'main.js.br')))).toEqual(Buffer.from(content));
    expect(result.gzip.files).toBe(1);
    expect(result.brotli.files).toBe(1);
    expect(result.gzip.sourceBytes).toBe(content.length);
    expect(result.gzip.compressedBytes).toBeLessThan(content.length);
    expect(result.brotli.compressedBytes).toBeLessThan(content.length);
    expect(result.failures).toBe(0);
  });

  it('compresses every compressible extension, including nested files', async () => {
    const content = compressibleContent();
    const compressible = [
      'main.js',
      'main.js.map',
      'module.mjs',
      'legacy.cjs',
      'styles.css',
      'importmap.json',
      'icon.svg',
      'index.html',
      'nested/deeply/chunk.js',
    ];

    for (const name of compressible) {
      await writeAsset(name, content);
    }

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.gzip.files).toBe(compressible.length);
    for (const name of compressible) {
      await expect(stat(join(dir, `${name}.gz`))).resolves.toBeDefined();
      await expect(stat(join(dir, `${name}.br`))).resolves.toBeDefined();
    }
  });

  it('leaves non-compressible files alone', async () => {
    await writeAsset('logo.png', compressibleContent());
    await writeAsset('font.woff2', compressibleContent());

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.gzip.files).toBe(0);
    expect(await listFiles()).toHaveLength(2);
  });

  it('does not compress siblings recursively', async () => {
    await writeAsset('vendor.js', compressibleContent());
    await compressAssets(dir, { gzip: true, brotli: true });

    await compressAssets(dir, { gzip: true, brotli: true });

    expect(await listFiles()).not.toContain('vendor.js.gz.gz');
    expect(await listFiles()).not.toContain('vendor.js.gz.br');
  });

  it('skips files below the minimum size threshold', async () => {
    await writeAsset('tiny.js', 'a');

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.gzip.files).toBe(0);
    expect(await listFiles()).toEqual(['tiny.js']);
  });

  it('emits only the requested encoding', async () => {
    await writeAsset('main.js', compressibleContent());

    const result = await compressAssets(dir, { gzip: true });

    expect(await listFiles()).toEqual(expect.arrayContaining(['main.js', 'main.js.gz']));
    expect(await listFiles()).not.toContain('main.js.br');
    expect(result.gzip.compressedBytes).toBeGreaterThan(0);
    expect(result.brotli.compressedBytes).toBe(0);
  });

  it('warns and compresses nothing when no encoding is requested', async () => {
    await writeAsset('main.js', compressibleContent());

    const result = await compressAssets(dir, {});

    expect(vi.mocked(logWarn)).toHaveBeenCalledWith(expect.stringContaining('disabled'));
    expect(result.gzip.files).toBe(0);
    expect(result.brotli.files).toBe(0);
    expect(await listFiles()).toEqual(['main.js']);
  });

  it('leaves existing siblings alone when no encoding is requested', async () => {
    // No combination of the compression flags deletes anything, so switching compression off
    // is never destructive.
    await writeAsset('main.js', compressibleContent());
    await compressAssets(dir, { gzip: true, brotli: true });

    const result = await compressAssets(dir, {});

    expect(result.removed).toBe(0);
    expect(await listFiles()).toEqual(expect.arrayContaining(['main.js', 'main.js.gz', 'main.js.br']));
  });

  it('writes no sibling for content that does not compress smaller', async () => {
    // Random bytes are incompressible, so both encodings end up larger than the source.
    await writeAsset('noise.json', randomBytes(2048));

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.gzip.files).toBe(0);
    expect(result.brotli.files).toBe(0);
    expect(await listFiles()).toEqual(['noise.json']);
  });

  it('removes a stale sibling when the source drops below the minimum size', async () => {
    const path = await writeAsset('main.js', compressibleContent());
    await compressAssets(dir, { gzip: true, brotli: true });

    await writeFile(path, 'a', 'utf8');
    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.removed).toBe(2);
    expect(await listFiles()).toEqual(['main.js']);
  });

  it('removes a stale sibling when the source no longer compresses smaller', async () => {
    const path = await writeAsset('main.js', compressibleContent());
    await compressAssets(dir, { gzip: true, brotli: true });

    await writeFile(path, randomBytes(4096));
    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.removed).toBe(2);
    expect(await listFiles()).toEqual(['main.js']);
  });

  it('recompresses on every pass so a sibling can never describe stale content', async () => {
    const path = await writeAsset('main.js', compressibleContent());
    await compressAssets(dir, { gzip: true });

    // Rewriting the source without advancing its timestamp is exactly the case a
    // timestamp-based up-to-date check would get wrong.
    const updated = compressibleContent('const value = "a completely different module";\n');
    const { atime, mtime } = await stat(path);
    await writeFile(path, updated, 'utf8');
    await utimes(path, atime, mtime);

    await compressAssets(dir, { gzip: true });

    expect(await gunzipAsync(await readFile(`${path}.gz`))).toEqual(Buffer.from(updated));
  });

  it('removes siblings orphaned by a source file that no longer exists', async () => {
    // A previous build's hashed bundle, deleted before this run.
    await writeAsset('openmrs.oldhash.js.gz', await gzipAsync(Buffer.from(compressibleContent())));
    await writeAsset('main.js', compressibleContent());

    const result = await compressAssets(dir, { gzip: true });

    expect(result.removed).toBe(1);
    expect(await listFiles()).toEqual(expect.arrayContaining(['main.js', 'main.js.gz']));
    expect(await listFiles()).not.toContain('openmrs.oldhash.js.gz');
  });

  it('leaves siblings in an encoding that is no longer enabled', async () => {
    await writeAsset('main.js', compressibleContent());
    await compressAssets(dir, { gzip: true, brotli: true });

    const result = await compressAssets(dir, { gzip: true });

    expect(result.removed).toBe(0);
    expect(await listFiles()).toEqual(expect.arrayContaining(['main.js.gz', 'main.js.br']));
  });

  it('removes a sourceless .gz even when it was shipped that way by a frontend module', async () => {
    // The deliberate trade-off in removeUnwantedSiblings: a package that ships
    // `data.json.gz` with no `data.json` beside it loses the file. Static-compression
    // serving would hand that .gz to anyone requesting `data.json`, so a sibling we can't
    // match to a source is treated as this pass's to remove.
    await writeAsset('esm-test-app-1.0.0/data.json.gz', await gzipAsync(Buffer.from(compressibleContent())));

    const result = await compressAssets(dir, { gzip: true });

    expect(result.removed).toBe(1);
    expect(await listFiles()).toEqual([]);
  });

  it('leaves precompressed siblings of files it does not own alone', async () => {
    // Nothing here compresses sprite.png, so its sibling is somebody else's business.
    await writeAsset('sprite.png.gz', await gzipAsync(Buffer.from(compressibleContent())));

    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.removed).toBe(0);
    expect(await listFiles()).toEqual(['sprite.png.gz']);
  });

  it('warns about symlinked assets rather than silently skipping them', async () => {
    await writeAsset('real.js', compressibleContent());
    await symlink(join(dir, 'real.js'), join(dir, 'linked.js'));

    const result = await compressAssets(dir, { gzip: true });

    expect(vi.mocked(logWarn)).toHaveBeenCalledWith(expect.stringContaining('linked.js'));
    expect(result.gzip.files).toBe(1);
    expect(await listFiles()).not.toContain('linked.js.gz');
  });

  it.skipIf(runningAsRoot)('warns and continues when an asset cannot be read', async () => {
    await writeAsset('good.js', compressibleContent());
    const unreadable = await writeAsset('broken.js', compressibleContent());
    await chmod(unreadable, 0o000);

    // Both encodings are enabled to pin that one unreadable file counts once, rather than
    // once per encoding that went without it.
    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(vi.mocked(logWarn)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(logWarn)).toHaveBeenCalledWith(expect.stringContaining('broken.js'));
    expect(result.failures).toBe(1);
    expect(result.gzip.files).toBe(1);
    await expect(stat(join(dir, 'good.js.gz'))).resolves.toBeDefined();
  });

  it.skipIf(runningAsRoot)('discards the siblings of an asset it can no longer read', async () => {
    const path = await writeAsset('main.js', compressibleContent('const version = "old";\n'));
    await compressAssets(dir, { gzip: true, brotli: true });

    // Giving up on a source has to include giving up on its siblings: a server would
    // otherwise keep handing out the previous run's content for this asset.
    await writeFile(path, compressibleContent('const version = "new";\n'), 'utf8');
    await chmod(path, 0o000);
    const result = await compressAssets(dir, { gzip: true, brotli: true });

    expect(result.failures).toBe(1);
    expect(result.removed).toBe(2);
    expect(await listFiles()).toEqual(['main.js']);
  });

  it('keeps the sibling an encoding did write when the other encoding fails', async () => {
    const path = await writeAsset('main.js', compressibleContent());
    // A pre-existing pair, so the test distinguishes "kept because it was written" from
    // "kept because it happened not to exist before".
    await compressAssets(dir, { gzip: true, brotli: true });

    // compress.ts binds zlib's functions at import time, so the encoder has to be replaced
    // before the module is loaded rather than spied on afterwards.
    vi.resetModules();
    vi.doMock('node:zlib', async () => {
      const actual = await vi.importActual<Zlib>('node:zlib');
      return {
        ...actual,
        brotliCompress: (_content: Buffer, _options: unknown, callback: (e: Error) => void) =>
          callback(new Error('out of memory')),
      };
    });

    try {
      const { compressAssets: compressWithBrokenBrotli } = await import('./compress');
      const result = await compressWithBrokenBrotli(dir, { gzip: true, brotli: true });

      // The `.gz` this pass wrote is valid whatever brotli did.
      expect(result.failures).toBe(1);
      expect(result.gzip.files).toBe(1);
      expect(await gunzipAsync(await readFile(`${path}.gz`))).toEqual(Buffer.from(compressibleContent()));
      expect(await listFiles()).not.toContain('main.js.br');
    } finally {
      vi.doUnmock('node:zlib');
      vi.resetModules();
    }
  });

  it('fails the build when a sibling cannot be written, leaving no partial files', async () => {
    await writeAsset('main.js', compressibleContent());
    // A directory in the sibling's place makes the write fail. Unlike an unreadable
    // source, this leaves output we can't stand behind, so it must not be swallowed.
    await mkdir(join(dir, 'main.js.gz'));

    await expect(compressAssets(dir, { gzip: true })).rejects.toThrow(/precompressed/);

    expect((await listFiles()).filter((name) => name.endsWith('.tmp'))).toEqual([]);
  });

  it('replaces a symlink standing where a sibling belongs instead of writing through it', async () => {
    const victim = await writeAsset('victim.txt', 'do not touch');
    await writeAsset('main.js', compressibleContent());
    await symlink(victim, join(dir, 'main.js.gz'));

    await compressAssets(dir, { gzip: true });

    // rename() replaces the link itself, so the sibling must end up a real gzip file and the
    // symlink's target must be untouched.
    expect(await readFile(victim, 'utf8')).toBe('do not touch');
    expect((await lstat(join(dir, 'main.js.gz'))).isSymbolicLink()).toBe(false);
    expect(await gunzipAsync(await readFile(join(dir, 'main.js.gz')))).toEqual(Buffer.from(compressibleContent()));
  });

  it('refuses to write through a symlink pre-created at its temporary path', async () => {
    const victim = await writeAsset('victim.txt', 'do not touch');
    await writeAsset('main.js', compressibleContent());

    // The temporary name is random precisely so it can't be pre-created; pinning the
    // randomness lets the test play the attacker who guessed it anyway, and proves the
    // exclusive open — not the unpredictability alone — is what refuses to follow the link.
    vi.resetModules();
    vi.doMock('node:crypto', async () => ({
      ...(await vi.importActual<Crypto>('node:crypto')),
      randomBytes: () => Buffer.alloc(8, 0xab),
    }));

    try {
      await symlink(victim, join(dir, `main.js.gz.${'ab'.repeat(8)}.tmp`));
      const { compressAssets: compressWithKnownTempName } = await import('./compress');

      await expect(compressWithKnownTempName(dir, { gzip: true })).rejects.toThrow(/precompressed/);
      expect(await readFile(victim, 'utf8')).toBe('do not touch');
    } finally {
      vi.doUnmock('node:crypto');
      vi.resetModules();
    }
  });

  it('leaves no temporary files behind', async () => {
    await writeAsset('main.js', compressibleContent());

    await compressAssets(dir, { gzip: true, brotli: true });

    expect((await listFiles()).filter((name) => name.endsWith('.tmp'))).toEqual([]);
  });

  it('compresses more files than it has workers', async () => {
    // The worker pool is small (bounded by libuv's thread pool), so a tree this size is what
    // makes each worker take several turns at the shared cursor.
    const names = Array.from({ length: 40 }, (_, index) => `chunk.${index}.js`);
    for (const name of names) {
      await writeAsset(name, compressibleContent(`const chunk = ${names.indexOf(name)};\n`));
    }

    const result = await compressAssets(dir, { gzip: true });

    expect(result.gzip.files).toBe(names.length);
    expect(result.failures).toBe(0);
  });
});

describe('resolveCompression', () => {
  /** Flags as yargs supplies them for `build` and `assemble`: always fully populated. */
  const commandLine = { compress: true, compressGzip: true, compressBrotli: true };

  it('reads flags from a single source', () => {
    expect(resolveCompression(commandLine)).toEqual({ gzip: true, brotli: true });
    expect(resolveCompression({ ...commandLine, compress: false })).toBeUndefined();
    expect(resolveCompression({ ...commandLine, compressBrotli: false })).toEqual({ gzip: true, brotli: false });
    expect(resolveCompression({ ...commandLine, compressGzip: false })).toEqual({ gzip: false, brotli: true });
  });

  it('lets a later source override an earlier one', () => {
    expect(resolveCompression(commandLine, { compress: false })).toBeUndefined();
    expect(resolveCompression({ ...commandLine, compress: false }, { compress: true })).toEqual({
      gzip: true,
      brotli: true,
    });
    expect(resolveCompression(commandLine, { compressBrotli: false })).toEqual({ gzip: true, brotli: false });
  });

  it('defers to earlier sources for keys a later source omits', () => {
    // The case that makes `??` rather than `||` load-bearing: a build config that mentions
    // only one encoding must not silently re-enable the flags it says nothing about.
    expect(resolveCompression({ ...commandLine, compressGzip: false }, { compressBrotli: false })).toEqual({
      gzip: false,
      brotli: false,
    });
    expect(resolveCompression({ ...commandLine, compress: false }, {})).toBeUndefined();
    expect(resolveCompression({ ...commandLine, compress: false }, undefined)).toBeUndefined();
  });

  it('defaults to compressing in both encodings when nothing is specified', () => {
    expect(resolveCompression()).toEqual({ gzip: true, brotli: true });
    expect(resolveCompression({}, {})).toEqual({ gzip: true, brotli: true });
  });
});
