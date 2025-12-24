"use client"
import Layout from "@/components/layout/Layout"
import AdminLayout from "@/components/layout/Layout"
import { UserRole } from "@/components/layout/SidebarMenu"
import TeacherCoursesPage from "@/components/teacher/courses/courses-list"
import { useState } from "react"


export default function TeacherCourses() {
    const [userRole] = useState<UserRole>("teacher") // Changez cette valeur pour tester différents rôles
    const renderViews= () => {
        switch (userRole) {
            case "admin":
                return null
            case "teacher":
                return <TeacherCoursesPage/>
            case "student":
                return null
            default:
                return null
        }
    }

    return (
        <Layout userRole={userRole} title="Gestions des Cours Affectés">
                {renderViews()}
        </Layout>

    )
}