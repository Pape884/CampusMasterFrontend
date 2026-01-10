// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import Layout from "@/components/layout/Layout"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"


export default function DashboardPage() {
  const { user, isLoading } = useAuthContext();
  // Pendant le chargement
  if (isLoading) {
    return <LoadingSpinner message="Chargement du tableau de bord..." />;
  }
  
  // Si pas d'utilisateur
  if (!user) {
    return <Unauthorized />;
  }


  const renderDashboard = () => {
    switch (user.role) {
      case "ADMIN":
        return <AdminDashboard />
      case "TEACHER":
        return <TeacherDashboard />
      case "STUDENT":
        return <StudentDashboard />
      default:
        return null
    }
  }

  return (
    <Layout userRole={user.role as "ADMIN" | "TEACHER" | "STUDENT"} title="Tableau de Bord">
      {renderDashboard()}

    </Layout>
  )
}