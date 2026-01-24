"use client"

import AddUser from "@/components/admin/users/add-user"
import Layout from "@/components/layout/Layout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"

export default function addUserPage() {

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
    <Layout userRole={user.role} title="Gestion des utilisateurs">
      <AddUser />
    </Layout>

  )
}