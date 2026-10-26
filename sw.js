/* Local application shell only. No storage of user media or personal models. */
const CACHE="vtube-lab-shell-2026-10-26-v1";
const ASSETS=[
  "./web/","./web/index.html","./web/style.css","./web/app.mjs",
  "./src/replay.mjs","./src/physics.mjs","./src/garment.mjs",
  "./manifest.webmanifest","./app-icon.svg"
];
const allow=new Set(ASSETS.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(CACHE)
    .then(cache=>cache.addAll([...allow]))
    .then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(
    keys.filter(key=>key.startsWith("vtube-lab-shell-")&&key!==CACHE)
      .map(key=>caches.delete(key))
  )).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET" || !allow.has(request.url))return;
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request)));
});
