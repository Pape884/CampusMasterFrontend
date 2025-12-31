"use client"

import { useState } from "react"
import { Search, BookOpen, FileText, TrendingUp, Award, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import Link from "next/link"

// Données de démonstration
const courses = [
  {
    id: 1,
    name: "Mathématiques Avancées",
    code: "MATH301",
    teacher: "Dr. Marie Dubois",
    department: "Département de Mathématiques",
    progress: 75,
    chapters: 12,
    completedChapters: 9,
    grade: 16.5,
    nextClass: "2024-01-15 14:00",
    color: "bg-blue-500",
  },
  {
    id: 2,
    name: "Physique Quantique",
    code: "PHYS402",
    teacher: "Dr. Sophie Laurent",
    department: "Département des Sciences",
    progress: 60,
    chapters: 15,
    completedChapters: 9,
    grade: 14.0,
    nextClass: "2024-01-16 10:00",
    color: "bg-purple-500",
  },
  {
    id: 3,
    name: "Algorithmique",
    code: "INFO301",
    teacher: "Dr. Thomas Petit",
    department: "Département d'Informatique",
    progress: 85,
    chapters: 10,
    completedChapters: 8,
    grade: 17.5,
    nextClass: "2024-01-15 16:00",
    color: "bg-green-500",
  },
  {
    id: 4,
    name: "Littérature Française",
    code: "LETT201",
    teacher: "Dr. Julie Martin",
    department: "Département des Langues",
    progress: 45,
    chapters: 8,
    completedChapters: 4,
    grade: 15.0,
    nextClass: "2024-01-17 09:00",
    color: "bg-orange-500",
  },
]

export default function StudentCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const totalCourses = courses.length
  const avgProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length)
  const avgGrade = (courses.reduce((acc, c) => acc + c.grade, 0) / courses.length).toFixed(1)
  const totalChapters = courses.reduce((acc, c) => acc + c.chapters, 0)

  return (
    <div className="bg-background">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div>
          <p className="text-muted-foreground mt-1">Suivez votre progression et accédez à vos ressources</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cours suivis</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalCourses}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progression moy.</p>
                <p className="text-3xl font-bold text-foreground mt-1">{avgProgress}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moyenne générale</p>
                <p className="text-3xl font-bold text-foreground mt-1">{avgGrade}/20</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-card border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total chapitres</p>
                <p className="text-3xl font-bold text-foreground mt-1">{totalChapters}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="overflow-hidden bg-card border border-border hover:shadow-lg transition-shadow"
            >
              <div className={`h-2 ${course.color}`} />
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {course.code}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{course.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{course.teacher}</p>
                    <p className="text-xs text-muted-foreground">{course.department}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Progression</p>
                    <p className="text-lg font-semibold text-foreground">{course.progress}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Chapitres</p>
                    <p className="text-lg font-semibold text-foreground">
                      {course.completedChapters}/{course.chapters}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Note</p>
                    <p className="text-lg font-semibold text-foreground">{course.grade}/20</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progression du cours</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${course.color} transition-all`} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>
                    Prochain cours:{" "}
                    {new Date(course.nextClass).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button asChild className="flex-1">
                    <Link href={`/student/courses/${course.id}`}>Accéder au cours</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Aucun cours trouvé</h3>
            <p className="text-muted-foreground mt-2">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
