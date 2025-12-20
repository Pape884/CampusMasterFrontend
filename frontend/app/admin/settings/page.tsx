"use client"

import { useState } from "react";
import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import AdminLayout from "@/components/layout/AdminLayout";
import { UserRole } from "@/components/layout/SidebarMenu";
import AdminSettings from "@/components/admin/settings/settings";


export default function SettingsPage(){

  const [userRole] = useState<UserRole>("admin") // Changez cette valeur pour tester différents rôles
  const renderViews= () => {
    switch (userRole) {
        case "admin":
            return <AdminSettings />
        case "teacher":
            return <TeacherDashboard />
        case "student":
            return <StudentDashboard />
        default:
            return null
    }
 }

  return (
       <AdminLayout userRole={userRole} title="Paramètres Système">
            {renderViews()}
        </AdminLayout>

  )
}