'use client';

import axios from 'axios';
import { setupInterceptors } from './interceptors';

// URLs selon l'environnement
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Instance principale
export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Important pour les cookies/sessions
});

// Instance SSR (pour Server Components)
export const ssrApiClient = axios.create({
    baseURL: API_URL,
    timeout: 5000,
});

// Configurer les intercepteurs
setupInterceptors(apiClient);

export default apiClient;