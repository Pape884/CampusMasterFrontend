"use client"
import { UserRole } from "@/components/layout/SidebarMenu"
import Layout from "@/components/layout/Layout"
import ProfilePage from "@/components/profile/profile"
import { useState } from "react"

export default function Profile() {
    const [userRole] = useState<UserRole>("teacher") // Changez cette valeur pour tester différents rôles
    

    return (
        <Layout userRole={userRole} title="Mon Profil">
            <ProfilePage />
        </Layout>

    )
}