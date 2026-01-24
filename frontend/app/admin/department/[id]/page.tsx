"use client"
import DepartmentDetailsPage from "@/components/admin/departement/department-detail"
import Layout from "@/components/layout/Layout"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"
import { useParams } from "next/navigation"


export default function DepartmentDetail() {

    const params = useParams()
    const id = {id: params.id as string}
    const { user } = useAuthContext();
          

          
    // Si pas d'utilisateur
    if (!user) {
    return <Unauthorized />;
    }
    

    return (
        <Layout userRole={user.role} title="Gestion des Départements">
            <DepartmentDetailsPage params={id} />
        </Layout>

    )
}