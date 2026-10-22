import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

// TypeScript's bundler resolution emits extensionless relative specifiers.
// Published ESM declarations also need to work in NodeNext consumers.
function visit(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (entry.name.endsWith('.d.ts')) {
      const source = readFileSync(path, 'utf8');
      const output = source.replace(/((?:from\s*|import\s*\(\s*)['"])(\.\.?\/[^'"]+)(['"])/g,
        (match, prefix, specifier, suffix) => {
          if (extname(specifier)) return match;
          if (!existsSync(resolve(dirname(path), `${specifier}.d.ts`))) {
            throw new Error(`Cannot resolve declaration ${specifier} in ${path}`);
          }
          return `${prefix}${specifier}.js${suffix}`;
        });
      if (output !== source) writeFileSync(path, output);
    }
  }
}
visit(resolve('dist'));
