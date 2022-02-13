import react from '@vitejs/plugin-react';
import antdDayjs from 'antd-dayjs-vite-plugin';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), antdDayjs()],
  server: {
    port: 11251,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:11252',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@src': '/src',
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@hooks': '/src/hooks',
      '@layouts': '/src/layouts',
      '@models': '/src/models',
      '@pages': '/src/pages',
      '@services': '/src/services',
    },
  },
});
