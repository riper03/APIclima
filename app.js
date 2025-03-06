    // Solicitar permiso de notificación al cargar la página
    if ('Notification' in window && 'serviceWorker' in navigator) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Permiso de notificación concedido');
            } else {
                console.log('Permiso de notificación denegado');
            }
        });
    
        // Registrar el Service Worker
        navigator.serviceWorker.register('./sw.js').then(function(registration) {
            console.log('Service Worker registrado con éxito', registration);
        }).catch(function(error) {
            console.log('Error al registrar el Service Worker:', error);
        });
    }
    