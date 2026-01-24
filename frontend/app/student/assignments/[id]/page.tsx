"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import AssignmentDetailsPage from "@/components/student/devoirs/devoir-detail"
import { useState } from "react"

export default function StudentAssignments() {
     const [userRole] = useState<UserRole>("student") // Changez cette valeur pour tester différents rôles
    const params = { id: "1" } // Remplacez par la récupération réelle des paramètres

  return (
       <Layout userRole={userRole} title="Mes Cours">
            <AssignmentDetailsPage params={params} />
        </Layout>
  )
}