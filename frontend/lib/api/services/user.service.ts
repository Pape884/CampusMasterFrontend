'use client';

import { apiClient } from '../axios/client';
import { cacheManager } from '../axios/cache';
import { User, UserCreateDto, UserRole, UsersResponse, UserStats, UserStatus, UserUpdateDto } from '.';


export interface UserFilters {
  search?: string;
  role?: UserRole | 'all';
  status?: UserStatus | 'all';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class UserService {
  private basePath = '/users';

  /**
   * RÉCUPÉRER TOUS LES UTILISATEURS AVEC FILTRES
   */
  async getUsers(filters: UserFilters = {}): Promise<UsersResponse> {
    try {
      const cacheKey = `users:${JSON.stringify(filters)}`;
      
      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Utilisateurs récupérés du cache');
        console.log(cached)
        return cached;
      }

      // Construire les paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.role && filters.role !== 'all') params.append('role', filters.role);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const url = `${this.basePath}?${params.toString()}`;
      
      console.log(`📤 Récupération des utilisateurs: ${url}`);
      
      const response = await apiClient.get<UsersResponse>(url, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      });

      console.log(`📥 ${response.data.users.length} utilisateurs récupérés`);
      
      // Mettre en cache
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des utilisateurs:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER UN UTILISATEUR PAR ID
   */
  async getUserById(id: string): Promise<User> {
    try {
      const cacheKey = `user:${id}`;
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log(`📤 Récupération de l'utilisateur ${id}`);
      
      const response = await apiClient.get<User>(`${this.basePath}/${id}`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '600000', // 10 minutes
        },
      });

      console.log(`✅ Utilisateur ${id} récupéré:`, response.data.email);
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur récupération utilisateur ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * CRÉER UN NOUVEL UTILISATEUR
   */
  async createUser(userData: UserCreateDto): Promise<User> {
    try {
      console.log('📝 Création d\'un nouvel utilisateur:', userData.email);
      
      const response = await apiClient.post<User>(this.basePath, userData);
      
      // Invalider le cache des listes
      this.invalidateUsersCache();
      
      console.log('✅ Utilisateur créé avec succès:', response.data.email);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur création utilisateur:', error);
      throw this.handleError(error);
    }
  }

  /**
   * METTRE À JOUR UN UTILISATEUR
   */
  async updateUser(id: string, userData: UserUpdateDto): Promise<User> {
    try {
      console.log(`🔄 Mise à jour de l'utilisateur ${id}:`, userData);
      
      const response = await apiClient.put<User>(`${this.basePath}/${id}`, userData);
      
      // Mettre à jour le cache individuel
      const cacheKey = `user:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateUsersCache();
      
      console.log(`✅ Utilisateur ${id} mis à jour`);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour utilisateur ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * CHANGER LE STATUT D'UN UTILISATEUR (actif/inactif)
   */
  async toggleUserStatus(id: string, currentStatus: UserStatus): Promise<User> {
    const newStatus: UserStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    
    try {
      console.log(`🔄 Changement statut utilisateur ${id}: ${currentStatus} → ${newStatus}`);
      
      const response = await apiClient.patch<User>(`${this.basePath}/${id}/status`, {
        status: newStatus
      });
      
      // Mettre à jour le cache individuel
      const cacheKey = `user:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateUsersCache();
      
      console.log(`✅ Statut utilisateur ${id} changé à: ${newStatus}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur changement statut utilisateur ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * SUPPRIMER UN UTILISATEUR
   */
  async deleteUser(id: string): Promise<void> {
    try {
      console.log(`🗑️ Suppression de l'utilisateur ${id}`);
      
      await apiClient.delete(`${this.basePath}/${id}`);
      
      // Supprimer le cache individuel
      const cacheKey = `user:${id}`;
      cacheManager.delete(cacheKey);
      
      // Invalider le cache des listes
      this.invalidateUsersCache();
      
      console.log(`✅ Utilisateur ${id} supprimé`);
      
    } catch (error: any) {
      console.error(`❌ Erreur suppression utilisateur ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER LES STATISTIQUES UTILISATEURS
   */
  async getStats(): Promise<UserStats> {
    try {
      const cacheKey = 'users:stats';
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log('📊 Récupération des statistiques utilisateurs');
      
      const response = await apiClient.get<UserStats>(`${this.basePath}/stats`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      });

      console.log('✅ Statistiques récupérées');
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur récupération statistiques:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RECHERCHER DES UTILISATEURS
   */
  async searchUsers(query: string): Promise<User[]> {
    try {
      const response = await apiClient.get<User[]>(`${this.basePath}/search`, {
        params: { q: query }
      });
      
      console.log(`🔍 ${response.data.length} résultats pour "${query}"`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur recherche utilisateurs:', error);
      throw this.handleError(error);
    }
  }

  /**
   * INVALIDER LE CACHE DES UTILISATEURS
   */
  private invalidateUsersCache(): void {
    // Supprimer tous les caches qui commencent par 'users:'
    cacheManager.deleteByPrefix('users:');
    // Supprimer aussi le cache des statistiques
    cacheManager.delete('users:stats');
    
    console.log('🧹 Cache utilisateurs invalidé');
  }

  /**
   * GESTIONNAIRE D'ERREURS
   */
  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Données invalides');
        case 401:
          return new Error('Non autorisé');
        case 403:
          return new Error('Accès interdit');
        case 404:
          return new Error('Utilisateur non trouvé');
        case 409:
          return new Error(data.message || 'Conflit (email ou matricule déjà utilisé)');
        case 422:
          return new Error(data.errors?.[0]?.message || 'Erreur de validation');
        case 500:
          return new Error('Erreur serveur. Veuillez réessayer plus tard');
        default:
          return new Error(`Erreur ${status}: ${data.message || 'Erreur inconnue'}`);
      }
    }
    
    if (error.request) {
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
    }
    
    return new Error('Une erreur inattendue est survenue');
  }
}

export const userService = new UserService();

/**
 * HOOK REACT POUR LES UTILISATEURS
 */
export function useUsers() {
  return {
    getUsers: userService.getUsers.bind(userService),
    getUserById: userService.getUserById.bind(userService),
    createUser: userService.createUser.bind(userService),
    updateUser: userService.updateUser.bind(userService),
    toggleUserStatus: userService.toggleUserStatus.bind(userService),
    deleteUser: userService.deleteUser.bind(userService),
    getStats: userService.getStats.bind(userService),
    searchUsers: userService.searchUsers.bind(userService),
    clearCache: () => {
      cacheManager.deleteByPrefix('users:');
      cacheManager.delete('users:stats');
    }
  };
}