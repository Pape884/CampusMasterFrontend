"use client"
import DepartmentDetailsPage from "@/components/admin/departement/department-detail"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import AdminLayout from "@/components/layout/AdminLayout"
import { UserRole } from "@/components/layout/SidebarMenu"
import { useState } from "react"


export default function DepartmentDetail() {
    const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
    const id = {id: '1'} // Remplacez par la récupération réelle des paramètres d'URL
    const renderViews= () => {
        switch (userRole) {
            case "admin":
                return <DepartmentDetailsPage params={id} />
            case "teacher":
                return <TeacherDashboard />
            case "student":
                return <StudentDashboard />
            default:
                return null
        }
    }

    return (
        <AdminLayout userRole={userRole} title="Gestion des Départements">
            {renderViews()}
        </AdminLayout>

    )
}