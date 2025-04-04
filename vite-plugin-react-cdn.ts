import type { Plugin } from 'vite';

export function reactCdnPlugin(): Plugin {
  return {
    name: 'vite-plugin-react-cdn',
    transformIndexHtml(html) {
      const isDev = process.env.NODE_ENV === 'development';
      const reactVersion = '18.2.0';
      const chakraVersion = '2.8.2';
      const framerMotionVersion = '11.18.2';

      const cdnBase = 'https://cdn.jsdelivr.net/npm';

      const cdnScripts = isDev
        ? `
          <script crossorigin src="${cdnBase}/react@${reactVersion}/umd/react.development.js"></script>
          <script crossorigin src="${cdnBase}/react-dom@${reactVersion}/umd/react-dom.development.js"></script>
          <script crossorigin src="${cdnBase}/framer-motion@${framerMotionVersion}/dist/framer-motion.js"></script>
          <script crossorigin src="${cdnBase}/@chakra-ui/react@${chakraVersion}/dist/chakra-ui-react.js"></script>
          <script crossorigin src="${cdnBase}/@chakra-ui/icons@${chakraVersion}/dist/chakra-ui-icons.js"></script>
        `
        : `
          <script crossorigin src="${cdnBase}/react@${reactVersion}/umd/react.production.min.js"></script>
          <script crossorigin src="${cdnBase}/react-dom@${reactVersion}/umd/react-dom.production.min.js"></script>
          <script crossorigin src="${cdnBase}/framer-motion@${framerMotionVersion}/dist/framer-motion.min.js"></script>
          <script crossorigin src="${cdnBase}/@chakra-ui/react@${chakraVersion}/dist/chakra-ui-react.min.js"></script>
          <script crossorigin src="${cdnBase}/@chakra-ui/icons@${chakraVersion}/dist/chakra-ui-icons.min.js"></script>
        `;

      return html.replace('%REACT_CDN%', cdnScripts);
    },
  };
}
