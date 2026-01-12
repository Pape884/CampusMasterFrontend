'use client';

import { apiClient } from '../axios/client';
import { cacheManager } from '../axios/cache';
import { Department, DepartmentCreateDto, DepartmentStatus, DepartmentsResponse, DepartmentStats, DepartmentUpdateDto, DepartmentFilters } from '.';


class DepartmentService {
  private basePath = '/departments';

  /**
   * RÉCUPÉRER TOUS LES DÉPARTEMENTS AVEC FILTRES
   */
  async getDepartments(filters: DepartmentFilters = {}): Promise<DepartmentsResponse> {
    try {
      const cacheKey = `departments:${JSON.stringify(filters)}`;
      
      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Départements récupérés du cache');
        return cached;
      }

      // Construire les paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.batiment) params.append('batiment', filters.batiment);
      if (filters.page) params.append('page', filters.page.toString());
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

      const url = `${this.basePath}?${params.toString()}`;
      
      console.log(`📤 Récupération des départements: ${url}`);
      
      const response = await apiClient.get<DepartmentsResponse>(url, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      });

      console.log(`📥 ${response.data.departments.length} départements récupérés`);
      
      // Mettre en cache
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des départements:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER UN DÉPARTEMENT PAR ID
   */
  async getDepartmentById(id: string): Promise<Department> {
    try {
      const cacheKey = `department:${id}`;
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log(`📤 Récupération du département ${id}`);
      
      const response = await apiClient.get<Department>(`${this.basePath}/${id}`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '600000', // 10 minutes
        },
      });

      console.log(`✅ Département ${id} récupéré:`, response.data.nom);
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur récupération département ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * CRÉER UN NOUVEAU DÉPARTEMENT
   */
  async createDepartment(departmentData: DepartmentCreateDto): Promise<Department> {
    try {
      console.log('📝 Création d\'un nouveau département:', departmentData.nom);
      
      const response = await apiClient.post<Department>(this.basePath, departmentData);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log('✅ Département créé avec succès:', response.data.nom);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur création département:', error);
      throw this.handleError(error);
    }
  }

  /**
   * METTRE À JOUR UN DÉPARTEMENT
   */
  async updateDepartment(id: string, departmentData: DepartmentUpdateDto): Promise<Department> {
    try {
      console.log(`🔄 Mise à jour du département ${id}:`, departmentData);
      
      const response = await apiClient.put<Department>(`${this.basePath}/${id}`, departmentData);
      
      // Mettre à jour le cache individuel
      const cacheKey = `department:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log(`✅ Département ${id} mis à jour`);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour département ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * CHANGER LE STATUT D'UN DÉPARTEMENT
   */
  async toggleDepartmentStatus(id: string, currentStatus: DepartmentStatus): Promise<Department> {
    const newStatus: DepartmentStatus = currentStatus === 'actif' ? 'inactif' : 'actif';
    
    try {
      console.log(`🔄 Changement statut département ${id}: ${currentStatus} → ${newStatus}`);
      
      const response = await apiClient.patch<Department>(`${this.basePath}/${id}/status`, {
        status: newStatus
      });
      
      // Mettre à jour le cache individuel
      const cacheKey = `department:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log(`✅ Statut département ${id} changé à: ${newStatus}`);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur changement statut département ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * SUPPRIMER UN DÉPARTEMENT
   */
  async deleteDepartment(id: string): Promise<void> {
    try {
      console.log(`🗑️ Suppression du département ${id}`);
      
      await apiClient.delete(`${this.basePath}/${id}`);
      
      // Supprimer le cache individuel
      const cacheKey = `department:${id}`;
      cacheManager.delete(cacheKey);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log(`✅ Département ${id} supprimé`);
      
    } catch (error: any) {
      console.error(`❌ Erreur suppression département ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER LES STATISTIQUES DES DÉPARTEMENTS
   */
  async getStats(): Promise<DepartmentStats> {
    try {
      const cacheKey = 'departments:stats';
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log('📊 Récupération des statistiques départements');
      
      const response = await apiClient.get<DepartmentStats>(`${this.basePath}/stats`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      });

      console.log('✅ Statistiques départements récupérées');
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur récupération statistiques:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RECHERCHER DES DÉPARTEMENTS
   */
  async searchDepartments(query: string): Promise<Department[]> {
    try {
      const response = await apiClient.get<Department[]>(`${this.basePath}/search`, {
        params: { q: query }
      });
      
      console.log(`🔍 ${response.data.length} résultats pour "${query}"`);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur recherche départements:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER LES ENSEIGNANTS D'UN DÉPARTEMENT
   */
  async getDepartmentTeachers(departmentId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`${this.basePath}/${departmentId}/teachers`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération enseignants département ${departmentId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER LES ÉTUDIANTS D'UN DÉPARTEMENT
   */
  async getDepartmentStudents(departmentId: string): Promise<any[]> {
    try {
      const response = await apiClient.get(`${this.basePath}/${departmentId}/students`);
      return response.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération étudiants département ${departmentId}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * INVALIDER LE CACHE DES DÉPARTEMENTS
   */
  private invalidateDepartmentsCache(): void {
    // Supprimer tous les caches qui commencent par 'departments:'
    cacheManager.deleteByPrefix('departments:');
    // Supprimer aussi le cache des statistiques
    cacheManager.delete('departments:stats');
    
    console.log('🧹 Cache départements invalidé');
  }

  /**
   * FORMATER LE BUDGET
   */
  formatBudget(budget: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget);
  }

  /**
   * GETTER POUR LES COULEURS DE PERFORMANCE
   */
  getPerformanceColor(performance: number): string {
    if (performance >= 90) return 'text-green-600 bg-green-100';
    if (performance >= 75) return 'text-blue-600 bg-blue-100';
    if (performance >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  }

  /**
   * GETTER POUR LES COULEURS DE STATUT
   */
  getStatusColor(status: DepartmentStatus): string {
    const colors = {
      actif: 'bg-green-100 text-green-800',
      inactif: 'bg-red-100 text-red-800',
      en_construction: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * GETTER POUR LES LABELS DE STATUT
   */
  getStatusLabel(status: DepartmentStatus): string {
    const labels = {
      actif: 'Actif',
      inactif: 'Inactif',
      en_construction: 'En construction',
    };
    return labels[status] || status;
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
          return new Error('Département non trouvé');
        case 409:
          return new Error(data.message || 'Conflit (code ou nom déjà utilisé)');
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

export const departmentService = new DepartmentService();

/**
 * HOOK REACT POUR LES DÉPARTEMENTS
 */
export function useDepartments() {
  return {
    getDepartments: departmentService.getDepartments.bind(departmentService),
    getDepartmentById: departmentService.getDepartmentById.bind(departmentService),
    createDepartment: departmentService.createDepartment.bind(departmentService),
    updateDepartment: departmentService.updateDepartment.bind(departmentService),
    toggleDepartmentStatus: departmentService.toggleDepartmentStatus.bind(departmentService),
    deleteDepartment: departmentService.deleteDepartment.bind(departmentService),
    getStats: departmentService.getStats.bind(departmentService),
    searchDepartments: departmentService.searchDepartments.bind(departmentService),
    getDepartmentTeachers: departmentService.getDepartmentTeachers.bind(departmentService),
    getDepartmentStudents: departmentService.getDepartmentStudents.bind(departmentService),
    formatBudget: departmentService.formatBudget.bind(departmentService),
    getPerformanceColor: departmentService.getPerformanceColor.bind(departmentService),
    getStatusColor: departmentService.getStatusColor.bind(departmentService),
    getStatusLabel: departmentService.getStatusLabel.bind(departmentService),
    clearCache: () => {
      cacheManager.deleteByPrefix('departments:');
      cacheManager.delete('departments:stats');
    }
  };
}