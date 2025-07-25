// src/workers/service-worker.js
const CACHE_NAME = 'lunara-agenda-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

// Cache de arquivos estáticos
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/telas/afiliado.html',
                '/telas/terapeuta.html',
                '/src/services/agenda.js',
                '/manifest.json',
                '/assets/icon-192.png'
            ]);
        })
    );
});

// Resposta com cache ou rede
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        // Para requisições de API, tenta rede primeiro, depois usa cache
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // Para arquivos estáticos, usa cache primeiro
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// Background Sync para agendamentos offline
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-agendamentos') {
        event.waitUntil(
            (async () => {
                const clients = await self.clients.matchAll();
                for (const client of clients) {
                    // Notifica a página que a sincronização começou
                    client.postMessage({ type: 'SYNCING' });
                }

                // Aqui você chama a lógica de sync (ex: reprocessar agendamentos offline)
                // No cliente, você já tem a função `agenda.syncToServer()`
                // Este é um exemplo simplificado
                console.log('Sincronizando agendamentos offline...');
            })()
        );
    }
});

// Ativação
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});
