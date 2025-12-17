import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LikhaPlugins',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@likha/core', 'prosemirror-keymap', 'prosemirror-inputrules'],
    },
    sourcemap: true,
    minify: 'terser',
  },
});
