'use client';

interface CacheItem {
    data: any;
    timestamp: number;
    ttl: number;
}

class CacheManager {
    private cache = new Map<string, CacheItem>();
    private maxItems = 50; // Limite mémoire

    // Stockage côté client seulement
    set(key: string, data: any, ttl: number = 300000): void {
        if (typeof window === 'undefined') return; // Skip SSR

        // Cleanup avant d'ajouter
        if (this.cache.size >= this.maxItems) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey !== undefined) {
                this.cache.delete(firstKey);
            }
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });

        // Sauvegarde dans sessionStorage pour persistance
        try {
            sessionStorage.setItem(`cache_${key}`, JSON.stringify({
                data,
                timestamp: Date.now(),
                ttl
            }));
        } catch (e) {
            // sessionStorage plein
        }
    }

    get(key: string): any {
        if (typeof window === 'undefined') return null;

        // Vérifier mémoire d'abord
        const memoryItem = this.cache.get(key);
        if (memoryItem) {
            if (Date.now() - memoryItem.timestamp < memoryItem.ttl) {
                return memoryItem.data;
            }
            this.cache.delete(key);
        }

        // Vérifier sessionStorage
        try {
            const stored = sessionStorage.getItem(`cache_${key}`);
            if (stored) {
                const item: CacheItem = JSON.parse(stored);
                if (Date.now() - item.timestamp < item.ttl) {
                    // Remettre en mémoire
                    this.cache.set(key, item);
                    return item.data;
                }
                sessionStorage.removeItem(`cache_${key}`);
            }
        } catch (e) {
            // Ignorer erreurs
        }

        return null;
    }

    delete(key: string): void {
        this.cache.delete(key);
        sessionStorage.removeItem(`cache_${key}`);
    }

    deleteByPrefix(prefix: string): void {
        // Supprimer de la mémoire
        for (const key of this.cache.keys()) {
            if (key.startsWith(prefix)) {
                this.cache.delete(key);
            }
        }

        // Supprimer du sessionStorage
        if (typeof window !== 'undefined') {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key?.startsWith(`cache_${prefix}`)) {
                    sessionStorage.removeItem(key);
                }
            }
        }
    }

    clear(): void {
        this.cache.clear();

        // Nettoyer sessionStorage
        if (typeof window !== 'undefined') {
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                if (key?.startsWith('cache_')) {
                    sessionStorage.removeItem(key);
                }
            }
        }
    }
}

export const cacheManager = new CacheManager();