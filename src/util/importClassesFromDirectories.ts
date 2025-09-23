import * as path from 'path';
import * as glob from 'glob';
import { pathToFileURL } from 'url';
import { Newable } from '../types/Types';

/**
 * Dynamically loads a module using either import() or require(),
 * depending on whether the current runtime supports ESM.
 */
async function loadModule(file: string): Promise<any> {
  const absolute = path.resolve(file);

  // esm mode check. __filename is only defined in CommonJS
  const isESM = typeof __filename === 'undefined';

  if (isESM) {
    const url = pathToFileURL(absolute).href;
    return import(url);
  } else {
    return Promise.resolve(require(absolute));
  }
}

/**
 * Recursively collects all class constructors from an export.
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
 */
export async function importClassesFromDirectories(
  directories: string[],
  formats: string[] = ['.js', '.ts', '.tsx'],
): Promise<Newable[]> {
  const allFiles = directories.flatMap(dir => {
    const normalized = path.normalize(dir).replace(/\\/g, '/');
    return glob.sync(normalized);
  });

  const targets = allFiles.filter(file => {
    const ext = path.extname(file);
    const isDeclaration = file.endsWith('.d.ts');
    return formats.includes(ext) && !isDeclaration;
  });

  const classes: Newable[] = [];
  for (const file of targets) {
    try {
      const mod = await loadModule(file);
      const exported = mod.default ?? mod;
      collectClasses(exported, classes);
    } catch (err) {
      console.error(`Failed to load ${file}:`, err);
    }
  }

  return classes;
}
