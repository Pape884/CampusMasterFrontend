"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  ArrowLeft,
  Save,
  Upload,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { courseService } from "@/lib/api/services/course.service"
import { enrollmentService } from "@/lib/api/services/enrollment.service"
import { CourseFormData, courseSchema } from "@/lib/validations/course.schema"
import { useAuth } from "@/lib/hooks/use-auth"
import { Module } from "@/lib/api/services"


export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams()

  const courseId = params.id as string | undefined
  const isEditMode = !!courseId

  const [isLoading, setIsLoading] = useState(false)
  const [modules, setModules] = useState<Module[]>([])

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      titre: "",
      code: "",
      credits: "", 
      description: "",
      moduleId: "",
      status: "draft",
    },
  })


  // Charger les modules et les données du cours
  useEffect(() => {
    async function loadData() {
      try {
        const user = useAuth().getUser()
        if (user) {
          // Charger les modules
          const teacherModules = await enrollmentService.getTeacherModules(user.id)
          setModules(teacherModules)
        }

        // Si mode édition, charger le cours
        if (isEditMode && courseId) {
          const courseData = await courseService.getCourseById(courseId)
          form.reset({
            titre: courseData.titre,
            code: courseData.code,
            description: courseData.description || "",
            moduleId: courseData.moduleId,
            status: courseData.status,
          })


        }
      } catch (error: any) {
        toast.error("Erreur", {
          description: "Impossible de charger les données",
        })
      }
    }

    loadData()
  }, [courseId, isEditMode, form])


  // Soumission du formulaire
  const onSubmit = async (data: CourseFormData) => {
    setIsLoading(true)

    try {
      if (isEditMode && courseId) {
        // Mise à jour
        await courseService.updateCourse(courseId, data)
        toast.success("Cours mis à jour", {
          description: "Les modifications ont été enregistrées",
        })
      } else {
        // Création
        await courseService.createCourse(data)
        toast.success("Cours créé", {
          description: "Le nouveau cours a été créé avec succès",
        })
      }

      router.push('/teacher/courses')
      router.refresh()
    } catch (error: any) {
      console.log(error)
      toast.error("Erreur", {
        description: error.message || "Une erreur est survenue",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>

          <h1 className="text-3xl font-bold text-foreground">
            {isEditMode ? "Modifier le cours" : "Nouveau cours"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isEditMode
              ? "Modifiez les informations de votre cours"
              : "Créez un nouveau cours pour vos étudiants"}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Informations de base */}
              <Card className="p-6 md:col-span-2">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Informations de base
                </h2>

                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="titre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre du cours *</FormLabel>
                        <FormControl>
                          <Input placeholder="Algèbre Linéaire" {...field} />
                        </FormControl>
                        <FormDescription>
                          Donnez un titre clair et descriptif à votre cours
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Code du cours *</FormLabel>
                        <FormControl>
                          <Input placeholder="MATH301" {...field} />
                        </FormControl>
                        <FormDescription>
                          Code unique pour identifier le cours
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moduleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Module *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez un module" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {modules.map((module) => (
                              <SelectItem key={module.id} value={module.id}>
                                {module.name} ({module.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Module auquel appartient ce cours
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6 md:col-span-2">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Description
                </h2>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez le contenu, les objectifs et les prérequis du cours..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Cette description aidera les étudiants à comprendre ce qu'ils apprendront
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>

              {/* Nombre de Credit du cours */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Crédits
                </h2>

                <FormField
                  control={form.control}
                  name="credits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de crédits *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="3" {...field} />
                      </FormControl>
                      <FormDescription>
                        Nombre de crédits attribués au cours
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </Card>

              {/* Prérequis */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-6">
                  Publication
                </h2>

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Publier immédiatement
                          </FormLabel>
                          <FormDescription>
                            Les étudiants pourront voir le cours
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value === "published"}
                            onCheckedChange={(checked) => {
                              field.onChange(checked ? "published" : "draft")
                            }}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <Alert>
                    <AlertDescription className="text-sm">
                      <strong>Brouillon :</strong> Le cours n'est visible que par vous<br />
                      <strong>Publié :</strong> Le cours est visible par tous les étudiants
                    </AlertDescription>
                  </Alert>
                </div>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isLoading} className="gap-2">
                <Save className="h-4 w-4" />
                {isLoading
                  ? "Enregistrement..."
                  : isEditMode
                    ? "Mettre à jour"
                    : "Créer le cours"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}