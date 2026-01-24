"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Shield, GraduationCap, BookOpen } from "lucide-react"

export function StatsCards() {
  // Données fictives pour la démo
  const stats = [
    {
      title: "Total Utilisateurs",
      value: "1,248",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Administrateurs",
      value: "24",
      icon: Shield,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      gradient: "from-purple-500 to-purple-600",

    },
    {
      title: "Enseignants",
      value: "186",
      icon: BookOpen,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Étudiants",
      value: "1,038",
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border/40">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
