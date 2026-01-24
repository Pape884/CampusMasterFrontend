"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import AddDevoirPage from "@/components/teacher/devoir/add-devoir"

export default function addDevoir() {
    const userRole: UserRole = "teacher" // Changez cette valeur pour tester différents rôles

    return (
        <Layout userRole={userRole} title="Ajouter un Devoir">
            {/* Contenu pour ajouter un devoir */}
            <AddDevoirPage />
        </Layout>
    )
}