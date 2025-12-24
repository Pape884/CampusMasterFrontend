"use client"

import { UserRole } from "@/components/layout/SidebarMenu"
import Layout from "@/components/layout/Layout"
import AvancementDevoirPage from "@/components/teacher/devoir/avancement"


export default function GradeDevoirPage() {
    const userRole: UserRole = "teacher" // Changez cette valeur pour tester différents rôles
  
    return (
        <Layout userRole={userRole} title="Gestion des utilisateurs">
              <AvancementDevoirPage />
        </Layout>
      )
  }