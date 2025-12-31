"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Calendar, Clock, Download, Upload, CheckCircle2, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function AssignmentDetailsPage({ params }: { params: { id: string } }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [comment, setComment] = useState("")

  // Données simulées
  const assignment = {
    id: params.id,
    title: "Devoir 1 - Algorithmes de tri",
    course: "Algorithmique",
    courseColor: "bg-blue-500",
    teacher: "Dr. Sophie Martin",
    dueDate: "2024-01-15T23:59:00",
    submittedDate: null,
    status: "pending" as const,
    maxGrade: 20,
    grade: null,
    description:
      "Dans ce devoir, vous devrez implémenter et analyser différents algorithmes de tri. Vous comparerez leurs performances en termes de complexité temporelle et spatiale.",
    instructions: `
      1. Implémenter au moins 3 algorithmes de tri (bubble sort, quick sort, merge sort)
      2. Analyser la complexité temporelle de chaque algorithme
      3. Comparer les performances sur différents types de données
      4. Rédiger un rapport détaillé avec vos conclusions
      5. Soumettre votre code et votre rapport en PDF
    `,
    attachments: [
      { name: "Sujet_Devoir1.pdf", size: "245 KB", url: "#" },
      { name: "Donnees_test.zip", size: "1.2 MB", url: "#" },
    ],
    feedback: null,
  }

  const getDaysRemaining = () => {
    const today = new Date()
    const due = new Date(assignment.dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { text: `En retard de ${Math.abs(diffDays)} jour(s)`, color: "text-red-600" }
    if (diffDays === 0) return { text: "Aujourd'hui", color: "text-red-600" }
    if (diffDays === 1) return { text: "Demain", color: "text-yellow-600" }
    if (diffDays <= 3) return { text: `${diffDays} jours restants`, color: "text-yellow-600" }
    return { text: `${diffDays} jours restants`, color: "text-foreground" }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    // Logique de soumission
    alert("Devoir soumis avec succès!")
  }

  const remaining = getDaysRemaining()

  return (
    <div className="bg-background ">
      <div className="mx-auto space-y-6">
        {/* Retour */}
        <Link href="/student/assignments">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour aux devoirs
          </Button>
        </Link>

        {/* En-tête */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4 flex-1">
              <div
                className={`h-14 w-14 rounded-xl ${assignment.courseColor} flex items-center justify-center flex-shrink-0`}
              >
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">{assignment.title}</h1>
                <p className="text-muted-foreground">
                  {assignment.course} • {assignment.teacher}
                </p>
              </div>
            </div>
            <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">En attente</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date limite</p>
                <p className="text-sm font-medium text-foreground">
                  {new Date(assignment.dueDate).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-lg ${remaining.color === "text-red-600" ? "bg-red-500/10" : "bg-yellow-500/10"} flex items-center justify-center`}
              >
                <Clock
                  className={`h-5 w-5 ${remaining.color === "text-red-600" ? "text-red-600" : "text-yellow-600"}`}
                />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Temps restant</p>
                <p className={`text-sm font-medium ${remaining.color}`}>{remaining.text}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Note maximale</p>
                <p className="text-sm font-medium text-foreground">{assignment.maxGrade} points</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description et instructions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
          <p className="text-muted-foreground mb-6">{assignment.description}</p>

          <h3 className="text-md font-semibold text-foreground mb-3">Instructions</h3>
          <div className="text-muted-foreground whitespace-pre-line">{assignment.instructions}</div>
        </div>

        {/* Documents fournis */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Documents fournis</h2>
          <div className="space-y-2">
            {assignment.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de soumission */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Soumettre votre devoir</h2>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.zip"
            />

            {selectedFile ? (
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-4">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-foreground">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedFile(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium mb-2">Glissez-déposez votre fichier ici</p>
                <p className="text-sm text-muted-foreground mb-4">ou cliquez pour sélectionner un fichier</p>
                <label htmlFor="file-upload">
                  <Button variant="outline" asChild>
                    <span>Choisir un fichier</span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-3">Formats acceptés: PDF, DOC, DOCX, ZIP (max 10 MB)</p>
              </>
            )}
          </div>

          <div className="mt-4">
            <label className="text-sm font-medium text-foreground mb-2 block">Commentaire (optionnel)</label>
            <Textarea
              placeholder="Ajoutez un commentaire pour votre enseignant..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-3 mt-6">
            <Button className="flex-1" disabled={!selectedFile} onClick={handleSubmit}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Soumettre le devoir
            </Button>
            <Button variant="outline">Enregistrer comme brouillon</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
