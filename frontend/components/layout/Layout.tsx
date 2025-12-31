"use client"

import SidebarMenu, { roleConfig, UserRole } from "./SidebarMenu"
import Header from "./Header"

interface LayoutProps {
  children: React.ReactNode
  userRole: UserRole
  title: string
}

const Layout = ({ children, userRole, title }: LayoutProps) => {
  const config = roleConfig[userRole]

  return (
    <div
      className={`
        flex min-h-screen
        bg-gradient-to-br
        ${config.gradient}
        dark:from-background dark:via-background dark:to-background
        text-foreground
      `}
    >
      {/* Sidebar */}
      <div className="fixed h-full z-50">
        <SidebarMenu userRole={userRole} title={config.title} />
      </div>

      {/* Main */}
      <main className="flex-1 ml-64 p-8 bg-background/80 dark:bg-background">
        <Header userRole={userRole} initial={config.initial} title={title} />
        {children}
      </main>
    </div>
  )
}

export default Layout
