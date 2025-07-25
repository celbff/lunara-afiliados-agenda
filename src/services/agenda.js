// src/services/agenda.js
class AgendaService {
    constructor() {
        this.dbName = 'LunaraAgenda';
        this.version = 1;
        this.db = null;
        this.initDB();
    }

    async initDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('agendamentos')) {
                    const store = db.createObjectStore('agendamentos', { keyPath: 'id', autoIncrement: true });
                    store.createIndex('terapeutaId', 'terapeutaId', { unique: false });
                    store.createIndex('data', 'data', { unique: false });
                    store.createIndex('afiliadoId', 'afiliadoId', { unique: false });
                }
            };
        });
    }

    async adicionar(agendamento) {
        await this.initDB();
        const tx = this.db.transaction(['agendamentos'], 'readwrite');
        const store = tx.objectStore('agendamentos');
        store.add(agendamento);
        return tx.complete;
    }

    async listarTodos() {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['agendamentos'], 'readonly');
            const store = tx.objectStore('agendamentos');
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getByTerapeuta(terapeutaId) {
        await this.initDB();
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(['agendamentos'], 'readonly');
            const store = tx.objectStore('agendamentos');
            const index = store.index('terapeutaId');
            const request = index.getAll(terapeutaId);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async syncToServer() {
        if (!navigator.onLine) return;

        const agendamentos = await this.listarTodos();
        const naoSincronizados = agendamentos.filter(a => !a.sincronizado);

        for (const agendamento of naoSincronizados) {
            try {
                const response = await fetch('https://seu-api.com/agendamentos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(agendamento)
                });

                if (response.ok) {
                    // Marca como sincronizado
                    await this.marcarComoSincronizado(agendamento.id);
                }
            } catch (error) {
                console.warn('Falha ao sincronizar:', error);
            }
        }
    }

    async marcarComoSincronizado(id) {
        await this.initDB();
        const tx = this.db.transaction(['agendamentos'], 'readwrite');
        const store = tx.objectStore('agendamentos');
        const request = store.get(id);
        
        request.onsuccess = () => {
            const data = request.result;
            data.sincronizado = true;
            store.put(data);
        };
        return tx.complete;
    }
}
