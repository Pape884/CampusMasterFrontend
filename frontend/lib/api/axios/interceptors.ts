'use client';

import { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { cacheManager } from './cache';

export function setupInterceptors(instance: any) {
    // Request interceptor
    instance.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // Ajout token depuis localStorage (client seulement)
            if (typeof window !== 'undefined') {
                const token = localStorage.getItem('auth_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }

            // Vérification cache
            const useCache = config.headers['X-Use-Cache'];
            const cacheKey = config.headers['X-Cache-Key'];

            if (useCache && cacheKey) {
                const cached = cacheManager.get(cacheKey);
                if (cached) {
                    // Annuler la requête et retourner données cachées
                    throw {
                        __fromCache: true,
                        data: cached,
                        config
                    };
                }
            }

            return config;
        },
        (error: any) => Promise.reject(error)
    );

    // Response interceptor
    instance.interceptors.response.use(
        (response: AxiosResponse) => {
            // Mise en cache si demandé
            const cacheKey = response.config.headers['X-Cache-Key'];
            const cacheTTL = response.config.headers['X-Cache-TTL'];

            if (cacheKey && response.status === 200) {
                const ttl = cacheTTL ? parseInt(cacheTTL) : 300000; // 5 min
                cacheManager.set(cacheKey, response.data, ttl);
            }

            return response;
        },
        (error: AxiosError) => {
            // Gestion spécifique Next.js
            if (error.response?.status === 401) {
                // Redirection vers login
                //message pour informer session expiré
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }

            // Gestion erreurs réseau
            if (!error.response) {
                console.error('Erreur réseau ou serveur indisponible');
            }

            return Promise.reject(error);
        }
    );
}