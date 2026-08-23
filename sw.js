const CACHE='mental-os-v7';
const ASSETS=['./','./index.html','./styles.css','./app.js','./scribble-crumple.js','./manifest.webmanifest'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.map(k=>caches.delete(k)));
  await self.clients.claim();
  const clients=await self.clients.matchAll({type:'window'});
  for(const client of clients){
    try{
      const u=new URL(client.url);
      if(u.origin===self.location.origin && !u.searchParams.has('__mental_v7')){
        u.searchParams.set('__mental_v7','1');
        client.navigate(u.toString());
      }
    }catch{}
  }
})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request,{cache:'no-store'}).then(res=>{
    const copy=res.clone();
    caches.open(CACHE).then(c=>c.put(e.request,copy)).catch(()=>{});
    return res;
  }).catch(()=>caches.match(e.request)));
});