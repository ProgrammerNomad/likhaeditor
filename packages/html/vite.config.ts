import { defineConfig } from 'vite';
import { bundleNotices } from '../../scripts/bundle-notices';
import path from 'path';

export default defineConfig({
  plugins: [bundleNotices()],
  resolve: {
    alias: {
      '@likhaeditor/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@likhaeditor/plugins': path.resolve(__dirname, '../plugins/src/index.ts'),
      '@likhaeditor/ui': path.resolve(__dirname, '../ui/src/index.ts')
    },
    dedupe: [
      'prosemirror-model',
      'prosemirror-state',
      'prosemirror-view',
      'prosemirror-transform',
      'prosemirror-commands',
      'prosemirror-keymap',
      'prosemirror-history',
      'prosemirror-schema-list',
      'prosemirror-schema-basic',
      'prosemirror-inputrules'
    ]
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'LikhaEditor',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => {
        if (format === 'es') return 'index.js';
        if (format === 'cjs') return 'index.cjs';
        return 'likha-editor.umd.js';
      }
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    minify: 'terser'
  }
});
