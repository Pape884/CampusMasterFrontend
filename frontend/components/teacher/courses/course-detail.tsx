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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState } from "react"

type Chapter = {
  id: number
  title: string
  completed: boolean
  duration: string
  students: number
  pdfUrl?: string
  pdfName?: string
}

export default function CourseDetailsPage() {
  const params = useParams()
  const courseId = params.id

  const [chapters, setChapters] = useState<Chapter[]>([
    {
      id: 1,
      title: "Introduction aux espaces vectoriels",
      completed: true,
      duration: "2h",
      students: 45,
      pdfUrl: "/cours/chapitre1.pdf",
      pdfName: "chapitre1.pdf",
    },
    {
      id: 2,
      title: "Sous-espaces et bases",
      completed: true,
      duration: "3h",
      students: 45,
      pdfUrl: "/cours/chapitre2.pdf",
      pdfName: "chapitre2.pdf",
    },
    {
      id: 3,
      title: "Applications linéaires",
      completed: true,
      duration: "2.5h",
      students: 44,
      pdfUrl: "/cours/chapitre3.pdf",
      pdfName: "chapitre3.pdf",
    },
    { id: 4, title: "Matrices et opérations", completed: true, duration: "3h", students: 43 },
    { id: 5, title: "Déterminants", completed: true, duration: "2h", students: 45 },
    { id: 6, title: "Systèmes linéaires", completed: true, duration: "3h", students: 42 },
    { id: 7, title: "Valeurs propres et vecteurs propres", completed: true, duration: "3.5h", students: 40 },
    { id: 8, title: "Diagonalisation", completed: true, duration: "2.5h", students: 41 },
    { id: 9, title: "Produits scalaires", completed: true, duration: "2h", students: 43 },
    { id: 10, title: "Orthogonalité", completed: false, duration: "3h", students: 0 },
    { id: 11, title: "Formes quadratiques", completed: false, duration: "2.5h", students: 0 },
    { id: 12, title: "Applications et révisions", completed: false, duration: "3h", students: 0 },
  ])

  const [showAddChapter, setShowAddChapter] = useState(false)
  const [editingChapter, setEditingChapter] = useState<number | null>(null)
  const [newChapter, setNewChapter] = useState({ title: "", duration: "", pdfFile: null as File | null })

  const course = {
    id: courseId,
    title: "Algèbre Linéaire",
    code: "MATH301",
    module: "Mathématiques Fondamentales",
    department: "Mathématiques",
    description:
      "Ce cours couvre les concepts fondamentaux de l'algèbre linéaire, incluant les espaces vectoriels, les transformations linéaires, les matrices et les déterminants.",
    students: 45,
    chapters: 12,
    progress: 75,
    status: "En cours",
    semester: "Semestre 3",
    credits: 6,
    hoursPerWeek: 4,
    startDate: "2024-09-01",
    endDate: "2024-12-20",
  }

  const students = [
    { id: 1, name: "Marie Dupont", matricule: "ETU2024001", progress: 90, lastActivity: "2024-01-15" },
    { id: 2, name: "Jean Martin", matricule: "ETU2024002", progress: 85, lastActivity: "2024-01-14" },
    { id: 3, name: "Sophie Laurent", matricule: "ETU2024003", progress: 78, lastActivity: "2024-01-15" },
    { id: 4, name: "Pierre Dubois", matricule: "ETU2024004", progress: 92, lastActivity: "2024-01-13" },
    { id: 5, name: "Emma Bernard", matricule: "ETU2024005", progress: 88, lastActivity: "2024-01-15" },
  ]

  const completedChapters = chapters.filter((ch) => ch.completed).length

  const handleAddChapter = () => {
    if (newChapter.title && newChapter.duration) {
      const chapter: Chapter = {
        id: chapters.length + 1,
        title: newChapter.title,
        duration: newChapter.duration,
        completed: false,
        students: 0,
      }
      if (newChapter.pdfFile) {
        chapter.pdfUrl = URL.createObjectURL(newChapter.pdfFile)
        chapter.pdfName = newChapter.pdfFile.name
      }
      setChapters([...chapters, chapter])
      setNewChapter({ title: "", duration: "", pdfFile: null })
      setShowAddChapter(false)
    }
  }

  const handleDeleteChapter = (id: number) => {
    setChapters(chapters.filter((ch) => ch.id !== id))
  }

  const handleEditChapter = (id: number) => {
    setEditingChapter(id)
  }

  const handleSaveEdit = (id: number, updatedData: any) => {
    setChapters(chapters.map((ch) => (ch.id === id ? { ...ch, ...updatedData } : ch)))
    setEditingChapter(null)
  }

  return (
    <div className="min-h-screen bg-background ">
      <div className="p-8">
        {/* Back Button */}
        <Link href="/teacher/courses">
          <Button variant="ghost" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Retour aux cours
          </Button>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                course.status === "En cours"
                  ? "bg-green-500/10 text-green-500"
                  : course.status === "Terminé"
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-orange-500/10 text-orange-500"
              }`}
            >
              {course.status}
            </span>
          </div>
          <p className="text-muted-foreground">
            {course.code} • {course.module}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-blue-500/10 p-3">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étudiants</p>
                <p className="text-2xl font-bold">{course.students}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-purple-500/10 p-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chapitres</p>
                <p className="text-2xl font-bold">
                  {completedChapters}/{course.chapters}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-green-500/10 p-3">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Crédits</p>
                <p className="text-2xl font-bold">{course.credits}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-orange-500/10 p-3">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Heures/semaine</p>
                <p className="text-2xl font-bold">{course.hoursPerWeek}h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Progression du cours</h2>
            <span className="text-2xl font-bold text-primary">{course.progress}%</span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${course.progress}%` }} />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            {/* Chapters */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Chapitres ({completedChapters}/{course.chapters})
                </h2>
                <Button onClick={() => setShowAddChapter(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un chapitre
                </Button>
              </div>

              {/* Add Chapter Form */}
              {showAddChapter && (
                <div className="mb-6 rounded-lg border border-border bg-accent/50 p-4">
                  <h3 className="mb-4 font-semibold">Nouveau chapitre</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium">Titre du chapitre</label>
                      <Input
                        value={newChapter.title}
                        onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                        placeholder="Ex: Introduction aux espaces vectoriels"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">Durée</label>
                      <Input
                        value={newChapter.duration}
                        onChange={(e) => setNewChapter({ ...newChapter, duration: e.target.value })}
                        placeholder="Ex: 2h"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium">PDF du cours (optionnel)</label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => setNewChapter({ ...newChapter, pdfFile: e.target.files?.[0] || null })}
                          className="flex-1"
                        />
                        {newChapter.pdfFile && (
                          <span className="text-sm text-muted-foreground">{newChapter.pdfFile.name}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddChapter} className="flex-1">
                        Ajouter
                      </Button>
                      <Button onClick={() => setShowAddChapter(false)} variant="outline" className="flex-1">
                        Annuler
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Chapters List */}
              <div className="space-y-3">
                {chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-accent"
                  >
                    {editingChapter === chapter.id ? (
                      <EditChapterForm
                        chapter={chapter}
                        onSave={(data) => handleSaveEdit(chapter.id, data)}
                        onCancel={() => setEditingChapter(null)}
                      />
                    ) : (
                      <>
                        <div className="flex items-center gap-4 flex-1">
                          {chapter.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1">
                            <p
                              className={`font-medium ${chapter.completed ? "text-foreground" : "text-muted-foreground"}`}
                            >
                              {chapter.title}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <p className="text-sm text-muted-foreground">
                                {chapter.duration} • {chapter.students} étudiants
                              </p>
                              {chapter.pdfUrl && (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <FileText className="h-3 w-3" />
                                  {chapter.pdfName || "PDF disponible"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {chapter.pdfUrl && (
                            <Button variant="ghost" size="sm" className="gap-2">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={() => handleEditChapter(chapter.id)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteChapter(chapter.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top Students */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-6 text-lg font-semibold">Top Étudiants</h2>
              <div className="space-y-4">
                {students.map((student, index) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.matricule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{student.progress}%</p>
                      <p className="text-xs text-muted-foreground">Progression</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Informations</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{course.department}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Semestre</p>
                  <p className="font-medium">{course.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de début</p>
                  <p className="font-medium">{new Date(course.startDate).toLocaleDateString("fr-FR")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Date de fin</p>
                  <p className="font-medium">{new Date(course.endDate).toLocaleDateString("fr-FR")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EditChapterForm({
  chapter,
  onSave,
  onCancel,
}: {
  chapter: any
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(chapter.title)
  const [duration, setDuration] = useState(chapter.duration)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  const handleSave = () => {
    const updatedData: any = { title, duration }
    if (pdfFile) {
      updatedData.pdfUrl = URL.createObjectURL(pdfFile)
      updatedData.pdfName = pdfFile.name
    }
    onSave(updatedData)
  }

  return (
    <div className="flex-1 space-y-3">
      <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Titre" />
      <Input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="Durée" />
      <div className="flex items-center gap-2">
        <Input type="file" accept=".pdf" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
        {pdfFile && <span className="text-xs text-muted-foreground">{pdfFile.name}</span>}
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" className="flex-1">
          Enregistrer
        </Button>
        <Button onClick={onCancel} size="sm" variant="outline" className="flex-1 bg-transparent">
          Annuler
        </Button>
      </div>
    </div>
  )
}
