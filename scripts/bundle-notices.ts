import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

/** Ship the license texts for dependencies actually included in each bundle. */
export function bundleNotices(): Plugin {
  return {
    name: 'likha-bundle-notices',
    generateBundle(_options, bundle) {
      const packages = new Map<string, string>();
      for (const output of Object.values(bundle)) {
        if (output.type !== 'chunk') continue;
        for (const id of Object.keys(output.modules)) {
          if (!id.includes('node_modules') || id.startsWith('\0')) continue;
          let directory = dirname(id.split('?')[0]);
          while (dirname(directory) !== directory) {
            const path = join(directory, 'package.json');
            if (existsSync(path)) {
              const manifest = JSON.parse(readFileSync(path, 'utf8'));
              if (manifest.name && manifest.version) {
                const key = `${manifest.name}@${manifest.version}`;
                if (!packages.has(key)) {
                  const files = readdirSync(directory, { withFileTypes: true })
                    .filter(file => file.isFile() && /^(licen[sc]e|copying|notice)(\.|$|-)/i.test(file.name));
                  if (!files.length) this.error(`Missing bundled license text: ${key}`);
                  const texts = files.map(file => `${file.name}\n${readFileSync(join(directory, file.name), 'utf8')}`);
                  packages.set(key, `${key}\nLicense: ${manifest.license ?? 'See license text'}\n${texts.join('\n\n')}`);
                }
                break;
              }
            }
            directory = dirname(directory);
          }
        }
      }
      this.emitFile({ type: 'asset', fileName: 'THIRD-PARTY-NOTICES.txt',
        source: 'Third-party software included in this bundle. Retain these notices when redistributing.\n\n' +
          [...packages.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => value).join('\n\n' + '='.repeat(72) + '\n\n') + '\n',
      });
    },
  };
}
