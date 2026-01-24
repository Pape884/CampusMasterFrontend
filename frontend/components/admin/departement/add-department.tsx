"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, X, Building2, BookOpen } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { departmentService } from "@/lib/api/services/department.service"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Module } from "@/lib/api/services"



export default function AddDepartmentPage() {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  })

  const router = useRouter();

  const [modules, setModules] = useState<Module[]>([])
  const [showModuleForm, setShowModuleForm] = useState(false)
  const [currentModule, setCurrentModule] = useState({ name: "", code: "", semestre: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const addModule = () => {
    if (currentModule.name && currentModule.code) {
      setModules([
        ...modules,
        {
          id: Date.now().toString(),
          name: currentModule.name,
          code: currentModule.code,
          semestre: currentModule.semestre,
        },
      ])
      setCurrentModule({ name: "", code: "", semestre: "" })
      setShowModuleForm(false)
    }
  }

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id))
  }

  /*const addCourse = (moduleId: string) => {
    if (currentCourse.name && currentCourse.code && currentCourse.credits) {
      setModules(
        modules.map((module) =>
          module.id === moduleId
            ? {
                ...module,
                courses: [
                  ...module.courses,
                  {
                    id: Date.now().toString(),
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
  }*/

  /*const removeCourse = (moduleId: string, courseId: string) => {
    setModules(
      modules.map((module) =>
        module.id === moduleId
          ? {
              ...module,
              courses: module.courses.filter((c) => c.id !== courseId),
            }
          : module,
      ),
    )
  }*/


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setErrorMessage(null)
    setIsSubmitting(true)

    try {
      console.log("[v0] Department data:", { ...formData, modules })

      await departmentService.createDepartment({
        ...formData,
        modules,
      })

      toast.success("Département créé avec succès ✅")

      // optionnel : reset formulaire ou redirection
      router.push("/admin/departments")

    } catch (error: any) {
      console.error("❌ Erreur création département:", error)

      // Erreur venant de l’API
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Une erreur est survenue lors de la création du département"

      setErrorMessage(message)

      toast.error("Erreur", {
        description: message,
      })

    } finally {
      setIsSubmitting(false)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        {/* Header */}
        <div className="mb-4 flex items-center gap-4">
          <Link href="/admin/department">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-m-foreground">Retour</p>

        </div>

        {errorMessage && (
          <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm border border-red-200">
            {errorMessage}
          </div>
        )}

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
                  placeholder="Mathématiques"
                  required
                />
              </div>
              <div>
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="MATH"
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
                placeholder="Description du département..."
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

            {/* Formulaire d'ajout de module */}
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
                  <div>
                    <Label htmlFor="moduleSemestre">Semestre</Label>
                    <Input
                      id="moduleSemestre"
                      value={currentModule.semestre}
                      onChange={(e) => setCurrentModule({ ...currentModule, semestre: e.target.value })}
                      placeholder="Semestre 1"
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
                      setCurrentModule({ name: "", code: "", semestre: "" })
                    }}
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            )}

            {/* Liste des modules */}
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="rounded-lg border bg-muted/30 p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{module.name} ({module.code})</h3>
                      <p className="text-sm text-muted-foreground">{module.semestre}</p>

                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeModule(module.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {modules.length === 0 && !showModuleForm && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucun module ajouté. Cliquez sur le bouton ci-dessus pour ajouter un module.
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/admin/departments" className="flex-1">
              <Button type="button" variant="outline" className="w-full bg-transparent">
                Annuler
              </Button>
            </Link>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Enregistrement..." : "Enregistrer"}
            </Button>

          </div>
        </form>
      </div>
    </div>
  )
}
