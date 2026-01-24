"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import StudentCourseDetailPage from "@/components/student/courses/cours-detail"
import { useState } from "react"

export default function StudentCoursDetail() {
    const [userRole] = useState<UserRole>("student") // Changez cette valeur pour tester différents rôles


  return (
       <Layout userRole={userRole} title="Mes Cours">
            <StudentCourseDetailPage />
        </Layout>
  )
}