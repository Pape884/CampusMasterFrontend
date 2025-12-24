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
    <div className={`flex min-h-screen bg-gradient-to-br ${config.gradient}`}>
      {/* Menu fixe */}
      <div className="fixed h-full z-50">
        <SidebarMenu userRole={userRole} title={config.title} />
      </div>
      
      {/* Contenu principal avec marge */}
      <main className="flex-1 p-8 ml-64">
        <Header userRole={userRole} initial={config.initial} title={title} />
        {children}
      </main>
    </div>
  )
}

export default Layout