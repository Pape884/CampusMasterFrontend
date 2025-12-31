"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import MessagesPage from "@/components/messages/messagerie"
import { useState } from "react"

export default function Messagerie() {
    const [userRole] = useState<UserRole>("teacher") // Changez cette valeur pour tester différents rôles
    

    return (
        <Layout userRole={userRole} title="Messagerie">
            <MessagesPage />
        </Layout>

    )
}