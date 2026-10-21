import { realpathSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Vite 5 resolves Windows junctions inconsistently when cwd is the alias path.
const root = realpathSync(fileURLToPath(new URL('..', import.meta.url)));
const result = spawnSync(process.execPath, [
  `${root}/node_modules/vitest/vitest.mjs`, ...process.argv.slice(2),
], { cwd: root, stdio: 'inherit' });
if (result.error) throw result.error;
process.exit(result.status ?? 1);
