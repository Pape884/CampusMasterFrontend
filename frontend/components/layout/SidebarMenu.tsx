// components/layout/SidebarMenu.tsx
"use client"

import { Home, Users, BookOpen, BarChart3, Settings, FileText, Calendar, Award, LogOut, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"

export type UserRole = "admin" | "teacher" | "student"

interface SidebarMenuProps {
  userRole: UserRole
  title: string
}

export const menuItems = {
  admin: [
    { icon: Home, label: "Tableau de bord", href: "/dashboard" },
    { icon: Users, label: "Utilisateurs", href: "/dashboard/users" },
    { icon: BookOpen, label: "Departements", href: "/dashboard/departement" },
    { icon: BarChart3, label: "Statistiques", href: "/dashboard/reports" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  ],
  teacher: [
    { icon: Home, label: "Tableau de bord", href: "/dashboard" },
    { icon: BookOpen, label: "Mes Cours", href: "/dashboard/courses" },
    { icon: FileText, label: "Devoirs", href: "/dashboard/assignments" },
    { icon: Users, label: "Étudiants", href: "/dashboard/students" },
    { icon: Calendar, label: "Calendrier", href: "/dashboard/calendar" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  ],
  student: [
    { icon: Home, label: "Tableau de bord", href: "/dashboard" },
    { icon: BookOpen, label: "Mes Cours", href: "/dashboard/courses" },
    { icon: FileText, label: "Devoirs", href: "/dashboard/assignments" },
    { icon: Award, label: "Notes", href: "/dashboard/grades" },
    { icon: Calendar, label: "Calendrier", href: "/dashboard/calendar" },
    { icon: Settings, label: "Paramètres", href: "/dashboard/settings" },
  ],
}

export const roleConfig = {
  admin: {
    title: "LMS Admin",
    color: "blue",
    gradient: "from-blue-50 via-indigo-50 to-purple-50",
    initial: "AD",
  },
  teacher: {
    title: "LMS Enseignant",
    color: "green",
    gradient: "from-green-50 via-emerald-50 to-teal-50",
    initial: "EN",
  },
  student: {
    title: "LMS Étudiant",
    color: "purple",
    gradient: "from-purple-50 via-violet-50 to-fuchsia-50",
    initial: "ET",
  },
}

const SidebarMenu = ({ userRole, title }: SidebarMenuProps) => {
  const config = roleConfig[userRole]

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col fixed h-screen">
      {/* En-tête fixe */}
      <div className="flex items-center gap-2 mb-8 flex-shrink-0">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <span className="font-bold text-xl">{title}</span>
      </div>

      {/* Navigation avec défilement */}
      <nav className="flex-1 space-y-2 overflow-y-auto">
        {menuItems[userRole].map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              index === 0 ? "bg-primary/10 text-primary font-medium" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Pied de page fixe */}
      <div className="pt-6 border-t border-gray-200 flex-shrink-0">
        <ThemeToggle />
      </div>

      <div className="mt-6 flex-shrink-0">
        <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700">
          Déconnexion
          <LogOut className="w-5 h-5" />
        </Button>
      </div>
    </aside>
  )
}

export default SidebarMenu