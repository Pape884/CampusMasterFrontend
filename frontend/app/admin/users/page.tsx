"use client"

import { useState } from "react"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import { UserRole } from "@/components/layout/SidebarMenu"
import {UsersTable} from "@/components/admin/users/userList"
import Layout from "@/components/layout/Layout"

export default function UsersPage(){
  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderViews= () => {
    switch (userRole) {
        case "admin":
            return <UsersTable />
        case "teacher":
            return <TeacherDashboard />
        case "student":
            return <StudentDashboard />
        default:
            return null
    }
 }

  return (
       <Layout userRole={userRole} title="Gestions des Utilisateurs">
            {renderViews()}
        </Layout>

  )
}