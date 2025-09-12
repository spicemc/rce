import * as path from 'path';
import { pathToFileURL } from 'url';
import * as glob from 'glob';
import { Newable } from '../types/Types';

/**
 * Dynamically imports a module from disk via a file:// URL
 * and returns its exports object.
 */
async function loadModule(file: string): Promise<any> {
  const absolute = path.resolve(file);
  const url = pathToFileURL(absolute).href;
  return import(url);
}

/**
 * Recursively walks over an exported value and collects
 * all constructor functions (classes) into `collector`.
 */
function collectClasses(exported: any, collector: Newable[]): void {
  if (typeof exported === 'function') {
    collector.push(exported as Newable);

  } else if (Array.isArray(exported)) {
    for (const item of exported) {
      collectClasses(item, collector);
    }

  } else if (exported && typeof exported === 'object') {
    for (const value of Object.values(exported)) {
      collectClasses(value, collector);
    }
  }
}

/**
 * Loads all exported classes from the given directories.
 *
 * @param directories  Array of glob patterns or paths to scan
 * @param formats      File extensions to include (defaults to .js/.ts/.tsx)
 * @returns Promise resolving to an array of class constructors
 */
export async function importClassesFromDirectories(
  directories: string[],
  formats: string[] = ['.js', '.ts', '.tsx']
): Promise<Newable[]> {
  // 1) Find all matching files
  const allFiles = directories.flatMap(dir => {
    const normalized = path.normalize(dir).replace(/\\/g, '/');
    return glob.sync(normalized);
  });

  // 2) Filter out non-matching extensions and .d.ts files
  const targets = allFiles.filter(file => {
    const ext = path.extname(file);
    const isDeclaration = file.endsWith('.d.ts');
    return formats.includes(ext) && !isDeclaration;
  });

  // 3) Import each file dynamically and collect exported classes
  const classes: Newable[] = [];
  for (const file of targets) {
    const mod = await loadModule(file);
    const exported = mod.default ?? mod;
    collectClasses(exported, classes);
  }

  return classes;
}
