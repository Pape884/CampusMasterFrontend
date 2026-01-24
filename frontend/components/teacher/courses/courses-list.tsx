"use client"

import { useState } from "react"
import { BookOpen, Users, FileText, Search, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Course {
  id: string
  title: string
  code: string
  module: string
  department: string
  students: number
  chapters: number
  progress: number
  status: "En cours" | "Terminé" | "À venir"
}

export default function TeacherCoursesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Données exemple
  const courses: Course[] = [
    {
      id: "1",
      title: "Algèbre Linéaire",
      code: "MATH301",
      module: "Mathématiques Fondamentales",
      department: "Mathématiques",
      students: 45,
      chapters: 12,
      progress: 75,
      status: "En cours",
    },
    {
      id: "2",
      title: "Analyse Numérique",
      code: "MATH402",
      module: "Mathématiques Appliquées",
      department: "Mathématiques",
      students: 38,
      chapters: 10,
      progress: 60,
      status: "En cours",
    },
    {
      id: "3",
      title: "Statistiques Avancées",
      code: "STAT501",
      module: "Statistiques",
      department: "Mathématiques",
      students: 52,
      chapters: 15,
      progress: 40,
      status: "En cours",
    },
    {
      id: "4",
      title: "Calcul Différentiel",
      code: "MATH201",
      module: "Mathématiques Fondamentales",
      department: "Mathématiques",
      students: 60,
      chapters: 14,
      progress: 100,
      status: "Terminé",
    },
  ]

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.module.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalStudents = courses.reduce((acc, course) => acc + course.students, 0)
  const totalChapters = courses.reduce((acc, course) => acc + course.chapters, 0)
  const avgProgress = Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="mt-1 text-sm text-muted-foreground">Gérez les chapitres et ressources de vos cours</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Cours</p>
                <p className="mt-2 text-3xl font-bold">{courses.length}</p>
              </div>
              <div className="rounded-lg bg-blue-500/10 p-3">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Étudiants</p>
                <p className="mt-2 text-3xl font-bold">{totalStudents}</p>
              </div>
              <div className="rounded-lg bg-green-500/10 p-3">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Chapitres</p>
                <p className="mt-2 text-3xl font-bold">{totalChapters}</p>
              </div>
              <div className="rounded-lg bg-purple-500/10 p-3">
                <FileText className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Progression Moy.</p>
                <p className="mt-2 text-3xl font-bold">{avgProgress}%</p>
              </div>
              <div className="rounded-lg bg-orange-500/10 p-3">
                <TrendingUp className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un cours par titre, code ou module..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <Link key={course.id} href={`/teacher/courses/${course.id}`}>
              <div className="group h-full cursor-pointer rounded-xl border border-border bg-card p-6 transition-all hover:border-primary hover:shadow-lg">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">{course.code}</p>
                  </div>
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

                {/* Module */}
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground">Module</p>
                  <p className="text-sm font-medium">{course.module}</p>
                </div>

                {/* Stats */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Étudiants</p>
                      <p className="font-semibold">{course.students}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Chapitres</p>
                      <p className="font-semibold">{course.chapters}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Progression</span>
                    <span className="text-xs font-semibold">{course.progress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
