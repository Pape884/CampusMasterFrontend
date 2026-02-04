"use client"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import ListDevoirPage from "@/components/teacher/devoir/list-devoir"
import Unauthorized from "@/components/ui/Unauthorized";
import { useAuthContext } from "@/context/authContext";

export default function DevoirsPage() {
  const { user } = useAuthContext();

  // Si pas d'utilisateur
  if (!user) {
    return <Unauthorized />;
  }

  return (
    <Layout userRole={user.role} title="Gestion des Devoirs">
      <ListDevoirPage />
    </Layout>
  )
}