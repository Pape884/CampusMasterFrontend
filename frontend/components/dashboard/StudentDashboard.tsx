// components/dashboard/StudentDashboard.tsx
"use client"

import { BookOpen, BarChart3, FileText, Clock } from "lucide-react"
import StatsCards from "@/components/ui/StatsCards"
import RecentActivity from "@/components/ui/RecentActivity"
import PopularCourses from "@/components/ui/PopularCourses"
import StatisticsSection from "./StatisticsSection"

const StudentDashboard = () => {
  const stats = [
    {
      title: "Cours Actifs",
      value: "6",
      icon: BookOpen,
      description: "En cours",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Progression",
      value: "78%",
      icon: BarChart3,
      description: "Moyenne générale",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Devoirs",
      value: "5",
      icon: FileText,
      description: "À rendre",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Temps d'Étude",
      value: "24h",
      icon: Clock,
      description: "Cette semaine",
      gradient: "from-green-500 to-green-600",
    },
  ]

  const continueLearning = [
    { title: "Introduction à React", progress: 68, time: "2h 30min restant" },
    { title: "Mathématiques Avancées", progress: 45, time: "4h 15min restant" },
    { title: "Histoire Moderne", progress: 82, time: "1h 10min restant" },
  ]

  const urgentAssignments = [
    { title: "TP - Structures de Données", course: "Informatique", due: "Demain 23:59", urgent: true },
    { title: "Dissertation - Littérature", course: "Français", due: "Dans 2 jours", urgent: true },
    { title: "Exercices - Chimie Organique", course: "Chimie", due: "Dans 4 jours", urgent: false },
    { title: "Projet - Application Web", course: "Développement", due: "Dans 7 jours", urgent: false },
  ]

  return (
    <>
      <StatsCards stats={stats} />
      <StatisticsSection />
      <RecentActivity 
        courses={continueLearning} 
        title="Continuer l'Apprentissage" 
        description="Reprendre là où vous vous êtes arrêté" 
        type="student"
      />
      <PopularCourses 
        assignments={urgentAssignments} 
        title="Devoirs Urgents" 
        description="À rendre bientôt" 
        type="student"
      />
    </>
  )
}

export default StudentDashboard