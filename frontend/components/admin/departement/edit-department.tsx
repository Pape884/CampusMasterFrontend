"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Plus, X, Building2, Users, BookOpen, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Module {
  id: string
  name: string
  code: string
  courses: Course[]
}

interface Course {
  id: string
  name: string
  code: string
  credits: number
}

export default function EditDepartmentPage({ params }: { params: { id: string } }) {
  // Données simulées à éditer
  const [formData, setFormData] = useState({
    name: "Département de Mathématiques",
    code: "MATH",
    description: "Le département de mathématiques offre une formation complète en mathématiques pures et appliquées.",
    director: "Dr. Marie Dubois",
    budget: "450000",
  })

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      name: "Algèbre",
      code: "ALG",
      courses: [
        { id: "1-1", name: "Algèbre Linéaire", code: "ALG101", credits: 6 },
        { id: "1-2", name: "Algèbre Abstraite", code: "ALG201", credits: 6 },
      ],
    },
    {
      id: "2",
      name: "Analyse",
      code: "ANA",
      courses: [{ id: "2-1", name: "Analyse Réelle", code: "ANA101", credits: 6 }],
    },
  ])

  const [showModuleForm, setShowModuleForm] = useState(false)
  const [currentModule, setCurrentModule] = useState({ name: "", code: "" })
  const [currentCourse, setCurrentCourse] = useState({ name: "", code: "", credits: "" })
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  const addModule = () => {
    if (currentModule.name && currentModule.code) {
      setModules([
        ...modules,
        {
          id: Date.now().toString(),
          name: currentModule.name,
          code: currentModule.code,
          courses: [],
        },
      ])
      setCurrentModule({ name: "", code: "" })
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
  }

  const removeCourse = (moduleId: string, courseId: string) => {
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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Updated department data:", { ...formData, modules })
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

          {/* Administration */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-medium">
              <Users className="h-5 w-5 text-primary" />
              Administration
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="director">Directeur</Label>
                <Input
                  id="director"
                  value={formData.director}
                  onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="budget">Budget annuel (€)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>
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
                      setCurrentModule({ name: "", code: "" })
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
                    {module.courses.map((course) => (
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
            <Button type="submit" className="flex-1">
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
