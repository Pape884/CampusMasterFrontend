// components/dashboard/TeacherDashboard.tsx
"use client"

import { BookOpen, Users, FileText, Award } from "lucide-react"
import StatsCards from "@/components/ui/StatsCards"
import RecentActivity from "@/components/ui/RecentActivity"
import PopularCourses from "@/components/ui/PopularCourses"
import StatisticsSection from "./StatisticsSection"

const TeacherDashboard = () => {
  const stats = [
    {
      title: "Mes Cours",
      value: "8",
      icon: BookOpen,
      description: "3 actifs",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Total Étudiants",
      value: "156",
      icon: Users,
      description: "Tous les cours",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Devoirs à Corriger",
      value: "24",
      icon: FileText,
      description: "À faire",
      gradient: "from-orange-500 to-orange-600",
    },
    {
      title: "Taux de Réussite",
      value: "92%",
      icon: Award,
      description: "Cette année",
      gradient: "from-purple-500 to-purple-600",
    },
  ]

  const assignmentsToGrade = [
    { title: "Essai - Révolution Française", course: "Histoire", due: "Dans 2 jours", count: 28 },
    { title: "TP - Algorithmes de Tri", course: "Informatique", due: "Dans 3 jours", count: 22 },
    { title: "Exercices - Équations Différentielles", course: "Mathématiques", due: "Dans 5 jours", count: 31 },
  ]

  const upcomingClasses = [
    { course: "Introduction à React", time: "Lun 10:00", room: "Salle A201", students: 28 },
    { course: "Base de Données Avancées", time: "Mar 14:00", room: "Salle B105", students: 22 },
    { course: "Architecture Logicielle", time: "Mer 09:00", room: "Salle A301", students: 31 },
    { course: "Projet de Fin d'Année", time: "Ven 15:00", room: "Labo Info", students: 18 },
  ]

  return (
    <>
      <StatsCards stats={stats} />
      <StatisticsSection />
      <RecentActivity 
        assignments={assignmentsToGrade} 
        title="Devoirs à Corriger" 
        description="Prochains devoirs à évaluer" 
        type="teacher"
      />
      <PopularCourses 
        classes={upcomingClasses} 
        title="Mes Prochains Cours" 
        description="Votre emploi du temps" 
        type="teacher"
      />
    </>
  )
}

export default TeacherDashboard