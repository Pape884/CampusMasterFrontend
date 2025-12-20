"use client"
import UserDetailsPage from "@/components/admin/users/user-detail"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import AdminLayout from "@/components/layout/AdminLayout"
import { UserRole } from "@/components/layout/SidebarMenu"
import { useState } from "react"

export default function DetailsPage(){

  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderViews= () => {
    switch (userRole) {
        case "admin":
            return <UserDetailsPage />
        case "teacher":
            return <TeacherDashboard />
        case "student":
            return <StudentDashboard />
        default:
            return null
    }
 }

  return (
       <AdminLayout userRole={userRole} title="Gestion des utilisateurs">
            {renderViews()}
        </AdminLayout>

  )
}