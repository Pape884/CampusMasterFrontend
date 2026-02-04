"use client"
import CourseChaptersPage from "@/components/teacher/courses/chapitre-course";
import Unauthorized from "@/components/ui/Unauthorized";
import { useAuthContext } from "@/context/authContext";
import Layout from "@/components/layout/Layout";


export default function ChapterPage() {

    const { user } = useAuthContext();

    // Si pas d'utilisateur
    if (!user) {
        return <Unauthorized />;
    }

    return (
        <Layout userRole={user.role} title="Gestions des Cours Affectés">
            <CourseChaptersPage />
        </Layout>

    )
}