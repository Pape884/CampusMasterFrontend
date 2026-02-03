// lib/hooks/useStudentQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { studentService, StudentCourse, StudentStats, Assignment, AssignmentDetail, Submission } from '@/lib/api/services/student.service'

/**
 * Hook pour récupérer les cours d'un étudiant
 */
export function useStudentCourses(enabled = true) {
  return useQuery({
    queryKey: ['student', 'courses'],
    queryFn: () => studentService.getStudentCourses(),
    enabled,
    staleTime: 60000, // 1 minute
    gcTime: 300000, // 5 minutes
  })
}

/**
 * Hook pour récupérer les statistiques d'un étudiant
 */
export function useStudentStats(enabled = true) {
  return useQuery({
    queryKey: ['student', 'stats'],
    queryFn: () => studentService.getStudentStats(),
    enabled,
    staleTime: 60000,
    gcTime: 300000,
  })
}

/**
 * Hook pour récupérer un cours spécifique
 */
export function useStudentCourse(courseId: string | number | undefined, enabled = true) {
  return useQuery({
    queryKey: ['student', 'courses', courseId],
    queryFn: () => {
      if (!courseId) throw new Error('Course ID is required')
      return studentService.getStudentCourse(courseId)
    },
    enabled: enabled && !!courseId,
    staleTime: 60000,
    gcTime: 300000,
  })
}

/**
 * Hook pour récupérer les devoirs d'un étudiant
 */
export function useStudentAssignments(
  filters?: {
    status?: string
    search?: string
  },
  enabled = true
) {
  return useQuery({
    queryKey: ['student', 'assignments', filters],
    queryFn: () => studentService.getStudentAssignments(filters),
    enabled,
    staleTime: 30000, // 30 secondes
    gcTime: 300000,
  })
}

/**
 * Hook pour récupérer un devoir spécifique
 */
export function useAssignmentDetail(assignmentId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: ['student', 'assignments', assignmentId],
    queryFn: () => {
      if (!assignmentId) throw new Error('Assignment ID is required')
      return studentService.getAssignmentDetail(assignmentId)
    },
    enabled: enabled && !!assignmentId,
    staleTime: 60000,
    gcTime: 300000,
  })
}

/**
 * Hook pour soumettre un devoir
 */
export function useSubmitAssignment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Submission) => studentService.submitAssignment(data),
    onSuccess: (_, variables) => {
      // Invalider le cache des devoirs
      queryClient.invalidateQueries({ queryKey: ['student', 'assignments'] })
      queryClient.invalidateQueries({ 
        queryKey: ['student', 'assignments', variables.assignmentId] 
      })
    },
  })
}

/**
 * Hook pour sauvegarder un brouillon
 */
export function useSaveDraft() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Submission) => studentService.saveDraft(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['student', 'assignments', variables.assignmentId] 
      })
    },
  })
}

/**
 * Hook pour télécharger un fichier de cours
 */
export function useDownloadCourseFile() {
  return useMutation({
    mutationFn: (fileId: string) => studentService.downloadCourseFile(fileId),
    onSuccess: (blob, fileId) => {
      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `file-${fileId}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    },
  })
}

/**
 * Hook pour marquer un chapitre comme complété
 */
export function useMarkChapterComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ 
      courseId, 
      chapterId 
    }: { 
      courseId: string | number
      chapterId: string | number 
    }) => studentService.markChapterComplete(courseId, chapterId),
    onSuccess: (_, variables) => {
      // Invalider le cache du cours et des stats
      queryClient.invalidateQueries({ 
        queryKey: ['student', 'courses', variables.courseId] 
      })
      queryClient.invalidateQueries({ queryKey: ['student', 'courses'] })
      queryClient.invalidateQueries({ queryKey: ['student', 'stats'] })
    },
  })
}