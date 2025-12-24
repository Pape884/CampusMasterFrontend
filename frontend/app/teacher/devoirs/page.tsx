"use client"
import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import ListDevoirPage from "@/components/teacher/devoir/list-devoir"

export default function DevoirsPage(){
  const userRole: UserRole = "teacher" // Changez cette valeur pour tester différents rôles
  
  return (
      <Layout userRole={userRole} title="Gestion des Devoirs">
            <ListDevoirPage />
      </Layout>
    )
}