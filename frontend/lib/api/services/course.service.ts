'use client';

import { apiClient } from '../axios/client';
import { cacheManager } from '../axios/cache';
import { Department, DepartmentCreateDto, DepartmentStatus, DepartmentsResponse, DepartmentStats, DepartmentFilters, Course, CourseCreateDto, CourseUpdateDto, CourseResponse } from '.';


class CourseService {
  private basePath = '/courses';

  /**
   * RÉCUPÉRER TOUS LES COURS AVEC FILTRES
   */
  async getCourses(filters: DepartmentFilters = {}): Promise<DepartmentsResponse> {
    try {
      const cacheKey = `courses:${JSON.stringify(filters)}`;
      
      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        console.log('📦 Cours récupérés du cache: ', cached);
        return cached;
      }

      // Construire les paramètres de requête
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
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

      console.log(response.data)
      //console.log(`📥 ${response.data.data.length} départements récupérés`);
      
      // Mettre en cache
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des départements:', error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER UN COURS PAR ID
   */
  async getCourseById(id: string): Promise<Course> {
    try {
      const cacheKey = `course:${id}`;
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log(`📤 Récupération du cours ${id}`);
      
      const response = await apiClient.get<Course>(`${this.basePath}/${id}`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '600000', // 10 minutes
        },
      });

      console.log(`✅ Cours ${id} récupéré:`, response);
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur récupération cours ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * CRÉER UN NOUVEAU COURS
   */
  async createCourse(courseData: CourseCreateDto): Promise<Course> {
    try {
      console.log('📝 Création d\'un nouveau cours:', courseData.titre);
      
      const response = await apiClient.post<Course>(this.basePath, courseData);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log('✅ Cours créé avec succès:', response.data.titre);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur création cours:', error);
      throw this.handleError(error);
    }
  }

  /**
   * METTRE À JOUR UN COURS
   */
  async updateCourse(id: string, courseData: CourseUpdateDto): Promise<Course> {
    try {
      console.log(`🔄 Mise à jour du cours ${id}:`, courseData);
      
      const response = await apiClient.put<Course>(`${this.basePath}/${id}`, courseData);
      
      // Mettre à jour le cache individuel
      const cacheKey = `course:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log(`✅ Cours ${id} mis à jour`);
      
      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur mise à jour cours ${id}:`, error);
      throw this.handleError(error);
    }
  }

  async updateCourseStatus(id: string, status: string){
    try {
      const response = await apiClient.put<Course>(`${this.basePath}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * CHANGER LE STATUT D'UN COURS
   */
  async toggleCourseStatus(id: string, currentStatus: boolean): Promise<Department> {
    const isActive = !currentStatus;

    try {
      console.log(`🔄 Changement statut cours ${id}: ${currentStatus} → ${isActive}`);
      
      const response = await apiClient.patch<Department>(`${this.basePath}/${id}`, {
        isActive: isActive
      });
      
      // Mettre à jour le cache individuel
      const cacheKey = `course:${id}`;
      cacheManager.set(cacheKey, response.data);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();

      console.log(`✅ Statut cours ${id} changé à: ${isActive}`);

      return response.data;
      
    } catch (error: any) {
      console.error(`❌ Erreur changement statut cours ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * SUPPRIMER UN COURS
   */
  async deleteCourse(id: string): Promise<void> {
    try {
      console.log(`🗑️ Suppression du cours ${id}`);
      
      await apiClient.delete(`${this.basePath}/${id}`);
      
      // Supprimer le cache individuel
      const cacheKey = `course:${id}`;
      cacheManager.delete(cacheKey);
      
      // Invalider le cache des listes
      this.invalidateDepartmentsCache();
      
      console.log(`✅ Cours ${id} supprimé`);
      
    } catch (error: any) {
      console.error(`❌ Erreur suppression cours ${id}:`, error);
      throw this.handleError(error);
    }
  }

  /**
   * RÉCUPÉRER LES STATISTIQUES DES COURS
   */
  async getStats(): Promise<DepartmentStats> {
    try {
      const cacheKey = 'courses:stats';
      
      const cached = cacheManager.get(cacheKey);
      if (cached) {
        return cached;
      }

      console.log('📊 Récupération des statistiques cours');
      
      const response = await apiClient.get<DepartmentStats>(`${this.basePath}/stats`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      });

      console.log('✅ Statistiques cours récupérées');
      
      cacheManager.set(cacheKey, response.data);
      
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Erreur récupération statistiques:', error);
      throw this.handleError(error);
    }
  }

  /**
 * RECHERCHER DES COURS
   */
  async searchCourses(query: string): Promise<Course[]> {
    try {
      const response = await apiClient.get<Course[]>(`${this.basePath}/search`, {
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
   * RECUPERER LES COURS D'UN MODULE
   */
  async getCoursesByModule(moduleId: string): Promise<Course[]> {
    try {
      const response = await apiClient.get(`${this.basePath}/module/${moduleId}`);
      return response.data.data;
    } catch (error: any) {
      console.error(`❌ Erreur récupération cours module ${moduleId}:`, error);
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

export const courseService = new CourseService();

/**
 * HOOK REACT POUR LES COURS
 */
export function useCourses() {
  return {
    getCourses: courseService.getCourses.bind(courseService),
    getCourseById: courseService.getCourseById.bind(courseService),
    createCourse: courseService.createCourse.bind(courseService),
    updateCourse: courseService.updateCourse.bind(courseService),
    toggleCourseStatus: courseService.toggleCourseStatus.bind(courseService),
    deleteCourse: courseService.deleteCourse.bind(courseService),
    getStats: courseService.getStats.bind(courseService),
    searchCourses: courseService.searchCourses.bind(courseService),
    getCoursesByModule: courseService.getCoursesByModule.bind(courseService),
    formatBudget: courseService.formatBudget.bind(courseService),
    getPerformanceColor: courseService.getPerformanceColor.bind(courseService),
    getStatusColor: courseService.getStatusColor.bind(courseService),
    getStatusLabel: courseService.getStatusLabel.bind(courseService),
    clearCache: () => {
      cacheManager.deleteByPrefix('courses:');
      cacheManager.delete('courses:stats');
    }
  };
}