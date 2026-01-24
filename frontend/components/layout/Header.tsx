"use client"

import { Bell, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HeaderProps {
  userRole: "ADMIN" | "TEACHER" | "STUDENT"
  initial: string
  title: string
  onToggleSidebar?: () => void
  sidebarOpen?: boolean
}

const Header = ({ userRole, initial, title, onToggleSidebar, sidebarOpen }: HeaderProps) => {
  const getWelcomeMessage = () => {
    switch (userRole) {
      case "ADMIN":
        return "Bienvenue sur votre interface administrateur"
      case "TEACHER":
        return "Gérez vos cours et suivez vos étudiants"
      case "STUDENT":
        return "Continuez votre parcours d'apprentissage"
      default:
        return ""
    }
  }

  return (
    <header
      className="
        sticky top-0 z-40
        -mx-8 mb-8
        px-8 py-4
        backdrop-blur supports-[backdrop-filter]:bg-background/70
        bg-background/90
        border-b border-border
      "
    >
      <div className="flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggleSidebar}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          )}

          <div>
            <h1 className="text-2xl font-semibold text-foreground leading-tight">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {getWelcomeMessage()}
            </p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-destructive" />
          </Button>

          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {initial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}

export default Header
