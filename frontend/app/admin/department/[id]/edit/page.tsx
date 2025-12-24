"use client"
import EditDepartmentPage from "@/components/admin/departement/edit-department"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import { useState } from "react"


export default function EditDepartment(){
    const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
    const id = {id: '1'} // Remplacez par la récupération réelle des paramètres d'URL
    const renderViews= () => {
        switch (userRole) {
            case "admin":
                return <EditDepartmentPage params={id} />
            case "teacher":
                return <TeacherDashboard />
            case "student":
                return <StudentDashboard />
            default:
                return null
        }
    }

    return (
        <Layout userRole={userRole} title="Gestion des Départements">
            {renderViews()}
        </Layout>

    )
}