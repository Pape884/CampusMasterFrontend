// components/dashboard/AdminDashboard.tsx
"use client"

import { Users, GraduationCap, BookOpen, BarChart3 } from "lucide-react"
import StatsCards from "@/components/ui/StatsCards"
import RecentActivity from "@/components/ui/RecentActivity"
import PopularCourses from "@/components/ui/PopularCourses"
import StatisticsSection from "./StatisticsSection"

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Étudiants",
      value: "1,248",
      icon: Users,
      description: "+12% ce mois",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Enseignants",
      value: "84",
      icon: GraduationCap,
      description: "+3 nouveaux",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Cours Actifs",
      value: "156",
      icon: BookOpen,
      description: "23 en cours",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Taux de Complétion",
      value: "87%",
      icon: BarChart3,
      description: "+5% vs mois dernier",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  const recentActivity = [
    {
      user: "Marie Dupont",
      action: "a créé un nouveau cours",
      time: "Il y a 5 min",
      color: "bg-blue-100 text-blue-700",
    },
    {
      user: "Jean Martin",
      action: "s'est inscrit",
      time: "Il y a 12 min",
      color: "bg-green-100 text-green-700",
    },
    {
      user: "Sophie Bernard",
      action: "a terminé un cours",
      time: "Il y a 1h",
      color: "bg-purple-100 text-purple-700",
    },
    {
      user: "Pierre Dubois",
      action: "a posté un commentaire",
      time: "Il y a 2h",
      color: "bg-orange-100 text-orange-700",
    },
  ]

  const popularCourses = [
    { title: "Introduction à la Programmation", students: 342, progress: 85 },
    { title: "Mathématiques Avancées", students: 298, progress: 72 },
    { title: "Histoire de l'Art", students: 276, progress: 68 },
    { title: "Physique Quantique", students: 234, progress: 59 },
  ]

  return (
    <>
      <StatsCards stats={stats} />
      <StatisticsSection />
      <RecentActivity activities={recentActivity} title="Activité Récente" description="Dernières actions sur la plateforme" />
      <PopularCourses courses={popularCourses} title="Cours Populaires" description="Les plus consultés cette semaine" />
    </>
  )
}

export default AdminDashboard