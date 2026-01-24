"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Plus, Calendar, Users, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  totalStudents: number
  submittedCount: number
  gradedCount: number
  status: "active" | "closed" | "draft"
}

export default function AssignmentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [assignments] = useState<Assignment[]>([
    {
      id: "1",
      title: "Devoir 1: Introduction aux Bases de Données",
      description: "Créer un schéma de base de données pour un système de gestion de bibliothèque",
      dueDate: "2024-02-15",
      totalStudents: 45,
      submittedCount: 38,
      gradedCount: 35,
      status: "active",
    },
    {
      id: "2",
      title: "Projet SQL: Requêtes Avancées",
      description: "Implémenter des requêtes SQL complexes avec jointures et sous-requêtes",
      dueDate: "2024-02-28",
      totalStudents: 45,
      submittedCount: 12,
      gradedCount: 0,
      status: "active",
    },
    {
      id: "3",
      title: "Devoir 2: Normalisation",
      description: "Normaliser une base de données jusqu'à la 3NF",
      dueDate: "2024-01-30",
      totalStudents: 45,
      submittedCount: 45,
      gradedCount: 45,
      status: "closed",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
      case "closed":
        return "bg-slate-500/10 text-slate-600 border-slate-500/20"
      case "draft":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20"
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-500/20"
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-emerald-500"
    if (percentage >= 50) return "bg-blue-500"
    return "bg-amber-500"
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Gérer les devoirs et suivre les soumissions</h2>
            </div>
          </div>
          <Button onClick={() => router.push(`/teacher/devoirs/add`)} className="gap-2">
            <Plus className="h-4 w-4" />
            Créer un devoir
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-blue-500/10">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{assignments.length}</p>
                <p className="text-sm text-muted-foreground">Total devoirs</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <Clock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{assignments.filter((a) => a.status === "active").length}</p>
                <p className="text-sm text-muted-foreground">En cours</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-violet-500/10">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">{assignments.reduce((acc, a) => acc + a.submittedCount, 0)}</p>
                <p className="text-sm text-muted-foreground">Soumissions</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold">
                  {assignments.reduce((acc, a) => acc + (a.submittedCount - a.gradedCount), 0)}
                </p>
                <p className="text-sm text-muted-foreground">À corriger</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => {
            const submissionRate = Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
            const gradingRate =
              assignment.submittedCount > 0 ? Math.round((assignment.gradedCount / assignment.submittedCount) * 100) : 0

            return (
              <Card
                key={assignment.id}
                className="p-6 border-border/50 hover:border-border transition-all cursor-pointer"
                onClick={() => router.push(`/teacher/devoirs/grade`)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold text-foreground">{assignment.title}</h3>
                        <p className="text-sm text-muted-foreground">{assignment.description}</p>
                      </div>
                      <Badge variant="outline" className={getStatusColor(assignment.status)}>
                        {assignment.status === "active"
                          ? "Actif"
                          : assignment.status === "closed"
                            ? "Terminé"
                            : "Brouillon"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>Échéance: {new Date(assignment.dueDate).toLocaleDateString("fr-FR")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>
                          {assignment.submittedCount}/{assignment.totalStudents} soumis
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>{assignment.gradedCount} corrigés</span>
                      </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Soumissions</span>
                          <span className="font-medium">{submissionRate}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(submissionRate)} transition-all`}
                            style={{ width: `${submissionRate}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Correction</span>
                          <span className="font-medium">{gradingRate}%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(gradingRate)} transition-all`}
                            style={{ width: `${gradingRate}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
