// components/layout/Header.tsx
"use client"

import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  userRole: "admin" | "teacher" | "student"
  initial: string
  title: string
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

const Header = ({ userRole, initial, title, onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "admin":
        return "Bienvenue sur votre interface administrateur"
      case "teacher":
        return "Gérez vos cours et suivez vos étudiants"
      case "student":
        return "Continuez votre parcours d'apprentissage"
      default:
        return ""
    }
  }

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        {onToggleSidebar && (
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{title}</h1>
          <p className="text-gray-600">{getWelcomeMessage()}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <Avatar>
          <AvatarFallback className="bg-primary text-white">{initial}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default Header