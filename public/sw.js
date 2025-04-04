const CACHE_NAME = 'tri-facta-v0.3.1';
const CDN_CACHE_NAME = 'tri-facta-cdn-v0.3.1';

// CDN 资源列表
const cdnResources = [
  'https://cdn.jsdelivr.net/npm/react@18.2.0/umd/react.production.min.js',
  'https://cdn.jsdelivr.net/npm/react-dom@18.2.0/umd/react-dom.production.min.js',
  'https://cdn.jsdelivr.net/npm/framer-motion@11.18.2/dist/framer-motion.min.js',
  'https://cdn.jsdelivr.net/npm/@chakra-ui/react@2.8.2/dist/chakra-ui-react.min.js',
  'https://cdn.jsdelivr.net/npm/@chakra-ui/icons@2.8.2/dist/chakra-ui-icons.min.js',
];

const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/triangle-diagram.svg',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
];

// 检查是否为开发环境
const isDev = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

self.addEventListener('install', (event) => {
  if (isDev) {
    // 在开发环境中，跳过等待，直接激活
    self.skipWaiting();
    return;
  }

  event.waitUntil(
    Promise.all([
      // 缓存应用资源
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened app cache');
        return cache.addAll(urlsToCache);
      }),
      // 缓存 CDN 资源
      caches.open(CDN_CACHE_NAME).then((cache) => {
        console.log('Opened CDN cache');
        return cache.addAll(cdnResources);
      }),
    ]).catch((error) => {
      console.error('Cache installation failed:', error);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // 在开发环境中，不拦截任何请求
  if (isDev) {
    return;
  }

  // 只处理 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 检查是否是 CDN 请求
  const isCdnRequest = cdnResources.some((url) => event.request.url === url);
  const cacheName = isCdnRequest ? CDN_CACHE_NAME : CACHE_NAME;

  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200) {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(cacheName).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== CDN_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
