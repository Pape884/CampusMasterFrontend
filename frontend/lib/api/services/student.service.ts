// lib/api/services/student.service.ts
import { apiClient } from '@/lib/api/axios/client'

/**
 * Types pour l'espace étudiant
 */
export interface StudentCourse {
  id: number
  module: {
    id: number
    code: string
    name: string
    semestre: number
    departmentId: number
  }
  enrolledAt: string
  isActive: boolean
  finalGrade?: number
  progress?: number
  chapters?: number
  completedChapters?: number
  teacher?: string
  nextClass?: string
  color?: string
}

export interface StudentStats {
  totalCourses: number
  averageProgress: number
  averageGrade: number
  totalChapters: number
  completedChapters: number
}

export interface Assignment {
  id: string
  title: string
  course: string
  courseId: number
  courseColor: string
  dueDate: string
  status: 'pending' | 'submitted' | 'graded' | 'late'
  grade?: number
  maxGrade: number
  description: string
  submittedDate?: string
  teacher: string
}

export interface AssignmentDetail extends Assignment {
  instructions?: string
  attachments?: {
    name: string
    size: string
    url: string
  }[]
  feedback?: string
}

export interface Submission {
  assignmentId: string
  file: File
  comment?: string
}

/**
 * Service pour l'espace étudiant
 */
export class StudentService {
  
  /**
   * Récupérer les cours d'un étudiant (via ses enrollments)
   */
  async getStudentCourses(): Promise<StudentCourse[]> {
    const response = await apiClient.get<{
      id: string
      enrollments: StudentCourse[]
    }>('/users/me')
    
    // Transformer les données pour correspondre au format attendu
    return response.data.enrollments || []
  }

  /**
   * Récupérer les statistiques d'un étudiant
   */
  async getStudentStats(): Promise<StudentStats> {
    const courses = await this.getStudentCourses()
    
    const totalCourses = courses.length
    const averageProgress = totalCourses > 0
      ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / totalCourses)
      : 0
    const averageGrade = totalCourses > 0
      ? courses.reduce((sum, c) => sum + (c.finalGrade || 0), 0) / totalCourses
      : 0
    const totalChapters = courses.reduce((sum, c) => sum + (c.chapters || 0), 0)
    const completedChapters = courses.reduce((sum, c) => sum + (c.completedChapters || 0), 0)

    return {
      totalCourses,
      averageProgress,
      averageGrade: Math.round(averageGrade * 10) / 10,
      totalChapters,
      completedChapters,
    }
  }

  /**
   * Récupérer un cours spécifique de l'étudiant
   */
  async getStudentCourse(courseId: string | number): Promise<StudentCourse | null> {
    const courses = await this.getStudentCourses()
    return courses.find(c => c.id === Number(courseId)) || null
  }

  /**
   * Récupérer les devoirs d'un étudiant
   * TODO: À remplacer par l'endpoint backend réel quand disponible
   */
  async getStudentAssignments(filters?: {
    status?: string
    search?: string
  }): Promise<Assignment[]> {
    // Pour l'instant, retourne des données mock
    // Remplacer par l'appel API réel
    const response = await apiClient.get<Assignment[]>('/assignments/student', {
      params: filters
    })
    return response.data
  }

  /**
   * Récupérer un devoir spécifique
   */
  async getAssignmentDetail(assignmentId: string): Promise<AssignmentDetail> {
    const response = await apiClient.get<AssignmentDetail>(`/assignments/${assignmentId}`)
    return response.data
  }

  /**
   * Soumettre un devoir
   */
  async submitAssignment(data: Submission): Promise<void> {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.comment) {
      formData.append('comment', data.comment)
    }

    await apiClient.post(`/assignments/${data.assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Sauvegarder un devoir comme brouillon
   */
  async saveDraft(data: Submission): Promise<void> {
    const formData = new FormData()
    formData.append('file', data.file)
    if (data.comment) {
      formData.append('comment', data.comment)
    }

    await apiClient.post(`/assignments/${data.assignmentId}/draft`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  /**
   * Télécharger un fichier de cours
   */
  async downloadCourseFile(fileId: string): Promise<Blob> {
    const response = await apiClient.get(`/courses/files/${fileId}`, {
      responseType: 'blob',
    })
    return response.data
  }

  /**
   * Marquer un chapitre comme complété
   */
  async markChapterComplete(courseId: string | number, chapterId: string | number): Promise<void> {
    await apiClient.post(`/enrollments/${courseId}/chapters/${chapterId}/complete`)
  }
}

// Export singleton
export const studentService = new StudentService()