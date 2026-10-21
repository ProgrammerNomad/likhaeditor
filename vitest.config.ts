import { defineConfig } from 'vitest/config';
import { realpathSync } from 'node:fs';
import { resolve } from 'node:path';

export default defineConfig({
  root: realpathSync(process.cwd()),
  resolve: {
    alias: Object.fromEntries(['core', 'plugins', 'ui'].map(name => [
      `@likhaeditor/${name}`, resolve(realpathSync(process.cwd()), `packages/${name}/src/index.ts`),
    ])),
  },
  test: {
    environment: 'happy-dom',
    globals: true,
  },
});
