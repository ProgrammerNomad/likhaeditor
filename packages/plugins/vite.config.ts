import { defineConfig } from 'vite';
import { bundleNotices } from '../../scripts/bundle-notices';
import { resolve } from 'path';

export default defineConfig({
  plugins: [bundleNotices()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LikhaPlugins',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: id => id === '@likhaeditor/core' || id.startsWith('prosemirror-'),
    },
    sourcemap: true,
    minify: 'terser',
  },
});
