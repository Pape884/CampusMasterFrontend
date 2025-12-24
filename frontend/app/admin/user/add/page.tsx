"use client"

import AddUser from "@/components/admin/users/add-user"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import { useState } from "react"

export default function addUserPage(){
    const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderViews= () => {
    switch (userRole) {
        case "admin":
            return <AddUser />
        case "teacher":
            return <TeacherDashboard />
        case "student":
            return <StudentDashboard />
        default:
            return null
    }
 }

  return (
       <Layout userRole={userRole} title="Gestion des utilisateurs">
            {renderViews()}
        </Layout>

  )
}