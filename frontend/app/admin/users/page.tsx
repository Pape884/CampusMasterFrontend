"use client"

import { useState } from "react"
import { StatsCards } from "@/components/cards/state-card"
import { UserRole } from "@/components/layout/SidebarMenu"
import {UsersTable} from "@/components/admin/users/userList"
import AdminLayout from "@/components/layout/Layout"
import Layout from "@/components/layout/Layout"

export default function UsersPage(){
  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderDashboard = () => {
    switch (userRole) {
        case "admin":
            return <UsersTable />
        case "teacher":
            return null
        case "student":
            return null
        default:
            return null
    }
 }

  return (
       <Layout userRole={userRole} title="Gestion des utilisateurs">
            <StatsCards />
            <br />
            {renderDashboard()}
        </Layout>
  )
}