"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Building2,
  Users,
  BookOpen,
  DollarSign,
  Calendar,
  TrendingUp,
  Edit,
  GraduationCap,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Course {
  id: string
  name: string
  code: string
  credits: number
  students: number
  instructor: string
}

interface Module {
  id: string
  name: string
  code: string
  courses: Course[]
}

export default function DepartmentDetailsPage({ params }: { params: { id: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])

  // Données simulées
  const department = {
    id: params.id,
    name: "Département de Mathématiques",
    code: "MATH",
    description:
      "Le département de mathématiques offre une formation complète en mathématiques pures et appliquées, avec un accent sur la recherche et l'innovation.",
    director: "Dr. Marie Dubois",
    directorEmail: "marie.dubois@university.edu",
    budget: 450000,
    founded: "1985",
    performance: 92,
    stats: {
      totalStudents: 245,
      totalInstructors: 12,
      totalCourses: 28,
      totalModules: 5,
    },
    modules: [
      {
        id: "1",
        name: "Algèbre",
        code: "ALG",
        courses: [
          {
            id: "1-1",
            name: "Algèbre Linéaire",
            code: "ALG101",
            credits: 6,
            students: 45,
            instructor: "Dr. Jean Martin",
          },
          {
            id: "1-2",
            name: "Algèbre Abstraite",
            code: "ALG201",
            credits: 6,
            students: 32,
            instructor: "Dr. Sophie Laurent",
          },
          {
            id: "1-3",
            name: "Théorie des Groupes",
            code: "ALG301",
            credits: 5,
            students: 28,
            instructor: "Dr. Marie Dubois",
          },
        ],
      },
      {
        id: "2",
        name: "Analyse",
        code: "ANA",
        courses: [
          {
            id: "2-1",
            name: "Analyse Réelle",
            code: "ANA101",
            credits: 6,
            students: 50,
            instructor: "Dr. Pierre Durand",
          },
          {
            id: "2-2",
            name: "Analyse Complexe",
            code: "ANA201",
            credits: 6,
            students: 38,
            instructor: "Dr. Claire Moreau",
          },
        ],
      },
      {
        id: "3",
        name: "Probabilités et Statistiques",
        code: "PROB",
        courses: [
          {
            id: "3-1",
            name: "Probabilités",
            code: "PROB101",
            credits: 5,
            students: 42,
            instructor: "Dr. Thomas Petit",
          },
          {
            id: "3-2",
            name: "Statistiques",
            code: "PROB201",
            credits: 5,
            students: 40,
            instructor: "Dr. Emma Bernard",
          },
        ],
      },
    ] as Module[],
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/department">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-semibold text-foreground">{department.name}</h1>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {department.code}
                </span>
              </div>
              <p className="text-muted-foreground">Dirigé par {department.director}</p>
            </div>
          </div>
          <Link href={`/admin/department/${params.id}/edit`}>
            <Button>
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          </Link>-
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold">{department.stats.totalStudents}</div>
            <p className="text-sm text-muted-foreground">Étudiants</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <GraduationCap className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold">{department.stats.totalInstructors}</div>
            <p className="text-sm text-muted-foreground">Enseignants</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{department.stats.totalCourses}</div>
            <p className="text-sm text-muted-foreground">Cours</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-orange-500" />
            </div>
            <div className="text-2xl font-bold">{department.performance}%</div>
            <p className="text-sm text-muted-foreground">Performance</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Informations principales */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <Building2 className="h-5 w-5 text-primary" />
                Description
              </h2>
              <p className="text-muted-foreground">{department.description}</p>
            </div>

            {/* Modules et Cours */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <BookOpen className="h-5 w-5 text-primary" />
                Modules et Cours ({department.stats.totalModules} modules, {department.stats.totalCourses} cours)
              </h2>
              <div className="space-y-3">
                {department.modules.map((module) => (
                  <div key={module.id} className="rounded-lg border bg-muted/30">
                    <button
                      onClick={() => toggleModule(module.id)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-medium">{module.name}</h3>
                          <p className="text-sm text-muted-foreground">{module.code}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
                        {module.courses.length} cours
                      </span>
                    </button>

                    {expandedModules.includes(module.id) && (
                      <div className="border-t px-4 pb-4">
                        <div className="mt-3 space-y-2">
                          {module.courses.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between rounded-md bg-background p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{course.name}</h4>
                                  <span className="text-sm text-muted-foreground">({course.code})</span>
                                </div>
                                <p className="text-sm text-muted-foreground">{course.instructor}</p>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-500">
                                  {course.credits} crédits
                                </span>
                                <span className="text-muted-foreground">{course.students} étudiants</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Directeur */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <Users className="h-5 w-5 text-primary" />
                Directeur
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nom</p>
                  <p className="font-medium">{department.director}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{department.directorEmail}</p>
                </div>
              </div>
            </div>

            {/* Informations financières */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <DollarSign className="h-5 w-5 text-primary" />
                Budget
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Budget annuel</p>
                  <p className="text-2xl font-bold">{department.budget.toLocaleString()} €</p>
                </div>
              </div>
            </div>

            {/* Autres infos */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <Calendar className="h-5 w-5 text-primary" />
                Informations
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Année de création</p>
                  <p className="font-medium">{department.founded}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Code département</p>
                  <p className="font-medium">{department.code}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
