"use client"

import { useState } from "react"
import { StatsCards } from "@/components/cards/state-card"
import { UserRole } from "@/components/layout/SidebarMenu"
import {UsersTable} from "@/components/admin/users/userList"
import Layout from "@/components/layout/Layout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"

export default function UsersPage(){
  const [userRole] = useState<UserRole>() // Changez cette valeur pour tester différents rôles
  const { user, isLoading } = useAuthContext();
    // Pendant le chargement
    if (isLoading) {
      return <LoadingSpinner message="Chargement du tableau de bord..." />;
    }
    
    // Si pas d'utilisateur
    if (!user) {
      return <Unauthorized />;
    }
  

  return (
       <Layout userRole={user.role as "ADMIN" | "TEACHER" | "STUDENT"} title="Gestion des utilisateurs">
            <StatsCards />
            <br />
            <UsersTable />
        </Layout>
  )
}