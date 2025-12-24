"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function AddDevoirPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    dueDate: "",
    dueTime: "",
    maxScore: "20",
    allowLateSubmission: false,
  })

  const [attachments, setAttachments] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form data:", formData)
    console.log("Attachments:", attachments)
    router.push(`/teacher/courses/${courseId}/assignments`)
  }

  return (
    <div className="min-h-screen bg-background p-8 ">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/teacher/devoirs`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Créer un devoir</h1>
            <p className="text-muted-foreground mt-1">Ajouter un nouveau devoir pour ce cours</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="p-6 border-border/50 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du devoir</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Devoir 1: Introduction aux Bases de Données"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Courte description du devoir..."
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Instructions détaillées</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                placeholder="Fournissez les instructions détaillées pour ce devoir..."
                rows={6}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueTime">Heure limite</Label>
                <Input
                  id="dueTime"
                  type="time"
                  value={formData.dueTime}
                  onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxScore">Note maximale</Label>
              <Input
                id="maxScore"
                type="number"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: e.target.value })}
                min="1"
                max="100"
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="allowLate"
                type="checkbox"
                checked={formData.allowLateSubmission}
                onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="allowLate" className="cursor-pointer">
                Autoriser les soumissions en retard
              </Label>
            </div>
          </Card>

          {/* Attachments */}
          <Card className="p-6 border-border/50 space-y-4">
            <div className="space-y-2">
              <Label>Documents joints</Label>
              <p className="text-sm text-muted-foreground">
                Ajoutez des fichiers (PDF, Word, images, etc.) pour aider les étudiants
              </p>
            </div>

            <div className="space-y-3">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-border/80 transition-colors"
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Cliquez pour ajouter des fichiers</p>
                </div>
                <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
              </label>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/teacher/courses/${courseId}/assignments`)}
            >
              Annuler
            </Button>
            <Button type="submit">Créer le devoir</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
