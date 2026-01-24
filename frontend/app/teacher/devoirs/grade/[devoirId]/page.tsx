"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import GradeSubmissionPage from "@/components/teacher/devoir/corrige-devoir"

export default function CorrectionDevoir() {
    const userRole: UserRole = "teacher" // Changez cette valeur pour tester différents rôles
    
    return (
        <Layout userRole={userRole} title="Correction des Devoirs">
            <GradeSubmissionPage />
        </Layout>
    )
}