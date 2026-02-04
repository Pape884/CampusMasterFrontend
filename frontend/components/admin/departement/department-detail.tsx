"use client"

import { useEffect, useState } from "react"
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
import { departmentService } from "@/lib/api/services/department.service"
import { Department } from "@/lib/api/services"



export default function DepartmentDetailsPage({ params }: { params: { id: string } }) {
  const [expandedModules, setExpandedModules] = useState<string[]>([])
  const [department, setDepartment] = useState<Department | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  useEffect(() => {
  const fetchDepartment = async () => {
    try {
      setIsLoading(true)
      console.log(params)
      const data = await departmentService.getDepartmentById(params.id)
      setDepartment(data)
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Impossible de charger les informations du département"
      )
    } finally {
      setIsLoading(false)
    }
  }

  fetchDepartment()
}, [params.id])


  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => (prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]))
  }

  if (isLoading) {
  return <div className="p-8">Chargement...</div>
}


if (error) {
  return (
    <div className="p-8 text-red-600">
      {error}
    </div>
  )
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
                <h1 className="text-3xl font-semibold text-foreground">{department?.name}</h1>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {department?.code}
                </span>
              </div>
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
            <div className="text-2xl font-bold">{department?.studentsCount || 0}</div>
            <p className="text-sm text-muted-foreground">Étudiants</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <GraduationCap className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{department?.teachersCount || 0}</div>
            <p className="text-sm text-muted-foreground">Enseignants</p>
          </div>
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-2 flex items-center justify-between">
              <BookOpen className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold">{department?.modulesCount || 0}</div>
            <p className="text-sm text-muted-foreground">Cours</p>
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
              <p className="text-muted-foreground">{department?.description}</p>
            </div>

            {/* Modules et Cours */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <BookOpen className="h-5 w-5 text-primary" />
                Modules et Cours ({department?.modulesCount} modules, {department?.coursesCount} cours)
              </h2>
              <div className="space-y-3">
                {department?.modules?.map((module) => (
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
                        {module.courses?.length} cours
                      </span>
                    </button>

                    {expandedModules.includes(module.id) && (
                      <div className="border-t px-4 pb-4">
                        <div className="mt-3 space-y-2">
                          {module.courses?.map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between rounded-md bg-background p-3"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">{course.titre}</h4>
                                  <span className="text-sm text-muted-foreground">({course.code})</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm">
                                <span className="rounded-full bg-blue-500/10 px-2 py-1 text-xs text-blue-500">
                                  {course.credits} crédits
                                </span>
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

            {/* Autres infos */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
                <Calendar className="h-5 w-5 text-primary" />
                Informations
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Code département</p>
                  <p className="font-medium">{department?.code}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
