"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Download, Eye, CheckCircle, XCircle, Clock, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Submission {
  id: string
  studentId: string
  studentName: string
  studentMatricule: string
  submittedAt: string
  fileName: string
  fileSize: string
  status: "graded" | "pending" | "late"
  score?: number
  maxScore: number
  feedback?: string
}

export default function AvancementDevoirPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const assignmentId = params.assignmentId as string

  const [assignment] = useState({
    title: "Devoir 1: Introduction aux Bases de Données",
    description: "Créer un schéma de base de données pour un système de gestion de bibliothèque",
    dueDate: "2024-02-15T23:59",
    maxScore: 20,
    instructions: "Vous devez concevoir un schéma de base de données complet...",
  })

  const [submissions] = useState<Submission[]>([
    {
      id: "1",
      studentId: "1",
      studentName: "Marie Dubois",
      studentMatricule: "ETU001",
      submittedAt: "2024-02-14T18:30",
      fileName: "devoir1_dubois.pdf",
      fileSize: "2.4 MB",
      status: "graded",
      score: 18,
      maxScore: 20,
      feedback: "Excellent travail, schéma bien structuré",
    },
    {
      id: "2",
      studentId: "2",
      studentName: "Jean Martin",
      studentMatricule: "ETU002",
      submittedAt: "2024-02-15T22:45",
      fileName: "devoir_martin.pdf",
      fileSize: "1.8 MB",
      status: "pending",
      maxScore: 20,
    },
    {
      id: "3",
      studentId: "3",
      studentName: "Sophie Laurent",
      studentMatricule: "ETU003",
      submittedAt: "2024-02-16T10:00",
      fileName: "tp1_laurent.pdf",
      fileSize: "3.1 MB",
      status: "late",
      maxScore: 20,
    },
  ])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "graded":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Corrigé
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <Clock className="h-3 w-3 mr-1" />
            En attente
          </Badge>
        )
      case "late":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            En retard
          </Badge>
        )
    }
  }

  const gradedCount = submissions.filter((s) => s.status === "graded").length
  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const lateCount = submissions.filter((s) => s.status === "late").length

  return (
    <div className="min-h-screen bg-background p-8 ">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(`/teacher/devoirs`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-foreground">{assignment.title}</h1>
            <p className="text-muted-foreground mt-1">{assignment.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{submissions.length}</p>
                <p className="text-sm text-muted-foreground">Soumissions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{gradedCount}</p>
                <p className="text-sm text-muted-foreground">Corrigés</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{lateCount}</p>
                <p className="text-sm text-muted-foreground">En retard</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Submissions List */}
        <Card className="border-border/50">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">Soumissions des étudiants</h2>
          </div>
          <div className="divide-y divide-border">
            {submissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {submission.studentName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-foreground">{submission.studentName}</h3>
                        {getStatusBadge(submission.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{submission.studentMatricule}</span>
                        <span>•</span>
                        <span>
                          Soumis le {new Date(submission.submittedAt).toLocaleDateString("fr-FR")} à{" "}
                          {new Date(submission.submittedAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">{submission.fileName}</span>
                        <span className="text-sm text-muted-foreground">({submission.fileSize})</span>
                      </div>
                      {submission.status === "graded" && (
                        <div className="mt-2 text-sm">
                          <span className="font-semibold text-foreground">
                            Note: {submission.score}/{submission.maxScore}
                          </span>
                          {submission.feedback && <p className="text-muted-foreground mt-1">{submission.feedback}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Télécharger
                    </Button>
                    {submission.status === "graded" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/teacher/devoirs/grade/${submission.id}`)
                        }
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Voir
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() =>
                          router.push(`/teacher/devoirs/grade/${submission.id}`)
                        }
                      >
                        Corriger
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
