"use client"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, FileText, CheckCircle, Circle, BookOpen, User, Calendar, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Données de démonstration
const courseData = {
  id: 1,
  name: "Mathématiques Avancées",
  code: "MATH301",
  teacher: "Dr. Marie Dubois",
  department: "Département de Mathématiques",
  description:
    "Ce cours couvre les concepts avancés en mathématiques, incluant l'analyse complexe, les équations différentielles et l'algèbre linéaire avancée.",
  progress: 75,
  grade: 16.5,
  semester: "Semestre 1 - 2024",
  credits: 6,
  chapters: [
    {
      id: 1,
      title: "Introduction aux nombres complexes",
      description: "Les bases des nombres complexes et leurs propriétés",
      completed: true,
      duration: "2h",
      pdfUrl: "/courses/math301/chapter1.pdf",
      pdfName: "Chapitre_1_Nombres_Complexes.pdf",
    },
    {
      id: 2,
      title: "Fonctions analytiques",
      description: "Étude des fonctions analytiques dans le plan complexe",
      completed: true,
      duration: "3h",
      pdfUrl: "/courses/math301/chapter2.pdf",
      pdfName: "Chapitre_2_Fonctions_Analytiques.pdf",
    },
    {
      id: 3,
      title: "Intégration complexe",
      description: "Théorèmes fondamentaux de l'intégration complexe",
      completed: true,
      duration: "2.5h",
      pdfUrl: "/courses/math301/chapter3.pdf",
      pdfName: "Chapitre_3_Integration_Complexe.pdf",
    },
    {
      id: 4,
      title: "Séries de Fourier",
      description: "Développement en séries de Fourier et applications",
      completed: false,
      duration: "3h",
      pdfUrl: "/courses/math301/chapter4.pdf",
      pdfName: "Chapitre_4_Series_Fourier.pdf",
    },
    {
      id: 5,
      title: "Transformées de Laplace",
      description: "Théorie et applications des transformées de Laplace",
      completed: false,
      duration: "2h",
      pdfUrl: "/courses/math301/chapter5.pdf",
      pdfName: "Chapitre_5_Transformees_Laplace.pdf",
    },
    {
      id: 6,
      title: "Équations différentielles ordinaires",
      description: "Résolution des EDO de premier et second ordre",
      completed: false,
      duration: "4h",
    },
  ],
}

export default function StudentCourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const course = courseData

  const completedChapters = course.chapters.filter((c) => c.completed).length
  const totalChapters = course.chapters.length
  const progressPercentage = Math.round((completedChapters / totalChapters) * 100)

  const handleDownload = (pdfUrl: string, pdfName: string) => {
    // Simulation du téléchargement
    console.log(`Téléchargement de ${pdfName}`)
    alert(`Téléchargement de ${pdfName} en cours...`)
  }

  return (
    <div className="bg-background">
      <div className="mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Retour aux cours
        </Button>

        {/* Course Header */}
        <Card className="p-8 bg-card border border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-500">
                  {course.code}
                </span>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                  {course.credits} crédits
                </span>
              </div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{course.name}</h1>
              <p className="text-muted-foreground mb-4">{course.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Enseignant</p>
                    <p className="text-sm font-medium text-foreground">{course.teacher}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Période</p>
                    <p className="text-sm font-medium text-foreground">{course.semester}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Note actuelle</p>
                    <p className="text-sm font-medium text-foreground">{course.grade}/20</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Progress Card */}
        <Card className="p-6 bg-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Progression du cours</h3>
              <p className="text-sm text-muted-foreground">
                {completedChapters} sur {totalChapters} chapitres complétés
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-foreground">{progressPercentage}%</p>
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all" style={{ width: `${progressPercentage}%` }} />
          </div>
        </Card>

        {/* Chapters List */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-4">Chapitres du cours</h2>
          <div className="space-y-4">
            {course.chapters.map((chapter, index) => (
              <Card
                key={chapter.id}
                className={`p-6 bg-card border transition-all ${
                  chapter.completed ? "border-green-500/30 bg-green-500/5" : "border-border hover:border-border/60"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {chapter.completed ? (
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          Chapitre {index + 1}: {chapter.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{chapter.description}</p>
                      </div>
                      {chapter.completed && (
                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-500/10 text-green-500">
                          Complété
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {chapter.duration}
                      </span>

                      {chapter.pdfUrl && (
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{chapter.pdfName}</span>
                        </div>
                      )}
                    </div>

                    {chapter.pdfUrl && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(chapter.pdfUrl!, chapter.pdfName!)}
                          className="gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Télécharger le PDF
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
