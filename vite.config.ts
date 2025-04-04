import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { reactCdnPlugin } from './vite-plugin-react-cdn';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), reactCdnPlugin()],
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  build: {
    rollupOptions: {
      external: ['react', 'react-dom', '@chakra-ui/react', '@chakra-ui/icons', 'framer-motion'],
      output: {
        manualChunks: {
          vendor: [
            'mobx',
            'mobx-react-lite',
            'react-router-dom',
            'i18next',
            'i18next-browser-languagedetector',
            'react-i18next',
          ],
        },
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@chakra-ui/react': 'ChakraUI',
          '@chakra-ui/icons': 'ChakraIcons',
          'framer-motion': 'motion',
        },
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
