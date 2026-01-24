"use client"

import AdminReports from "@/components/admin/admin-reports";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/components/layout/SidebarMenu";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Unauthorized from "@/components/ui/Unauthorized";
import { useAuthContext } from "@/context/authContext";


export default function ReportsPage() {

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
        <Layout userRole={user.role} title="Rapports Administratifs">
            <AdminReports />
        </Layout>

    )
}