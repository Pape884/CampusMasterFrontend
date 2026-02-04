"use client"
import Layout from "@/components/layout/Layout"
import TeacherCoursesPage from "@/components/teacher/courses/courses-list"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"


export default function TeacherCourses() {
     const { user } = useAuthContext();
          
          // Si pas d'utilisateur
          if (!user) {
            return <Unauthorized />;
          }

    return (
        <Layout userRole={user.role} title="Gestions des Cours Affectés">
                <TeacherCoursesPage/>
        </Layout>

    )
}