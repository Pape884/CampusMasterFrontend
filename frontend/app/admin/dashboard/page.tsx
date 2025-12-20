// app/dashboard/page.tsx
"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/AdminLayout"
import AdminDashboard from "@/components/dashboard/AdminDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import StudentDashboard from "@/components/dashboard/StudentDashboard"

type UserRole = "admin" | "teacher" | "student"

export default function DashboardPage() {
  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles

  const renderDashboard = () => {
    switch (userRole) {
      case "admin":
        return <AdminDashboard />
      case "teacher":
        return <TeacherDashboard />
      case "student":
        return <StudentDashboard />
      default:
        return null
    }
  }

  return (
    <DashboardLayout userRole={userRole} title="Tableau de Bord">
      {renderDashboard()}

    </DashboardLayout>
  )
}