"use client"

import { UserRole } from "@/components/layout/SidebarMenu"
import Layout from "@/components/layout/Layout"
import { useState } from "react"  
import CourseDetailsPage from "@/components/teacher/courses/course-detail"

export default function EditCourses() {
  const [userRole] = useState<UserRole>("teacher") // Changez cette valeur pour tester différents rôles
    const renderViews= () => {
        switch (userRole) {
            case "admin":
                return null
            case "teacher":
                return <CourseDetailsPage/>
            case "student":
                return null
            default:
                return null
        }
    }

    return (
        <Layout userRole={userRole} title="Gestions des Cours">
                {renderViews()}
        </Layout>

    )
}