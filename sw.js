// 홈 화면 앱 설치를 위한 최소한의 서비스워커
// 가계부 데이터는 저장하지 않고, 여는 화면(아이콘·껍데기)만 보관해요.
var CACHE = 'my-budget-v1';
var FILES = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon.svg'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (new URL(e.request.url).origin !== location.origin) return;   // 구글 쪽 요청은 건드리지 않아요
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
});
