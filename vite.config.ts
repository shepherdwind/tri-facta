import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: [
            'mobx',
            'mobx-react-lite',
            'react-router-dom',
            'i18next',
            'i18next-browser-languagedetector',
            'react-i18next',
          ],
          chakra: [
            '@chakra-ui/react',
            '@chakra-ui/icons',
            '@emotion/react',
            '@emotion/styled',
            'framer-motion',
          ],
        },
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },
}));
