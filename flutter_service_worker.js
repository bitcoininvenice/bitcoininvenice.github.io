'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "f25dfb697985a8b4291f5e280526e5e8",
"version.json": "9ef4978c02f35e4bf3d61ce55716b8f1",
"index.html": "277cf074199d47512ff4809707d967d1",
"/": "277cf074199d47512ff4809707d967d1",
"main.dart.js": "839e518a7fb55c0f6664dd484d34a648",
"flutter.js": "f393d3c16b631f36852323de8e583132",
"icons/favicon-16x16.png": "7c8f142b2ea92f7be490a27ce8bc7fc7",
"icons/favicon.ico": "4525f5e3cfecee2bead44d4895c550e2",
"icons/apple-icon.png": "6dcf34d768dd3d89e34c53cf2f4591a0",
"icons/apple-icon-144x144.png": "0d3aef6f2534f601c4c62605b05245cc",
"icons/android-icon-192x192.png": "60aa61cd9933eebad01304152281578e",
"icons/apple-icon-precomposed.png": "6dcf34d768dd3d89e34c53cf2f4591a0",
"icons/apple-icon-114x114.png": "2c288d67bb5bab77887604eee9d22920",
"icons/ms-icon-310x310.png": "9490f9c55f8a092a35548883b26ed121",
"icons/ms-icon-144x144.png": "0d3aef6f2534f601c4c62605b05245cc",
"icons/apple-icon-57x57.png": "99606a5e486289afd4181d27299e89e0",
"icons/apple-icon-152x152.png": "9aadcf35faa8759c145f1bc8c5184dce",
"icons/ms-icon-150x150.png": "57e5f7bb95da9c23d5c71819e9f3c1c3",
"icons/android-icon-72x72.png": "7f1d62d88eb8ce6a019780cd7ddeb19f",
"icons/android-icon-96x96.png": "b2121636e66be5585d1eff1da2ceca2c",
"icons/android-icon-36x36.png": "46195a7b072ebc4079f917729d764585",
"icons/apple-icon-180x180.png": "188682434f8f30ea0e88d2fb967a86b9",
"icons/favicon-96x96.png": "b2121636e66be5585d1eff1da2ceca2c",
"icons/android-icon-48x48.png": "66441c841b24857c161411de01a85cde",
"icons/apple-icon-76x76.png": "5b13d30fd811b1f1bc1e30a7ec78fd0b",
"icons/apple-icon-60x60.png": "d8c29cd91c3ed314dbe2d1c74907858c",
"icons/browserconfig.xml": "a15992d8359649acddbf9f2bbf21f6b4",
"icons/android-icon-144x144.png": "0d3aef6f2534f601c4c62605b05245cc",
"icons/apple-icon-72x72.png": "7f1d62d88eb8ce6a019780cd7ddeb19f",
"icons/apple-icon-120x120.png": "31c2301a4dc82b83e775801624031681",
"icons/favicon-32x32.png": "969e30915f1fd41e42ed203157aa4f4b",
"icons/ms-icon-70x70.png": "f82948d408f75173748c10758a18794b",
"manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"assets/images/logo.png": "649c117ca9a3240ce5a9b198d64a8aa8",
"assets/AssetManifest.json": "8f194a61352e7880288e13bc7b508127",
"assets/NOTICES": "05389f7d0a6669aed392f9ba87eb50ef",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/AssetManifest.bin.json": "fd9875ad1d1f18e7de1cefd45733f849",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "7e0787ecff21cf87e5bdf8fd8347c398",
"assets/fonts/MaterialIcons-Regular.otf": "0db35ae7a415370b89e807027510caf0",
"canvaskit/skwasm.js": "694fda5704053957c2594de355805228",
"canvaskit/skwasm.js.symbols": "262f4827a1317abb59d71d6c587a93e2",
"canvaskit/canvaskit.js.symbols": "48c83a2ce573d9692e8d970e288d75f7",
"canvaskit/skwasm.wasm": "9f0c0c02b82a910d12ce0543ec130e60",
"canvaskit/chromium/canvaskit.js.symbols": "a012ed99ccba193cf96bb2643003f6fc",
"canvaskit/chromium/canvaskit.js": "671c6b4f8fcc199dcc551c7bb125f239",
"canvaskit/chromium/canvaskit.wasm": "b1ac05b29c127d86df4bcfbf50dd902a",
"canvaskit/canvaskit.js": "66177750aff65a66cb07bb44b8c6422b",
"canvaskit/canvaskit.wasm": "1f237a213d7370cf95f443d896176460",
"canvaskit/skwasm.worker.js": "89990e8c92bcb123999aa81f7e203b1c"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
