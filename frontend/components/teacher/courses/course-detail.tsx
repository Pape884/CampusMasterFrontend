"use client"
import {
  ArrowLeft,
  Users,
  FileText,
  Clock,
  BookOpen,
  CheckCircle,
  Circle,
  Download,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  Building,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { courseService } from "@/lib/api/services/course.service"
import { chapterService } from "@/lib/api/services/chapter.service"
import { toast } from "sonner"
import { Course, Chapter, User, Module } from "@/lib/api/services"
import { moduleService } from "@/lib/api/services/module.service"


export default function CourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [module, setmodule] = useState<Module>()
  const [loading, setLoading] = useState({
    course: true,
    chapters: true,
    students: false,
  })
  const [error, setError] = useState<string | null>(null)

  const [showAddChapter, setShowAddChapter] = useState(false)
  const [editingChapter, setEditingChapter] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [chapterToDelete, setChapterToDelete] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const [newChapter, setNewChapter] = useState({
    title: "",
    duration: "",
    pdfFile: null as File | null
  })

  const [editForm, setEditForm] = useState({
    title: "",
    duration: "",
    pdfFile: null as File | null
  })

  // Charger les données du cours
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(prev => ({ ...prev, course: true }))
        const courseData = await courseService.getCourseById(courseId)
        console.log("recuperation : " + courseData)
        const moduleData = await moduleService.getById(courseData.data.moduleId)
        setCourse(courseData.data)
        setmodule(moduleData)
        setError(null)
      } catch (error: any) {
        setError(error.message)
        toast.error("Impossible de charger les informations du cours")
      } finally {
        setLoading(prev => ({ ...prev, course: false }))
      }
    }

    if (courseId) {
      fetchCourseData()
    }
  }, [courseId])

  // Charger les chapitres du cours
  useEffect(() => {
    const fetchChapters = async () => {
      if (!courseId) return

      try {
        setLoading(prev => ({ ...prev, chapters: true }))
        const chaptersData = await chapterService.getChaptersByCourse(courseId)
        console.log(chaptersData)
        setChapters(chaptersData)
      } catch (error: any) {
        console.error("Erreur lors du chargement des chapitres:", error)
        toast.error("Impossible de charger les chapitres")
      } finally {
        setLoading(prev => ({ ...prev, chapters: false }))
      }
    }

    if (courseId) {
      fetchChapters()
    }
  }, [courseId])


  const completedChapters = chapters.filter((ch) => ch.completed).length

  const handleAddChapter = async () => {
    if (!newChapter.title || !newChapter.duration || !courseId) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const chapterData: Partial<Chapter> = {
        title: newChapter.title,
        duration: newChapter.duration,
        completed: false,
        order: chapters.length + 1,
        courseId: courseId,
      }

      const createdChapter = await chapterService.createChapter(chapterData)
      console.log("Chapitre créé:", createdChapter)

      // Si un fichier PDF est fourni, l'ajouter comme ressource
      if (newChapter.pdfFile) {
        const formData = new FormData()

        formData.append("name", newChapter.pdfFile.name)
        formData.append("type", "pdf")
        formData.append("file", newChapter.pdfFile)

        await chapterService.addResource(createdChapter.id.toString(), formData)
      }

      toast.success("Chapitre ajouté avec succès")

      // Recharger les chapitres
      const updatedChapters = await chapterService.getChaptersByCourse(courseId)
      setChapters(updatedChapters)

      setNewChapter({ title: "", duration: "", pdfFile: null })
      setShowAddChapter(false)
    } catch (err: any) {
      toast.error(err.message || "Impossible d'ajouter le chapitre")
    }
  }

  const handleEditChapter = (chapter: Chapter) => {
    setEditingChapter(chapter.id)
    setEditForm({
      title: chapter.title,
      duration: chapter.duration,
      pdfFile: null
    })
  }

  const handleSaveEdit = async (chapterId: string) => {
    if (!editForm.title || !editForm.duration) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      const updates: Partial<Chapter> = {
        title: editForm.title,
        duration: editForm.duration,
      }

      await chapterService.updateChapter(chapterId, updates)

      // Si un nouveau fichier PDF est fourni, l'ajouter comme ressource
      if (editForm.pdfFile) {
        const formData = new FormData()
        formData.append("name", editForm.pdfFile.name)
        formData.append("type", "pdf")
        formData.append("file", editForm.pdfFile)
        await chapterService.addResource(chapterId, formData)
      }

      toast.success("Chapitre modifié avec succès")

      // Recharger les chapitres
      const updatedChapters = await chapterService.getChaptersByCourse(courseId)
      setChapters(updatedChapters)

      setEditingChapter(null)
      setEditForm({ title: "", duration: "", pdfFile: null })
    } catch (err: any) {
      toast.error(err.message || "Impossible de modifier le chapitre")
    }
  }

  const handleDeleteChapter = async () => {
    if (!chapterToDelete) return

    try {
      setIsDeleting(true)
      await chapterService.deleteChapter(chapterToDelete)

      toast.success("Chapitre supprimé avec succès")

      // Recharger les chapitres
      const updatedChapters = await chapterService.getChaptersByCourse(courseId)
      setChapters(updatedChapters)
    } catch (err: any) {
      toast.error(err.message || "Impossible de supprimer le chapitre")
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setChapterToDelete(null)
    }
  }

  const handleToggleComplete = async (chapterId: string, currentStatus: boolean) => {
    try {
      await chapterService.updateChapter(chapterId, { completed: !currentStatus })

      // Mettre à jour localement pour une meilleure UX
      setChapters(prev => prev.map(ch =>
        ch.id === chapterId ? { ...ch, completed: !currentStatus } : ch
      ))
    } catch (err: any) {
      toast.error(err.message || "Impossible de changer le statut du chapitre")
    }
  }

  const handleDownloadPDF = async (chapterId: string) => {
    try {
      // Récupérer les ressources du chapitre
      const resources = await chapterService.getResources(chapterId)
      const pdfResource = resources.find((r: any) =>
        r.type === 'pdf' || r.name?.endsWith('.pdf')
      )

      if (pdfResource?.url) {
        const link = document.createElement('a')
        link.href = pdfResource.url
        link.download = pdfResource.name || 'document.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        toast.error("Aucun fichier PDF disponible pour ce chapitre")
      }
    } catch (error) {
      toast.error("Impossible de télécharger le fichier")
    }
  }

  const handleUpdateCourseStatus = async (status: Course['status']) => {
    if (!course) return

    try {
      setIsEditing(true)
      await courseService.updateCourseStatus(courseId, status)

      // Mettre à jour localement
      setCourse(prev => prev ? { ...prev, status } : null)

      toast.success("Statut du cours mis à jour avec succès")
    } catch (err: any) {
      toast.error(err.message || "Impossible de mettre à jour le statut du cours")
    } finally {
      setIsEditing(false)
    }
  }

  const handleDeleteCourse = async () => {
    if (!course) return

    try {
      await courseService.deleteCourse(courseId)

      toast.success("Cours supprimé avec succès")

      router.push('/teacher/courses')
    } catch (err: any) {
      toast.error(err.message || "Impossible de supprimer le cours")
    }
  }

  if (loading.course && loading.chapters) {
    return (
      <div className="container mx-auto p-6">
        <Skeleton className="h-12 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))}
            </div>
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-96 rounded-xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Cours non trouvé</h2>
          <p className="text-muted-foreground mb-6">{error || "Le cours demandé n'existe pas"}</p>
          <Link href="/teacher/courses">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux cours
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColors = {
    draft: "bg-green-100 text-green-800",
    published: "bg-red-100 text-red-800",
    archived: "bg-yellow-100 text-yellow-800",
  }

  const statusLabels = {
    published: "Actif",
    archived: "Inactif",
    draft: "En construction",
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-6">
          <Link href="/teacher/courses">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Retour aux cours
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">{course.titre}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[course.status]}>
                    {statusLabels[course.status]}
                  </Badge>
                  <Select
                    value={course.status}
                    onValueChange={(value: Course['status']) => handleUpdateCourseStatus(value)}
                    disabled={isEditing}
                  >
                    <SelectTrigger className="w-40 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="published">Actif</SelectItem>
                      <SelectItem value="archived">Inactif</SelectItem>
                      <SelectItem value="draft">En construction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-muted-foreground">
                {course.code} • {module?.name || "Non spécifié"} • {course.moduleId}
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Edit2 className="h-4 w-4 mr-2" />
                Modifier le cours
              </Button>
              <Button onClick={() => setShowAddChapter(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Nouveau chapitre
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>

                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-purple-100 p-3 dark:bg-purple-900">
                      <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Chapitres</p>
                      <p className="text-2xl font-bold">
                        {completedChapters}/{chapters.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900">
                      <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Crédits</p>
                      <p className="text-2xl font-bold">{course.credits || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900">
                      <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>

                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chapters Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Chapitres</CardTitle>
                    <CardDescription>
                      Gérez les chapitres et le contenu du cours
                    </CardDescription>
                  </div>
                  <Button onClick={() => setShowAddChapter(true)} className="gap-2">
                    <Plus className="h-4 w-4" />
                    Ajouter un chapitre
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Add Chapter Form */}
                {showAddChapter && (
                  <div className="mb-6 rounded-lg border p-4">
                    <h3 className="font-semibold mb-4">Nouveau chapitre</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Titre du chapitre *</label>
                        <Input
                          value={newChapter.title}
                          onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                          placeholder="Ex: Introduction aux espaces vectoriels"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Durée *</label>
                        <Input
                          value={newChapter.duration}
                          onChange={(e) => setNewChapter({ ...newChapter, duration: e.target.value })}
                          placeholder="Ex: 2h"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">PDF du cours (optionnel)</label>
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setNewChapter({ ...newChapter, pdfFile: e.target.files?.[0] || null })}
                          className="cursor-pointer"
                        />
                        {newChapter.pdfFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Fichier sélectionné : {newChapter.pdfFile.name}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button onClick={handleAddChapter} className="flex-1">
                          Ajouter le chapitre
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddChapter(false)}
                          className="flex-1"
                        >
                          Annuler
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chapters List */}
                <div className="space-y-3">
                  {loading.chapters ? (
                    [...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 rounded-lg" />
                    ))
                  ) : chapters.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="font-medium mb-2">Aucun chapitre</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Commencez par ajouter votre premier chapitre
                      </p>
                      <Button onClick={() => setShowAddChapter(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter un chapitre
                      </Button>
                    </div>
                  ) : (
                    chapters
                      .sort((a, b) => a.order - b.order)
                      .map((chapter) => (
                        <div
                          key={chapter.id}
                          className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                        >
                          {editingChapter === chapter.id ? (
                            <div className="w-full space-y-4">
                              <div className="space-y-3">
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Titre *</label>
                                  <Input
                                    value={editForm.title}
                                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    placeholder="Titre du chapitre"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">Durée *</label>
                                  <Input
                                    value={editForm.duration}
                                    onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                    placeholder="Ex: 2h"
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-2 block">PDF (optionnel)</label>
                                  <Input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => setEditForm({ ...editForm, pdfFile: e.target.files?.[0] || null })}
                                    className="cursor-pointer"
                                  />
                                  {editForm.pdfFile && (
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Nouveau fichier : {editForm.pdfFile.name}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  onClick={() => handleSaveEdit(chapter.id)}
                                  size="sm"
                                  className="flex-1"
                                >
                                  Enregistrer
                                </Button>
                                <Button
                                  onClick={() => setEditingChapter(null)}
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-4 flex-1">
                                <button
                                  onClick={() => handleToggleComplete(chapter.id, chapter.completed)}
                                  className="shrink-0"
                                  title={chapter.completed ? "Marquer comme non terminé" : "Marquer comme terminé"}
                                >
                                  {chapter.completed ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                  ) : (
                                    <Circle className="h-5 w-5 text-muted-foreground" />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-muted-foreground">
                                      Chapitre {chapter.order}
                                    </span>
                                    <Separator orientation="vertical" className="h-4" />
                                    <span className="text-sm text-muted-foreground">
                                      {chapter.duration}
                                    </span>
                                  </div>
                                  <h4 className={`font-medium ${chapter.completed ? "text-foreground" : "text-muted-foreground"}`}>
                                    {chapter.title}
                                  </h4>
                                  <div className="flex items-center gap-4 mt-2">
                                    <span className="text-sm text-muted-foreground">
                                    </span>
                                    <button
                                      onClick={() => handleDownloadPDF(chapter.id)}
                                      className="text-sm text-primary hover:underline flex items-center gap-1"
                                    >
                                      <FileText className="h-3 w-3" />
                                      Télécharger PDF
                                    </button>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditChapter(chapter)}
                                  title="Modifier le chapitre"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setChapterToDelete(chapter.id)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                  title="Supprimer le chapitre"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informations du cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Module</p>
                      <p className="font-medium">{module?.name}</p>
                    </div>
                  </div>


                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Semestre</p>
                      <p className="font-medium">{module?.semestre}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date de début</span>
                    <span className="font-medium">
                      {course.startDate ? new Date(course.startDate).toLocaleDateString("fr-FR") : "Non spécifiée"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Date de fin</span>
                    <span className="font-medium">
                      {course.endDate ? new Date(course.endDate).toLocaleDateString("fr-FR") : "Non spécifiée"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {course.description || "Aucune description disponible"}
                </p>
              </CardContent>
            </Card>

            {/* Course Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Voir les statistiques détaillées
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Gérer les étudiants
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Exporter les données
                </Button>
                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={handleDeleteCourse}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Supprimer le cours
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce chapitre ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false)
                setChapterToDelete(null)
              }}
              disabled={isDeleting}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteChapter}
              disabled={isDeleting}
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}