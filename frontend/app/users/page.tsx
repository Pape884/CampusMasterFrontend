"use client"

import { useState } from "react"
import { StatsCards } from "@/components/cards/state-card"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import { UserRole } from "@/components/layout/SidebarMenu"
import {UsersTable} from "@/components/admin/users/userList"
import AdminLayout from "@/components/layout/AdminLayout"

export default function UsersPage(){
  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderDashboard = () => {
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
       <AdminLayout userRole={userRole} title="Gestion des utilisateurs">
            <StatsCards />
            <br />
            {renderDashboard()}
        </AdminLayout>

  )
}