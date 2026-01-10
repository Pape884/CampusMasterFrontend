'use client';

import { apiClient } from '../axios/client';
import { cacheManager } from '../axios/cache';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

export interface UserListResponse {
    users: User[];
    total: number;
    page: number;
    totalPages: number;
}

class UserService {
    private basePath = '/users';

    // GET avec cache et SSR support
    async getUsers(params?: {
        page?: number;
        limit?: number;
        search?: string;
    }, options?: {
        useCache?: boolean;
        cacheKey?: string;
    }): Promise<UserListResponse> {
        const cacheKey = options?.cacheKey || `users:${JSON.stringify(params || {})}`;

        // Vérifier cache si activé
        if (options?.useCache !== false) {
            const cached = cacheManager.get(cacheKey);
            if (cached) return cached;
        }

        const response = await apiClient.get<UserListResponse>(this.basePath, {
            params,
            headers: {
                'X-Use-Cache': options?.useCache !== false,
                'X-Cache-Key': cacheKey,
            },
        });

        return response.data;
    }

    // GET pour Server Component (SSR)
    async getUsersSSR(params?: any): Promise<UserListResponse> {
        // Utilise l'instance SSR (sans intercepteurs client)
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}${this.basePath}?${new URLSearchParams(params)}`,
            {
                cache: 'force-cache', // Utilise le cache HTTP de Next.js
                next: { revalidate: 60 }, // ISR: revalide toutes les 60s
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        return response.json();
    }

    // CRUD operations
    async createUser(data: Partial<User>): Promise<User> {
        const response = await apiClient.post<User>(this.basePath, data);

        // Invalider cache
        cacheManager.deleteByPrefix('users');

        return response.data;
    }

    async updateUser(id: string, data: Partial<User>): Promise<User> {
        const response = await apiClient.put<User>(`${this.basePath}/${id}`, data);

        // Mettre à jour le cache individuel
        cacheManager.set(`user:${id}`, response.data);

        // Invalider les listes
        cacheManager.deleteByPrefix('users:');

        return response.data;
    }

    // Optimistic update helper
    async optimisticUpdate(id: string, updateFn: (old: User) => User): Promise<void> {
        const cacheKey = `user:${id}`;
        const oldData = cacheManager.get(cacheKey);

        if (oldData) {
            // Update optimiste
            const optimisticData = updateFn(oldData);
            cacheManager.set(cacheKey, optimisticData);
        }
    }
}

export const userService = new UserService();