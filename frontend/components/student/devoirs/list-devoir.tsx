"use client"

import { useState } from "react"
import { Calendar, Clock, Upload, CheckCircle2, AlertCircle, FileText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type Assignment = {
  id: string
  title: string
  course: string
  courseColor: string
  dueDate: string
  status: "pending" | "submitted" | "graded" | "late"
  grade?: number
  maxGrade: number
  description: string
}

export default function StudentAssignmentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")

  // Données simulées
  const assignments: Assignment[] = [
    {
      id: "1",
      title: "Devoir 1 - Algorithmes de tri",
      course: "Algorithmique",
      courseColor: "bg-blue-500",
      dueDate: "2024-01-15",
      status: "pending",
      maxGrade: 20,
      description: "Implémenter et analyser différents algorithmes de tri",
    },
    {
      id: "2",
      title: "Projet Base de données",
      course: "Base de données",
      courseColor: "bg-green-500",
      dueDate: "2024-01-20",
      status: "submitted",
      maxGrade: 20,
      description: "Conception et implémentation d'une base de données relationnelle",
    },
    {
      id: "3",
      title: "TP - Programmation web",
      course: "Développement Web",
      courseColor: "bg-purple-500",
      dueDate: "2024-01-10",
      status: "graded",
      grade: 16,
      maxGrade: 20,
      description: "Créer une application web responsive avec React",
    },
    {
      id: "4",
      title: "Exercices Mathématiques",
      course: "Mathématiques",
      courseColor: "bg-orange-500",
      dueDate: "2024-01-05",
      status: "late",
      maxGrade: 20,
      description: "Résoudre les exercices du chapitre 5",
    },
    {
      id: "5",
      title: "Analyse de complexité",
      course: "Algorithmique",
      courseColor: "bg-blue-500",
      dueDate: "2024-01-25",
      status: "pending",
      maxGrade: 20,
      description: "Analyser la complexité temporelle et spatiale",
    },
    {
      id: "6",
      title: "Rapport de stage",
      course: "Stage professionnel",
      courseColor: "bg-pink-500",
      dueDate: "2024-01-30",
      status: "pending",
      maxGrade: 20,
      description: "Rédiger un rapport détaillé sur votre expérience de stage",
    },
  ]

  const stats = {
    total: assignments.length,
    pending: assignments.filter((a) => a.status === "pending").length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    graded: assignments.filter((a) => a.status === "graded").length,
  }

  const getStatusBadge = (status: Assignment["status"]) => {
    const badges = {
      pending: <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">En attente</Badge>,
      submitted: <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Soumis</Badge>,
      graded: <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Noté</Badge>,
      late: <Badge className="bg-red-500/10 text-red-600 border-red-500/20">En retard</Badge>,
    }
    return badges[status]
  }

  const getStatusIcon = (status: Assignment["status"]) => {
    const icons = {
      pending: <Clock className="h-5 w-5 text-yellow-600" />,
      submitted: <Upload className="h-5 w-5 text-blue-600" />,
      graded: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      late: <AlertCircle className="h-5 w-5 text-red-600" />,
    }
    return icons[status]
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return `En retard de ${Math.abs(diffDays)} jour(s)`
    if (diffDays === 0) return "Aujourd'hui"
    if (diffDays === 1) return "Demain"
    return `${diffDays} jours restants`
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.course.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || assignment.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="bg-background">
      <div className="mx-auto space-y-6">
        {/* En-tête */}
        <div>
          <p className="text-muted-foreground mt-1">Suivez vos devoirs et soumettez vos rendus</p>
        </div>

        {/* Cards statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total devoirs</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">En attente</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Soumis</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.submitted}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notés</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stats.graded}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un devoir ou un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => setFilterStatus("all")}
              size="sm"
            >
              Tous
            </Button>
            <Button
              variant={filterStatus === "pending" ? "default" : "outline"}
              onClick={() => setFilterStatus("pending")}
              size="sm"
            >
              En attente
            </Button>
            <Button
              variant={filterStatus === "submitted" ? "default" : "outline"}
              onClick={() => setFilterStatus("submitted")}
              size="sm"
            >
              Soumis
            </Button>
            <Button
              variant={filterStatus === "graded" ? "default" : "outline"}
              onClick={() => setFilterStatus("graded")}
              size="sm"
            >
              Notés
            </Button>
          </div>
        </div>

        {/* Liste des devoirs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`h-10 w-10 rounded-lg ${assignment.courseColor} flex items-center justify-center flex-shrink-0`}
                  >
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{assignment.title}</h3>
                    <p className="text-sm text-muted-foreground">{assignment.course}</p>
                  </div>
                </div>
                {getStatusBadge(assignment.status)}
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{assignment.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Date limite:</span>
                  <span className="font-medium text-foreground">
                    {new Date(assignment.dueDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span
                    className={`font-medium ${
                      assignment.status === "late"
                        ? "text-red-600"
                        : getDaysRemaining(assignment.dueDate).includes("jour(s)") &&
                            Number.parseInt(getDaysRemaining(assignment.dueDate)) <= 3
                          ? "text-yellow-600"
                          : "text-foreground"
                    }`}
                  >
                    {getDaysRemaining(assignment.dueDate)}
                  </span>
                </div>

                {assignment.status === "graded" && assignment.grade !== undefined && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-muted-foreground">Note:</span>
                    <span className="font-bold text-green-600">
                      {assignment.grade}/{assignment.maxGrade}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <Link href={`/student/assignments/${assignment.id}`}>
                  <Button
                    className="w-full"
                    variant={assignment.status === "pending" || assignment.status === "late" ? "default" : "outline"}
                  >
                    {assignment.status === "pending" || assignment.status === "late" ? (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Soumettre le devoir
                      </>
                    ) : assignment.status === "submitted" ? (
                      "Voir la soumission"
                    ) : (
                      "Voir les détails"
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Aucun devoir trouvé</h3>
            <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche</p>
          </div>
        )}
      </div>
    </div>
  )
}
