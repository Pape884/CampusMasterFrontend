"use client"

import { useState } from "react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/components/layout/SidebarMenu";
import AdminSettings from "@/components/admin/settings/settings";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Unauthorized from "@/components/ui/Unauthorized";
import { useAuthContext } from "@/context/authContext";


export default function SettingsPage() {
    const { user, isLoading } = useAuthContext();
    // Pendant le chargement
    if (isLoading) {
        return <LoadingSpinner message="Chargement des données..." />;
    }

    // Si pas d'utilisateur
    if (!user) {
        return <Unauthorized />;
    }

    return (
        <Layout userRole={user.role} title="Paramètres Système">
            <AdminSettings />
        </Layout>

    )
}