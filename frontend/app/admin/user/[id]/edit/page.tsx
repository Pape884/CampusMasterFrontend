"use client"
import EditUser from "@/components/admin/users/edit-user"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"
import { useState } from "react"



export default function EditUserPage() {

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
       <Layout userRole={user.role} title="Gestion des utilisateurs">
            <EditUser/>
        </Layout>

  )
}