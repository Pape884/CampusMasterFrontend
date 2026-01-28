"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { ArrowLeft, Plus, X, Building2, Users, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Module } from "@/lib/api/services"
import { error } from "console"
import { departmentService } from "@/lib/api/services/department.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  // Données simulées à éditer
  const [formData, setFormData] = useState({
    id: params.id,
    name: "",
    code: "",
    description: "",
  })

  const [modules, setModules] = useState<Module[]>([])

  const [showModuleForm, setShowModuleForm] = useState(false)
  const [currentModule, setCurrentModule] = useState({ id: "", name: "", code: "", semestre: "", departmentId: "" })
  const [currentCourse, setCurrentCourse] = useState({ name: "", code: "", credits: "" })
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter();


  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        setIsLoading(true)
        const data = await departmentService.getDepartmentById(params.id)

        setFormData({
          id: data.id,
          name: data.name,
          code: data.code,
          description: data.description ?? "",
        })

        setModules(data.modules ?? [])
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
          "Erreur lors du chargement du département"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchDepartment()
  }, [params.id])


  const addModule = () => {
    if (currentModule.name && currentModule.code) {
      setModules([
        ...modules,
        {
          id: currentModule.id,
          name: currentModule.name,
          code: currentModule.code,
          semestre: currentModule.semestre,
          courses: [],
          departmentId: currentModule.departmentId
        },
      ])
      setCurrentModule({ id: "", name: "", code: "", semestre: "", departmentId: "" })
      setShowModuleForm(false)
    }
  }

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  const addCourse = (moduleId: string) => {
    if (currentCourse.name && currentCourse.code && currentCourse.credits) {
      setModules(
        modules.map((module) =>
          module.id === moduleId
            ? {
              ...module,
              courses: [
                ...module.courses,
                {
                  name: currentCourse.name,
                  code: currentCourse.code,
                  credits: Number.parseInt(currentCourse.credits),
                },
              ],
            }
            : module,
        ),
      )
      setCurrentCourse({ name: "", code: "", credits: "" })
      setSelectedModuleId(null)
    }
  }

  const removeCourse = (moduleId: string, courseId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
            ...module,
            courses: module.courses?.filter((c) => c.id !== courseId),
          }
          : module,
      ),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      await departmentService.updateDepartment(params.id, {
        ...formData,
        modules,
      })

      // Optionnel : notification
      toast.success("Département mis à jour avec succès", { position: "top-center" })
      router.push("/admin/department")

    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
        "Erreur lors de la mise à jour du département"
      )
      toast.error("Erreur lors de la mise à jour du département", { position: "top-center" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-8">Chargement du département...</div>
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
        <div className="mb-8 flex items-center gap-4">
          <Link href={`/admin/department`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Modifier le département</h1>
            <p className="text-muted-foreground">Mettez à jour les informations du département</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mx-auto space-y-6">
          {/* Informations de base */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
              <Building2 className="h-5 w-5 text-primary" />
              Informations de base
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Nom du département *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>



          {/* Modules et Cours */}
          <div className="rounded-lg border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-lg font-medium">
                <BookOpen className="h-5 w-5 text-primary" />
                Modules et Cours
              </h2>
              <Button type="button" variant="outline" size="sm" onClick={() => setShowModuleForm(!showModuleForm)}>
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un module
              </Button>
            </div>

            {showModuleForm && (
              <div className="mb-4 rounded-lg border border-dashed bg-muted/50 p-4">
                <div className="mb-3 grid gap-3 md:grid-cols-2">
                  <div>
                    <Label htmlFor="moduleName">Nom du module</Label>
                    <Input
                      id="moduleName"
                      value={currentModule.name}
                      onChange={(e) => setCurrentModule({ ...currentModule, name: e.target.value })}
                      placeholder="Algèbre"
                    />
                  </div>
                  <div>
                    <Label htmlFor="moduleCode">Code</Label>
                    <Input
                      id="moduleCode"
                      value={currentModule.code}
                      onChange={(e) => setCurrentModule({ ...currentModule, code: e.target.value })}
                      placeholder="ALG101"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={addModule}>
                    Ajouter
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowModuleForm(false)
                      setCurrentModule({ id: "", name: "", code: "", semestre: "", departmentId: "" })
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{module.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.code}</p>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(module.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="ml-4 space-y-2">
                    {module.courses?.map((course) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between rounded-md bg-background px-3 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{course.name}</span>
                          <span className="text-xs text-muted-foreground">({course.code})</span>
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                            {course.credits} crédits
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => removeCourse(module.id, course.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}

                    {selectedModuleId === module.id ? (
                      <div className="rounded-md border border-dashed bg-background p-3">
                        <div className="mb-2 grid gap-2 md:grid-cols-3">
                          <Input
                            placeholder="Nom du cours"
                            value={currentCourse.name}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                          />
                          <Input
                            placeholder="Code"
                            value={currentCourse.code}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, code: e.target.value })}
                          />
                          <Input
                            type="number"
                            placeholder="Crédits"
                            value={currentCourse.credits}
                            onChange={(e) => setCurrentCourse({ ...currentCourse, credits: e.target.value })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="secondary" onClick={() => addCourse(module.id)}>
                            Ajouter
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedModuleId(null)
                              setCurrentCourse({ name: "", code: "", credits: "" })
                            }}
                          >
                            Annuler
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="w-full"
                        onClick={() => setSelectedModuleId(module.id)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Ajouter un cours
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href={`/admin/departments`} className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="flex-1" disabled={isSaving}>
              {isSaving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  )
}
