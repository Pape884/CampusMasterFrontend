import { toast } from "sonner"
import { Chapter } from "."
import { cacheManager } from "../axios/cache"
import { apiClient } from "../axios/client"

class ChapterService {
  private basePath = '/chapters'

  /**
   * RÉCUPÉRER TOUS LES CHAPITRES D'UN COURS
   */
  async getChaptersByCourse(courseId: string): Promise<Chapter[]> {
    try {
      const cacheKey = `chapters:${courseId}`

      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        console.log('📦 Chapitres récupérés du cache: ', cached)
        return cached
      }

      const response = await apiClient.get<Chapter[]>(`${this.basePath}/course/${courseId}`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      })

      console.log(response.data)

      // Mettre en cache
      cacheManager.set(cacheKey, response.data)

      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des chapitres:', error)
      throw this.handleError(error)
    }
  }

  /**
   * RÉCUPÉRER UN CHAPITRE PAR SON ID
   */
  async getChapterById(chapterId: string): Promise<Chapter> {
    try {
      const cacheKey = `chapter:${chapterId}`

      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        console.log('📦 Chapitre récupéré du cache: ', cached)
        return cached
      }

      const response = await apiClient.get<Chapter>(`${this.basePath}/${chapterId}`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      })

      // Mettre en cache
      cacheManager.set(cacheKey, response.data)

      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération du chapitre:', error)
      throw this.handleError(error)
    }
  }

  /**
   * CRÉER UN NOUVEAU CHAPITRE
   */
  async createChapter(data: Partial<Chapter>): Promise<Chapter> {
    try {
      console.log('📤 Création d\'un chapitre:', data)

      const response = await apiClient.post<Chapter>(this.basePath, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      this.invalidateChaptersCache()

      console.log('✅ Chapitre créé:', response.data)
      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de la création du chapitre:', error)
      throw this.handleError(error)
    }
  }

  /**
   * METTRE À JOUR UN CHAPITRE
   */
  async updateChapter(chapterId: string, data: Partial<Chapter>): Promise<Chapter> {
    try {
      console.log('📤 Mise à jour du chapitre:', chapterId, data)

      // Récupérer le chapitre existant pour connaître le courseId
      const existingChapter = await this.getChapterById(chapterId)

      const response = await apiClient.put<Chapter>(`${this.basePath}/${chapterId}`, data, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Invalider les caches
      const cacheKeys = [
        `chapter:${chapterId}`,
        `chapters:${existingChapter.courseId}`
      ]

      this.invalidateChaptersCache()

      console.log('✅ Chapitre mis à jour:', response.data)
      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour du chapitre:', error)
      throw this.handleError(error)
    }
  }

  /**
   * SUPPRIMER UN CHAPITRE
   */
  async deleteChapter(chapterId: string): Promise<void> {
    try {
      console.log('🗑️ Suppression du chapitre:', chapterId)

      // Récupérer le chapitre existant pour connaître le courseId
      const existingChapter = await this.getChapterById(chapterId)

      await apiClient.delete(`${this.basePath}/${chapterId}`)

      // Invalider les caches
      const cacheKeys = [
        `chapter:${chapterId}`,
        `chapters:${existingChapter.courseId}`
      ]

      this.invalidateChaptersCache()

      console.log('✅ Chapitre supprimé:', chapterId)

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression du chapitre:', error)
      throw this.handleError(error)
    }
  }

  /**
   * METTRE À JOUR L'ORDRE DES CHAPITRES
   */
  async updateChaptersOrder(courseId: string, orders: Array<{ id: string, order: number }>): Promise<void> {
    try {
      console.log('🔄 Mise à jour de l\'ordre des chapitres pour le cours:', courseId, orders)

      await apiClient.put(`${this.basePath}/order/${courseId}`, { orders }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      // Invalider le cache des chapitres du cours
      this.invalidateChaptersCache()

      console.log('✅ Ordre des chapitres mis à jour')

    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour de l\'ordre des chapitres:', error)
      throw this.handleError(error)
    }
  }

  /**
   * AJOUTER UNE RESSOURCE À UN CHAPITRE
   */
  async addResource(chapterId: string, formData: FormData): Promise<any> {
    try {
      console.log('📎 Ajout d\'une ressource au chapitre:', chapterId)

      const response = await apiClient.post(`${this.basePath}/${chapterId}/resources`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Récupérer le chapitre pour connaître le courseId
      const existingChapter = await this.getChapterById(chapterId)

      this.invalidateChaptersCache()

      console.log('✅ Ressource ajoutée:', response.data)
      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de l\'ajout de la ressource:', error)
      throw this.handleError(error)
    }
  }

  /**
   * SUPPRIMER UNE RESSOURCE
   */
  async deleteResource(chapterId: string, resourceId: string): Promise<void> {
    try {
      console.log('🗑️ Suppression de la ressource:', resourceId, 'du chapitre:', chapterId)

      await apiClient.delete(`${this.basePath}/${chapterId}/resources/${resourceId}`)

      // Récupérer le chapitre pour connaître le courseId
      const existingChapter = await this.getChapterById(chapterId)

      // Invalider les caches
      this.invalidateChaptersCache()

      console.log('✅ Ressource supprimée:', resourceId)

    } catch (error: any) {
      console.error('❌ Erreur lors de la suppression de la ressource:', error)
      throw this.handleError(error)
    }
  }

  /**
   * RÉCUPÉRER LES RESSOURCES D'UN CHAPITRE
   */
  async getResources(chapterId: string): Promise<any[]> {
    try {
      const cacheKey = `resources:${chapterId}`

      // Vérifier le cache d'abord
      const cached = cacheManager.get(cacheKey)
      if (cached) {
        console.log('📦 Ressources récupérées du cache: ', cached)
        return cached
      }

      const response = await apiClient.get<any[]>(`${this.basePath}/${chapterId}/resources`, {
        headers: {
          'X-Use-Cache': true,
          'X-Cache-Key': cacheKey,
          'X-Cache-TTL': '300000', // 5 minutes
        },
      })

      // Mettre en cache
      cacheManager.set(cacheKey, response.data)

      return response.data

    } catch (error: any) {
      console.error('❌ Erreur lors de la récupération des ressources:', error)
      throw this.handleError(error)
    }
  }

  /**
   * GESTIONNAIRE D'ERREURS
   */
  private handleError(error: any): Error {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 400:
          return new Error(data.message || 'Données invalides')
        case 401:
          return new Error('Non autorisé')
        case 403:
          return new Error('Accès interdit')
        case 404:
          return new Error('Chapitre non trouvé')
        case 409:
          return new Error(data.message || 'Conflit (code ou nom déjà utilisé)')
        case 422:
          return new Error(data.errors?.[0]?.message || 'Erreur de validation')
        case 500:
          return new Error('Erreur serveur. Veuillez réessayer plus tard')
        default:
          return new Error(`Erreur ${status}: ${data.message || 'Erreur inconnue'}`)
      }
    }

    if (error.request) {
      return new Error('Impossible de contacter le serveur. Vérifiez votre connexion.')
    }

    return new Error('Une erreur inattendue est survenue')
  }

  /**
   * INVALIDER LE CACHE DES chapitres
   */
  private invalidateChaptersCache(): void {
    // Supprimer tous les caches qui commencent par 'chapitres:'
    cacheManager.deleteByPrefix('chapters:');
    // Supprimer aussi le cache des statistiques
    cacheManager.delete('chapters:stats');

    console.log('🧹 Cache chapitres invalidé');
  }
}

export const chapterService = new ChapterService()