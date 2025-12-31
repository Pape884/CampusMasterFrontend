"use client"

import Layout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import StudentCoursesPage from "@/components/student/courses/cours-list"
import { useState } from "react"

export default function StudentCourses() {
    const [userRole] = useState<UserRole>("student") // Changez cette valeur pour tester différents rôles


  return (
       <Layout userRole={userRole} title="Mes Cours">
            <StudentCoursesPage />
        </Layout>
  )
}