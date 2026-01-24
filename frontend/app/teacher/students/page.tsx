"use client"

import { UserRole } from "@/components/layout/SidebarMenu"
import TeacherStudentsPage from "@/components/teacher/students-list"
import Layout from "@/components/layout/Layout"


export default function StudentList() {
    const userRole: UserRole = "teacher" // Changez cette valeur pour tester différents rôles
    
    return (
        <Layout userRole={userRole} title="Mes Etudiants">
            <TeacherStudentsPage />
        </Layout>
    )
} 