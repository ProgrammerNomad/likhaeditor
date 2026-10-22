import { defineConfig } from 'vite';
import { bundleNotices } from '../../scripts/bundle-notices';
import { resolve } from 'path';

export default defineConfig({
  plugins: [bundleNotices()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LikhaEditor',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: [
        'prosemirror-model',
        'prosemirror-state',
        'prosemirror-view',
        'prosemirror-transform',
        'prosemirror-commands',
        'prosemirror-keymap',
        'prosemirror-history',
        'prosemirror-schema-basic',
        'prosemirror-schema-list',
        'prosemirror-tables',
      ],
    },
    sourcemap: true,
    minify: 'terser',
  },
});
