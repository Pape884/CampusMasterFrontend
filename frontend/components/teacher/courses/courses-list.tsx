"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import {
  BookOpen,
  Users,
  FileText,
  Search,
  TrendingUp,
  Plus,
  Filter,
  MoreVertical,
  Folder
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { courseService } from "@/lib/api/services/course.service"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Module, Course } from "@/lib/api/services"
import { useAuthContext } from "@/context/authContext"
import { enrollmentService } from "@/lib/api/services/enrollment.service"

export default function TeacherCoursesPage() {
  const router = useRouter()
  const { user } = useAuthContext();
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [moduleFilter, setModuleFilter] = useState<string>("all")
  const [modulesWithCourses, setModulesWithCourses] = useState<Module[]>([])
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Charger les modules et cours
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)

        if (user) {
          const teacherModules = await enrollmentService.getTeacherModules(user.id)
          console.log("Modules:", teacherModules)
          // Pour chaque module, charger les cours
          const modulesWithCoursesData = await Promise.all(
            teacherModules.map(async (module) => {
              const courses = await courseService.getCoursesByModule(module.id)

              console.log(courses)
               // S'assurer que courses est un tableau
              const coursesArray = Array.isArray(courses) ? courses : []
              
              return {
                ...module,
                courses: courses
              }
            })
          )

          console.log("Modules with courses:", modulesWithCoursesData)

          setModulesWithCourses(modulesWithCoursesData)

          // Tous les cours dans un tableau plat
          const allCoursesData = modulesWithCoursesData.flatMap(m => m.courses)
          setAllCourses(allCoursesData)

        }
      } catch (error: any) {
        console.error("Erreur lors du chargement:", error)
        toast.error("Erreur", {
          description: "Impossible de charger les cours",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrer les cours
  const filteredModules = modulesWithCourses.map(module => ({
    ...module,
    courses: (module.courses || []).filter(course => {
      const matchesSearch = searchQuery === "" ||
        course.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || course.status === statusFilter
      const matchesModule = moduleFilter === "all" || module.id === moduleFilter

      return matchesSearch && matchesStatus && matchesModule
    })
  })).filter(module => module.courses.length > 0)

  // Calculer les statistiques
  const totalCourses = allCourses.length
  const totalStudents = allCourses.reduce((acc, course) => acc + course.studentsCount, 0)
  const totalChapters = allCourses.reduce((acc, course) => acc + course.chaptersCount, 0)
  const avgProgress = allCourses.length > 0
    ? Math.round(allCourses.reduce((acc, course) => acc + course.progress, 0) / allCourses.length)
    : 0

  // Gérer la suppression d'un cours
  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer le cours "${courseTitle}" ?`)) {
      return
    }

    try {
      await courseService.deleteCourse(courseId)
      toast.success("Cours supprimé", {
        description: `"${courseTitle}" a été supprimé avec succès`,
      })

      // Recharger les données
      router.refresh()
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible de supprimer le cours",
      })
    }
  }

  // Obtenir la couleur du statut
  const getStatusColor = (status: Course['status']) => {
    switch (status) {
      case 'published': return "bg-green-500/10 text-green-500"
      case 'draft': return "bg-yellow-500/10 text-yellow-500"
      case 'archived': return "bg-gray-500/10 text-gray-500"
      default: return "bg-gray-500/10 text-gray-500"
    }
  }

  // Obtenir le label du statut
  const getStatusLabel = (status: Course['status']) => {
    switch (status) {
      case 'published': return "Publié"
      case 'draft': return "Brouillon"
      case 'archived': return "Archivé"
      default: return "Inconnu"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3">Chargement des cours...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes cours</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les cours et chapitres de vos modules
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cours</p>
                <p className="mt-2 text-3xl font-bold">{totalCourses}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="mt-2 text-3-xl font-bold">{totalStudents}</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chapitres</p>
                <p className="mt-2 text-3xl font-bold">{totalChapters}</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progression Moy.</p>
                <p className="mt-2 text-3xl font-bold">{avgProgress}%</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un cours par titre ou code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publié</SelectItem>
                  <SelectItem value="draft">Brouillon</SelectItem>
                  <SelectItem value="archived">Archivé</SelectItem>
                </SelectContent>
              </Select>

              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les modules</SelectItem>
                  {modulesWithCourses.map(module => (
                    <SelectItem key={module.id} value={module.id}>
                      {module.name} ({module.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={() => router.push('/teacher/courses/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau cours
          </Button>
        </div>

        {/* Liste des cours groupés par module */}
        {filteredModules.length === 0 ? (
          <Alert>
            <BookOpen className="h-4 w-4" />
            <AlertDescription>
              {searchQuery || statusFilter !== "all" || moduleFilter !== "all"
                ? "Aucun cours ne correspond à vos critères de recherche"
                : "Vous n'avez pas encore créé de cours. Commencez par en créer un !"}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-8">
            {filteredModules.map((module) => (
              <div key={module.id} className="space-y-4">
                {/* En-tête du module */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        {module.name} ({module.code})
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {module.semestre} • {module.courses.length} cours
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/teacher/courses/add?moduleId=${module.id}`)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Ajouter un cours
                  </Button>
                </div>

                {/* Grille des cours */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {module.courses.map((course: any) => (
                    <div key={course.id} className="group relative">
                      <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
                        {/* Menu d'actions */}
                        <div className="absolute right-3 top-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/teacher/courses/add/${course.id}`)}>
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/teacher/courses/${course.id}`)}>
                                Gérer les chapitres
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                className="text-red-600"
                              >
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Contenu du cours */}
                        <div
                          className="h-full cursor-pointer p-6"
                          onClick={() => router.push(`/teacher/courses/${course.id}`)}
                        >
                          {/* Header */}
                          <div className="mb-4">
                            <div className="mb-2 flex items-center justify-between">
                              <Badge className={getStatusColor(course.status)}>
                                {getStatusLabel(course.status)}
                              </Badge>
                              <span className="text-sm font-medium text-muted-foreground">
                                {course.code}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
                              {course.titre}
                            </h3>
                            {course.description && (
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                                {course.description}
                              </p>
                            )}
                          </div>

                          {/* Stats */}
                          <div className="mb-4 grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Étudiants</p>
                                <p className="font-semibold">{course.studentsCount}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="text-xs text-muted-foreground">Chapitres</p>
                                <p className="font-semibold">{course.chaptersCount}</p>
                              </div>
                            </div>
                          </div>

                          {/* Progression */}
                          <div>
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">Progression moyenne</span>
                              <span className="text-xs font-semibold">{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>

                          {/* Actions rapides */}
                          <div className="mt-6 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/teacher/courses/${course.id}/chapters`)
                              }}
                            >
                              Chapitres
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/teacher/courses/add/${course.id}`)
                              }}
                            >
                              Modifier
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}