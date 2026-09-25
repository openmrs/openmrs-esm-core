import { Parser as TarParser } from 'tar';
import { posix } from 'node:path';
import { Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createGunzip } from 'node:zlib';

export interface PackageFiles {
  [file: string]: Buffer;
}

/**
 * The decompressed size we refuse to read past, which is orders of magnitude above any real
 * frontend module. A small tarball can expand to an arbitrarily large one, and every entry we read
 * is held in memory.
 */
const maxUncompressedSize = 512 * 1024 * 1024;

/**
 * Entry names come straight from the archive headers, i.e. from whoever built the tarball, and
 * node-tar's `Parser` hands them back verbatim.
 *
 * @param rawPath The entry name as recorded in the tar header
 * @returns The normalised, root-relative path to key the entry under
 */
function normalizeEntryPath(rawPath: string): string {
  // tar records paths with forward slashes, but a Windows-style name (`C:\evil`, `\\host\share`)
  // would still be absolute once a caller passes it to `resolve()`.
  const path = rawPath.replace(/\\/g, '/');

  if (path.startsWith('/') || /^[a-zA-Z]:\//.test(path)) {
    throw new Error(`Refusing to read tar entry with an absolute path: ${rawPath}`);
  }

  const normalized = posix.normalize(path);

  if (normalized === '..' || normalized.startsWith('../')) {
    throw new Error(`Refusing to read tar entry that escapes the archive root: ${rawPath}`);
  }

  return normalized;
}

/**
 * Fails the stream once more than `limit` bytes have passed through it. zlib's `maxOutputLength`
 * only applies to the one-shot convenience methods, so a streamed gunzip has no size limit of its
 * own.
 *
 * @param limit The maximum number of bytes to let through
 */
function limitSize(limit: number): Transform {
  let total = 0;

  return new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      total += chunk.length;

      if (total > limit) {
        callback(new Error(`Refusing to read an archive that expands to more than ${limit} bytes.`));
        return;
      }

      callback(null, chunk);
    },
  });
}

/**
 * Reads a gzipped tarball into a map of its file contents, keyed by the path of each entry relative
 * to the root of the archive. Rejects if the archive is damaged, if it expands to more than
 * `maxSize` bytes, or if any entry is named in a way that would place it outside the archive root.
 *
 * Note that directory entries appear in the map too, keyed with a trailing slash and holding no
 * content.
 *
 * @param stream The gzipped tarball to read
 * @param maxSize The decompressed size to stop reading at
 * @returns The contents of the archive, keyed by path
 */
export async function untar(
  stream: NodeJS.ReadableStream,
  maxSize: number = maxUncompressedSize,
): Promise<PackageFiles> {
  const files: PackageFiles = {};
  const contents: Array<Promise<void>> = [];
  let entryError: unknown;

  const parser = new TarParser({
    // every warning this parser emits means the archive is malformed or damaged; without strict a
    // tarball truncated mid-entry reads as a short file with no error at all
    strict: true,
    onReadEntry: (entry) => {
      let path: string;

      try {
        path = normalizeEntryPath(entry.path);
      } catch (err) {
        // throwing from here surfaces as a failure in the pipeline's own teardown rather than as
        // this error, so hold onto it and report it once the archive has been read
        entryError ??= err;
        entry.resume();
        return;
      }

      // the rejection handler is attached here, rather than by awaiting below, so that an entry
      // interrupted by a failure further up the pipeline never rejects unhandled
      contents.push(
        entry.concat().then(
          (content) => void (files[path] = content),
          (err) => void (entryError ??= err),
        ),
      );
    },
  });

  await pipeline(stream, createGunzip(), limitSize(maxSize), parser);
  await Promise.all(contents);

  if (entryError) {
    throw entryError;
  }

  return files;
}
