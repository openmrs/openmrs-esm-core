import { glob } from 'glob';
import { dirname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { logInfo } from './logger';
import type { PackageJson } from './types';

function readPackageJson(pkgPath: string): PackageJson {
  return JSON.parse(readFileSync(pkgPath, 'utf8'));
}

function getWorkspacePatterns(pkg: PackageJson): Array<string> | null {
  const workspaces = Array.isArray(pkg.workspaces) ? pkg.workspaces : pkg.workspaces?.packages ?? null;
  return workspaces && workspaces.length > 0 ? workspaces : null;
}

/**
 * Walk up the directory tree from startDir looking for a package.json
 * with a workspaces field, which indicates a monorepo root.
 */
function findWorkspaceRoot(startDir: string): string | null {
  let dir = startDir;
  for (;;) {
    const pkgPath = resolve(dir, 'package.json');
    if (existsSync(pkgPath)) {
      const pkg = readPackageJson(pkgPath);
      if (getWorkspacePatterns(pkg)) {
        return dir;
      }
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return null;
    }
    dir = parent;
  }
}

/**
 * Resolve package names to their source directories.
 *
 * First checks the current directory's package.json for a direct match,
 * which handles single-package repos efficiently. If any requested
 * packages remain unresolved, walks up the directory tree to find a
 * workspace root and globs its workspace patterns to build a complete
 * package map.
 *
 * @returns Absolute paths to the resolved package directories.
 * @throws If any requested package name cannot be resolved, with a list
 *   of available packages.
 */
export async function resolvePackages(packageNames: Array<string>): Promise<Array<string>> {
  const cwd = process.cwd();
  const packageMap = new Map<string, string>();

  // Check the nearest package.json first (fast path for single-package repos)
  const cwdPkgPath = resolve(cwd, 'package.json');
  if (existsSync(cwdPkgPath)) {
    const cwdPkg = readPackageJson(cwdPkgPath);
    if (cwdPkg.name) {
      packageMap.set(cwdPkg.name, cwd);
    }
  }

  // If all requested packages are already resolved, skip workspace discovery
  if (!packageNames.every((name) => packageMap.has(name))) {
    const workspaceRoot = findWorkspaceRoot(cwd);

    if (workspaceRoot) {
      const rootPkg = readPackageJson(resolve(workspaceRoot, 'package.json'));
      const patterns = getWorkspacePatterns(rootPkg)!;

      const results = await Promise.all(patterns.map((pattern) => glob(pattern, { cwd: workspaceRoot })));
      const workspaceDirs = results.flat();

      for (const dir of workspaceDirs) {
        const pkgPath = resolve(workspaceRoot, dir, 'package.json');
        if (existsSync(pkgPath)) {
          const pkg = readPackageJson(pkgPath);
          if (pkg.name) {
            packageMap.set(pkg.name, resolve(workspaceRoot, dir));
          }
        }
      }
    }
  }

  const resolved: Array<string> = [];
  const notFound: Array<string> = [];

  for (const name of packageNames) {
    const dir = packageMap.get(name);
    if (dir) {
      logInfo(`Resolved package "${name}" to "${dir}"`);
      resolved.push(dir);
    } else {
      notFound.push(name);
    }
  }

  if (notFound.length > 0) {
    const available = Array.from(packageMap.keys()).sort();
    throw new Error(
      `Could not resolve the following package(s):\n` +
        notFound.map((n) => `  - ${n}`).join('\n') +
        (available.length > 0
          ? `\n\nAvailable packages:\n` + available.map((n) => `  - ${n}`).join('\n')
          : '\n\nNo packages were found in the current directory.'),
    );
  }

  return resolved;
}
