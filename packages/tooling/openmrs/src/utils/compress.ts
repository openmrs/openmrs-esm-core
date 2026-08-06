import { randomBytes } from 'node:crypto';
import { readdir, readFile, rename, rm, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import { promisify } from 'node:util';
import { brotliCompress, constants as zlibConstants, gzip } from 'node:zlib';
import { logInfo, logWarn } from './logger';

const gzipAsync = promisify(gzip);
const brotliCompressAsync = promisify(brotliCompress);

/**
 * Extensions we emit precompressed siblings for.
 */
const compressibleExtensions = new Set(['.js', '.mjs', '.cjs', '.css', '.json', '.svg', '.html', '.map']);

/** Whether a file name is one we emit precompressed siblings for. */
function isCompressible(path: string) {
  return compressibleExtensions.has(extname(path).toLowerCase());
}

/**
 * Files below this size are not worth a maximum-effort compression pass.
 * Note this is a cost decision, not a correctness one — {@link writeSibling}
 * separately refuses to write any sibling that isn't smaller than its source.
 */
const minimumSizeInBytes = 1024;

export interface CompressAssetsOptions {
  /** Emit `.gz` siblings compressed at the maximum zlib level. */
  gzip?: boolean;
  /** Emit `.br` siblings compressed at the maximum brotli quality. */
  brotli?: boolean;
}

/**
 * The precompression flags as the CLI and the SPA build config express them, which is one
 * on/off switch plus a switch per encoding.
 */
export interface CompressionSettings {
  compress?: boolean;
  compressGzip?: boolean;
  compressBrotli?: boolean;
}

/**
 * Resolves precompression flags from multiple settings.
 */
export function resolveCompression(
  ...sources: Array<CompressionSettings | undefined>
): CompressAssetsOptions | undefined {
  const settle = (key: keyof CompressionSettings) =>
    sources.reduce<boolean | undefined>((value, source) => source?.[key] ?? value, undefined) ?? true;

  return settle('compress') ? { gzip: settle('compressGzip'), brotli: settle('compressBrotli') } : undefined;
}

export interface EncodingResult {
  /** Number of source files for which a sibling in this encoding was written. */
  files: number;
  /** Total size, in bytes, of those source files. */
  sourceBytes: number;
  /** Total size, in bytes, of the siblings written in this encoding. */
  compressedBytes: number;
}

export interface CompressAssetsResult {
  gzip: EncodingResult;
  brotli: EncodingResult;
  /** Number of assets skipped because they could not be read or compressed. */
  failures: number;
  /**
   * Number of siblings removed: those whose source has disappeared, and those whose source no
   * longer compresses smaller or is no longer worth compressing.
   */
  removed: number;
}

interface Encoding {
  /** The suffix appended to the source file name, e.g. `.gz`. */
  suffix: string;
  /** Human-readable name used in log output. */
  name: string;
  /** The field of {@link CompressAssetsResult} this encoding's output is tallied into. */
  resultKey: 'gzip' | 'brotli';
  /** Compresses `content`; `size` is the source size, used as brotli's size hint. */
  compress: (content: Buffer, size: number) => Promise<Buffer>;
}

const gzipEncoding: Encoding = {
  suffix: '.gz',
  name: 'gzip',
  resultKey: 'gzip',
  compress: (content) => gzipAsync(content, { level: zlibConstants.Z_BEST_COMPRESSION }),
};

const brotliEncoding: Encoding = {
  suffix: '.br',
  name: 'brotli',
  resultKey: 'brotli',
  // Brotli makes measurably better window and encoder decisions when it knows the input
  // size up front, and everything we compress here is text rather than generic bytes.
  compress: (content, size) =>
    brotliCompressAsync(content, {
      params: {
        [zlibConstants.BROTLI_PARAM_QUALITY]: zlibConstants.BROTLI_MAX_QUALITY,
        [zlibConstants.BROTLI_PARAM_MODE]: zlibConstants.BROTLI_MODE_TEXT,
        [zlibConstants.BROTLI_PARAM_SIZE_HINT]: size,
      },
    }),
};

const allEncodings = [gzipEncoding, brotliEncoding];

interface AssetTree {
  /** Absolute paths of files we should emit siblings for. */
  sources: Array<string>;
  /** Absolute paths of precompressed siblings that already exist in the tree. */
  siblings: Array<string>;
}

/**
 * Recognises a path as a precompressed sibling this module is responsible for, returning
 * the source path it belongs to along with its encoding.
 */
function sourceOf(path: string) {
  const lowercased = path.toLowerCase();

  for (const encoding of allEncodings) {
    if (lowercased.endsWith(encoding.suffix)) {
      const source = path.slice(0, -encoding.suffix.length);

      if (isCompressible(source)) {
        return { source, encoding };
      }
    }
  }

  return undefined;
}

/**
 * Walks `dir` one directory at a time.
 */
async function collectAssets(dir: string): Promise<AssetTree> {
  const tree: AssetTree = { sources: [], siblings: [] };
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      const nested = await collectAssets(path);
      tree.sources.push(...nested.sources);
      tree.siblings.push(...nested.siblings);
    } else if (entry.isFile() && sourceOf(entry.name)) {
      tree.siblings.push(path);
    } else if (entry.isFile() && isCompressible(entry.name)) {
      tree.sources.push(path);
    } else if (entry.isSymbolicLink() && isCompressible(entry.name)) {
      // Following symlinks would let us write a sibling whose name implies a file we
      // don't own, so we skip them but notify the user.
      logWarn(`Not precompressing ${path} because it is a symbolic link.`);
    }
  }

  return tree;
}

/**
 * Renders an error for a log line. Node's filesystem and zlib errors carry the detail worth
 * having in `code`, and a value thrown that isn't an Error at all still has to say something
 * useful in the one message an operator gets.
 */
function describeError(e: unknown) {
  try {
    const code = (e as NodeJS.ErrnoException)?.code;

    if (code) {
      return `${code}: ${e}`;
    }

    return e instanceof Error ? e.message : JSON.stringify(e) ?? String(e);
  } catch {
    return 'an error that could not be rendered';
  }
}

/**
 * Marks a failure that costs us one sibling and nothing else — compressing one file in one
 * encoding. Those are worth a warning rather than a failed build, whereas a failure to write
 * or remove a sibling leaves output a server may serve in place of an asset and so must
 * propagate. Carries the encoding so the warning can name which sibling is missing.
 */
class SkippableAssetError extends Error {
  constructor(
    readonly encoding: Encoding,
    readonly reason: unknown,
  ) {
    super(describeError(reason));
  }
}

/**
 * Writes `content` to `path` such that the file is never observable in a partially
 * written state. A truncated `.gz` would otherwise be served to browsers as though it
 * were complete, which is far harder to diagnose than a failed build.
 */
async function writeAtomically(path: string, content: Buffer) {
  // name contains random information and is opened with exclusive write privileges
  // to avoid symlink attacks
  const temporary = `${path}.${randomBytes(8).toString('hex')}.tmp`;

  try {
    await writeFile(temporary, content, { flag: 'wx' });
    await rename(temporary, path);
  } catch (e) {
    await rm(temporary, { force: true }).catch((cleanupError) =>
      logWarn(`Could not remove the temporary file ${temporary}: ${describeError(cleanupError)}`),
    );
    throw e;
  }
}

/**
 * Produces one precompressed sibling, returning its size in bytes, or zero if no sibling
 * exists once we're done.
 *
 * When the compressed form isn't actually smaller than the source, the existing sibling, if
 * any, is deleted rather than merely left unwritten.
 */
async function writeSibling(file: string, content: Buffer, encoding: Encoding) {
  const sibling = `${file}${encoding.suffix}`;
  let compressed: Buffer;

  try {
    compressed = await encoding.compress(content, content.length);
  } catch (e) {
    throw new SkippableAssetError(encoding, e);
  }

  if (compressed.length < content.length) {
    await writeAtomically(sibling, compressed);
    return compressed.length;
  }

  await rm(sibling, { force: true });
  return 0;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ['kB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;

  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }

  return `${value.toFixed(1)} ${units[unit]}`;
}

function describe(encoding: Encoding, { files, sourceBytes, compressedBytes }: EncodingResult) {
  const saving = sourceBytes > 0 ? Math.round((1 - compressedBytes / sourceBytes) * 100) : 0;
  return `${encoding.name} ${files} files, ${formatBytes(sourceBytes)} to ${formatBytes(
    compressedBytes,
  )} (${saving}% smaller)`;
}

/**
 * Removes siblings whose source file is gone.
 * *
 * Note what is deliberately *not* removed here: siblings in an encoding that is currently
 * switched off.
 */
async function removeOrphanedSiblings(dir: string, tree: AssetTree) {
  const sources = new Set(tree.sources);
  const orphaned: Array<string> = [];

  for (const sibling of tree.siblings) {
    const owner = sourceOf(sibling);

    if (owner && !sources.has(owner.source)) {
      logWarn(`Removing ${relative(dir, sibling)} because ${relative(dir, owner.source)} does not exist.`);
      orphaned.push(sibling);
    }
  }

  const outcomes = await Promise.allSettled(orphaned.map((sibling) => rm(sibling, { force: true })));
  const failed = outcomes.find((outcome) => outcome.status === 'rejected');
  if (failed?.status === 'rejected') {
    throw new Error(`Could not remove obsolete precompressed assets in ${dir}: ${describeError(failed.reason)}`);
  }

  return orphaned.length;
}

/**
 * Writes precompressed siblings (`main.js.gz`, `main.js.br`) next to each compressible
 * asset in `dir` that is large enough to be worth compressing and that actually shrinks,
 * so that a web server can serve them directly (nginx `gzip_static` / `brotli_static`)
 * instead of compressing on every request. Doing the work once here both removes
 * per-request CPU cost and lets us use compression levels that would be far too slow to
 * apply per response.
 *
 * Every compressible file is compressed on every call.
 *
 * Assets that cannot be read or compressed are logged and skipped. Failures to *write or remove*
 * a sibling are not tolerated, because they would leave output a server might serve in
 * place of an asset.
 */
export async function compressAssets(dir: string, options: CompressAssetsOptions = {}): Promise<CompressAssetsResult> {
  const result: CompressAssetsResult = {
    gzip: { files: 0, sourceBytes: 0, compressedBytes: 0 },
    brotli: { files: 0, sourceBytes: 0, compressedBytes: 0 },
    failures: 0,
    removed: 0,
  };

  const encodings = allEncodings.filter((encoding) => options[encoding.resultKey]);

  if (encodings.length === 0) {
    logWarn(`Not precompressing assets in ${dir}: both gzip and brotli output are disabled.`);
    return result;
  }

  logInfo(`Precompressing assets in ${dir} (${encodings.map((encoding) => encoding.name).join(' and ')}) ...`);

  const tree = await collectAssets(dir);
  const existingSiblings = new Set(tree.siblings);
  result.removed = await removeOrphanedSiblings(dir, tree);

  /**
   * Removes the siblings for the given encodings. Failures to remove propagate, like
   * every other removal here.
   */
  const discardSiblings = async (file: string, discarded: Array<Encoding>) =>
    Promise.all(
      discarded.map(async (encoding) => {
        const sibling = `${file}${encoding.suffix}`;
        await rm(sibling, { force: true });

        if (existingSiblings.has(sibling)) {
          result.removed++;
        }
      }),
    );

  /** Gives up on a file in every encoding, because it could not be read at all. */
  const abandonFile = async (file: string, reason: unknown) => {
    result.failures++;
    logWarn(`Could not precompress ${relative(dir, file)}: ${describeError(reason)}`);
    await discardSiblings(file, encodings);
  };

  /**
   * Gives up on a file in the encodings that failed, leaving any encoding that succeeded
   * written and counted: a valid sibling this pass just wrote is worth keeping regardless of
   * what the other encoding did.
   */
  const abandonEncodings = async (file: string, failures: Array<{ encoding: Encoding; reason: unknown }>) => {
    result.failures++;
    for (const { encoding, reason } of failures) {
      logWarn(`Could not precompress ${relative(dir, file)} (${encoding.name}): ${describeError(reason)}`);
    }

    await discardSiblings(
      file,
      failures.map(({ encoding }) => encoding),
    );
  };

  // Compression is CPU-bound and runs on libuv's thread pool, so we keep a bounded number of
  // files in flight rather than handing zlib the whole tree at once, and we bound it by the
  // pool rather than by core count, since that pool is the real ceiling on how many
  // compressions can proceed at once.
  const concurrency = Math.max(1, Math.min(Number(process.env.UV_THREADPOOL_SIZE) || 4, tree.sources.length));
  let next = 0;
  const worker = async () => {
    while (next < tree.sources.length) {
      const file = tree.sources[next++];

      let content: Buffer;
      let tooSmall: boolean;
      try {
        const { size } = await stat(file);
        tooSmall = size < minimumSizeInBytes;
        content = tooSmall ? Buffer.alloc(0) : await readFile(file);
      } catch (e) {
        await abandonFile(file, e);
        continue;
      }

      const outcomes = await Promise.allSettled(
        encodings.map((encoding) =>
          tooSmall
            ? // Not worth compressing, but a sibling from an earlier run would still be
              // served in its place, so it can't be left behind.
              rm(`${file}${encoding.suffix}`, { force: true }).then(() => 0)
            : writeSibling(file, content, encoding),
        ),
      );

      const fatal = outcomes.find(
        (outcome) => outcome.status === 'rejected' && !(outcome.reason instanceof SkippableAssetError),
      );
      if (fatal?.status === 'rejected') {
        throw fatal.reason;
      }

      // Each rejection carries its own cause, so a file that failed differently in each
      // encoding reports both rather than only the first.
      const skipped = encodings
        .map((encoding, index) => ({ encoding, outcome: outcomes[index] }))
        .filter(({ outcome }) => outcome.status === 'rejected')
        .map(({ encoding, outcome }) => ({
          encoding,
          reason: ((outcome as PromiseRejectedResult).reason as SkippableAssetError).reason,
        }));

      if (skipped.length > 0) {
        await abandonEncodings(file, skipped);
      }

      outcomes.forEach((outcome, index) => {
        if (outcome.status === 'rejected') {
          return;
        }

        const encoding = encodings[index];

        if (outcome.value > 0) {
          const tally = result[encoding.resultKey];
          tally.files++;
          tally.sourceBytes += content.length;
          tally.compressedBytes += outcome.value;
        } else if (existingSiblings.has(`${file}${encoding.suffix}`)) {
          result.removed++;
        }
      });
    }
  };

  // Every worker settles before we rethrow, so a failing write can't leave compression
  // running unsupervised against a directory the caller is about to give up on.
  const runs = await Promise.allSettled(Array.from({ length: concurrency }, worker));
  const failed = runs.find((run) => run.status === 'rejected');
  if (failed?.status === 'rejected') {
    throw new Error(`Could not write precompressed assets to ${dir}: ${describeError(failed.reason)}`);
  }

  const summary = encodings.map((encoding) => describe(encoding, result[encoding.resultKey])).join(', ');
  logInfo(
    `Precompressed assets in ${dir}: ${summary}` +
      (result.removed > 0 ? `, removed ${result.removed} obsolete` : '') +
      // Not "skipped N assets": an asset that failed in one encoding still has a sibling in
      // the other, so it is both counted above and reported here.
      (result.failures > 0 ? `, ${result.failures} missing a sibling in at least one encoding` : ''),
  );

  return result;
}
