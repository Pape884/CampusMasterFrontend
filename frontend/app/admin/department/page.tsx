"use client"

import { useState } from "react"
import StudentDashboard from "@/components/dashboard/StudentDashboard"
import TeacherDashboard from "@/components/dashboard/TeacherDashboard"
import { UserRole } from "@/components/layout/SidebarMenu"
import DepartemantList from "@/components/admin/departement/departementList"
import Layout from "@/components/layout/Layout"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import Unauthorized from "@/components/ui/Unauthorized"
import { useAuthContext } from "@/context/authContext"

export default function DepartmentPage(){
  const { user } = useAuthContext();
      
      // Si pas d'utilisateur
      if (!user) {
        return <Unauthorized />;
      }

  return (
       <Layout userRole={user.role} title="Gestions des Départements">
            <DepartemantList />
        </Layout>

  )
}