var CACHE_NAME = 'v1Clima';
var cacheFiles = [
'./',
'./index.html',
'./style.css',
'./manifest.json',
'./script.js',
'./app.js',
'./sw.js',
'./img/atmosphere.svg',
'./img/chispeando.gif',
'./img/clear.svg',
'./img/clima.gif',
'./img/clouds.svg',
'./img/Desktop_Captura.png',
'./img/drizzle.svg',
'./img/icono1.png',
'./img/icono2.png',
'./img/lluvia.gif',
'./img/Mobile_Captura.png',
'./img/nevando.gif',
'./img/niebla.gif',
'./img/not-found.png',
'./img/nublado.gif',
'./img/rain.svg',
'./img/search-city.png',
'./img/snow.svg',
'./img/soleado.gif',
'./img/thunderstorm.svg',
'./img/tormenta.gif',
'./img/viento.gif'
]

self.addEventListener('install', function(e) {
    console.log('Service Worker: Instalado');
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('Service Worker: Cache abierto');
            return cache.addAll(cacheFiles);
        })
    );

    // Notificación al momento de la instalación
    self.registration.showNotification("¡Bienvenido para recibir el clima", {
        body: "Gracias por visitarnos, Te informaremos del clima.",
        icon: "img/icono1.png",
        badge: "img/icono1.png",
    });
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    const cacheWhitelist = ['v1Clima'];
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );

    // Notificación cuando el Service Worker está activado
    self.registration.showNotification("¡Estás listo para estar recibiendo pronosticos del tiempo!", {
        body: "¡Recibirás nuestras últimas actualizaciones aquí!",
        icon: "img/icono1.png",
        badge: "img/icono1.png",
    });
});

//fetch
self.addEventListener('fetch', function(e) {
    console.log('Service Worker: Fetching', e.request.url);
    
    e.respondWith(
        caches.match(e.request).then(function(response) {
            if(response) {
                console.log('Cache encontrada', e.request.url);
                return response;
            }
            var requestClone = e.request.clone();
            fetch(requestClone).then(function(response) {
                if(!response){
                    console.log('No se encontro respuesta');
                    return response;
                }
                var responseClone = response.clone();
                
                caches.open(CACHE_NAME).then(function(cache) {
                    cache.put(e.request, responseClone);
                    return response;
                });
            })
            .catch(function(err){
                console.log('Error al hacer fetch', err);
            })
        })
    )
})
// Acción al hacer clic en una notificación
self.addEventListener('notificationclick', function(event) {
    console.log('Notificación clickeada', event.notification);
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/index.html') 
    );
});
