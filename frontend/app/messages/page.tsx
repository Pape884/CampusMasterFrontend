"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import MessagesPage from "@/components/messages/messagerie"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"
import { useState } from "react"

export default function Messagerie() {
    const { user } = useAuthContext();

    // Si pas d'utilisateur
    if (!user) {
        return <Unauthorized />;
    }



    return (
        <Layout userRole={user.role} title="Messagerie">
            <MessagesPage />
        </Layout>

    )
}