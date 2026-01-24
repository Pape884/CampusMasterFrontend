"use client"
import AddDepartmentPage from "@/components/admin/departement/add-department"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"
import { useState } from "react"


export default function AddDepartment() {
    const { user, isLoading } = useAuthContext();
    // Pendant le chargement
    if (isLoading) {
        return <LoadingSpinner message="Chargement des données..." />;
    }

    // Si pas d'utilisateur
    if (!user) {
        return <Unauthorized />;
    }

    const id = { id: '1' } // Remplacez par la récupération réelle des paramètres d'URL


    return (
        <Layout userRole={user.role} title="Gestion des Départements">
            <AddDepartmentPage />
        </Layout>

    )
}