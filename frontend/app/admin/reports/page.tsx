"use client"

import { useState } from "react";
import AdminReports from "@/components/admin/admin-reports";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import Layout from "@/components/layout/Layout";
import { UserRole } from "@/components/layout/SidebarMenu";





export default function ReportsPage(){

  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderViews= () => {
    switch (userRole) {
        case "admin":
            return <AdminReports />
        case "teacher":
            return <TeacherDashboard />
        case "student":
            return <StudentDashboard />
        default:
            return null
    }
 }

  return (
       <Layout userRole={userRole} title="Rapports Administratifs">
            {renderViews()}
        </Layout>

  )
}