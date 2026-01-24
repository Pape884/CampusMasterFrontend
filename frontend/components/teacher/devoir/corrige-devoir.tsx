"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function GradeSubmissionPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const assignmentId = params.assignmentId as string
  const submissionId = params.submissionId as string

  const [submission] = useState({
    studentName: "Jean Martin",
    studentMatricule: "ETU002",
    submittedAt: "2024-02-15T22:45",
    fileName: "devoir_martin.pdf",
    fileSize: "1.8 MB",
  })

  const [grading, setGrading] = useState({
    score: "",
    maxScore: "20",
    feedback: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Grading:", grading)
    router.push(`/teacher/courses/${courseId}/assignments/${assignmentId}`)
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push(`/teacher/devoirs/grade`)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Corriger la soumission</h1>
            <p className="text-muted-foreground mt-1">Évaluez le travail et fournissez un retour constructif</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Info & File */}
          <div className="space-y-6">
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Informations étudiant</h3>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {submission.studentName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-foreground">{submission.studentName}</p>
                  <p className="text-sm text-muted-foreground">{submission.studentMatricule}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Soumis le {new Date(submission.submittedAt).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Fichier soumis</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium text-foreground mb-1">{submission.fileName}</p>
                  <p className="text-sm text-muted-foreground">{submission.fileSize}</p>
                </div>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Télécharger le fichier
                </Button>
              </div>
            </Card>

            {/* PDF Viewer Placeholder */}
            <Card className="p-6 border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Aperçu du document</h3>
              <div className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Aperçu PDF</p>
              </div>
            </Card>
          </div>

          {/* Grading Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="p-6 border-border/50 space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-4">Évaluation</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="score">Note obtenue</Label>
                      <Input
                        id="score"
                        type="number"
                        value={grading.score}
                        onChange={(e) => setGrading({ ...grading, score: e.target.value })}
                        placeholder="Ex: 16"
                        min="0"
                        max={grading.maxScore}
                        step="0.5"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxScore">Note maximale</Label>
                      <Input
                        id="maxScore"
                        type="number"
                        value={grading.maxScore}
                        onChange={(e) => setGrading({ ...grading, maxScore: e.target.value })}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="feedback">Appréciation et commentaires</Label>
                  <Textarea
                    id="feedback"
                    value={grading.feedback}
                    onChange={(e) => setGrading({ ...grading, feedback: e.target.value })}
                    placeholder="Fournissez un retour détaillé sur le travail de l'étudiant..."
                    rows={12}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Soyez constructif et détaillez les points forts et les axes d'amélioration
                  </p>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/teacher/courses/${courseId}/assignments/${assignmentId}`)}
                >
                  Annuler
                </Button>
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Enregistrer la correction
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
