"use client"

import SidebarMenu, { roleConfig, UserRole } from "./SidebarMenu"
import Header from "./Header"
import { withAuth } from "@/context/authContext"

interface LayoutProps {
  children: React.ReactNode
  userRole: string
  title: string
}

const Layout = ({ children, userRole, title }: LayoutProps) => {
  const normalizedRole = userRole?.toUpperCase() as UserRole
  const config = roleConfig[normalizedRole]

  return (
    <div
      className={`
        flex min-h-screen
        bg-gradient-to-br
        ${config?.gradient ?? ""}
        dark:from-background dark:via-background dark:to-background
        text-foreground
      `}
    >
      <div className="fixed h-full z-50">
        <SidebarMenu userRole={normalizedRole} title={config?.title ?? ""} />
      </div>

      <main className="flex-1 ml-64 p-8 bg-background/80 dark:bg-background">
        <Header
          userRole={normalizedRole}
          initial={config?.initial ?? ""}
          title={title}
        />
        {children}
      </main>
    </div>
  )
}

export default withAuth(Layout)
