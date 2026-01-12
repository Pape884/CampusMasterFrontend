"use client"
import DepartmentDetailsPage from "@/components/admin/departement/department-detail"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"
import { useState } from "react"


export default function DepartmentDetail() {

    const id = {id: '1'} // Remplacez par la récupération réelle des paramètres d'URL
    const { user } = useAuthContext();
          
    // Si pas d'utilisateur
    if (!user) {
    return <Unauthorized />;
    }
    

    return (
        <Layout userRole={user.role} title="Gestion des Départements">
            <DepartmentDetailsPage params={id} />
        </Layout>

    )
}