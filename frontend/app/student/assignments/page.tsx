"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import StudentAssignmentsPage from "@/components/student/devoirs/list-devoir"
import { useState } from "react"

export default function StudentAssignments() {
     const [userRole] = useState<UserRole>("student") // Changez cette valeur pour tester différents rôles


  return (
       <Layout userRole={userRole} title="Mes Cours">
            <StudentAssignmentsPage />
        </Layout>
  )
}