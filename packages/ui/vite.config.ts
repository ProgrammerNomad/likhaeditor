import { defineConfig } from 'vite';
import { bundleNotices } from '../../scripts/bundle-notices';
import { resolve } from 'path';

export default defineConfig({
  plugins: [bundleNotices()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LikhaUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['@likhaeditor/core', 'lucide'],
    },
    cssCodeSplit: false,
    sourcemap: true,
    minify: 'terser',
  },
});
