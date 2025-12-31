"use client"
import React from "react"
import {
  Home,
  Users,
  BookOpen,
  Settings,
  FileText,
  Calendar,
  Award,
  LogOut,
  GraduationCap,
  User,
  MessageCircle,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import ThemeToggle from "@/components/ThemeToggle"

export type UserRole = "admin" | "teacher" | "student"

interface SidebarMenuProps {
  userRole: UserRole
  title: string
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

const menuItems: Record<UserRole, { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
    admin: [
      { label: "Tableau de bord", href: "/dashboard", icon: Home },
      { label: "Utilisateurs", href: "/admin/users", icon: Users},
      { label: "Départements", href: "/admin/department", icon: Users },
      { label: "Rapports", href: "/admin/reports", icon: FileText },
      { label: "Messagerie", href: "/messages", icon: MessageCircle },
      { label: "Calendrier", href: "/admin/calendar", icon: Calendar },
      { label: "Paramètres", href: "/admin/settings", icon: Settings },
    ],
    teacher: [
      { label: "Tableau de bord", href: "/dashboard", icon: Home },
      { label: "Mes Cours", href: "/teacher/courses", icon: BookOpen },
      { label: "Devoirs", href: "/teacher/devoirs", icon: FileText },
      { label: "Mes Étudiants", href: "/teacher/students", icon: Users },
      { label: "Messagerie", href: "/messages", icon: MessageCircle },
      { label: "Profile", href: "/profile", icon: User },
    ],
    student: [
      { label: "Tableau de bord", href: "/dashboard", icon: Home },
      { label: "Mes Cours", href: "/student/courses", icon: BookOpen },
      { label: "Mes Devoirs", href: "/student/assignments", icon: FileText },
      { label: "Mes Notes", href: "/student/notes", icon: Award },
      { label: "Messagerie", href: "/messages", icon: MessageCircle },
      { label: "Profile", href: "/profile", icon: User },
    ],
  } 


const SidebarMenu = ({ userRole, title }: SidebarMenuProps) => {
  const pathname = usePathname()

  


  return (
    <aside className="w-64 fixed h-screen flex flex-col border-r
      bg-white dark:bg-background
      border-gray-200 dark:border-border
      p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <GraduationCap className="w-6 h-6 text-primary-foreground" />
        </div>
        <span className="font-bold text-xl text-foreground">{title}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems[userRole].map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="pt-6 border-t border-border">
        <ThemeToggle />
      </div>

      <div className="mt-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="w-5 h-5" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}

export default SidebarMenu
