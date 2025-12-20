import { Card } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, TrendingUp, Building2, UserCheck } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      title: "Utilisateurs totaux",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500/10 text-blue-500",
    },
    {
      title: "Étudiants",
      value: "985",
      change: "+8.2%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-purple-500/10 text-purple-500",
    },
    {
      title: "Enseignants",
      value: "51",
      change: "+5.1%",
      trend: "up",
      icon: UserCheck,
      color: "bg-green-500/10 text-green-500",
    },
    {
      title: "Départements",
      value: "5",
      change: "0%",
      trend: "neutral",
      icon: Building2,
      color: "bg-orange-500/10 text-orange-500",
    },
    {
      title: "Cours actifs",
      value: "143",
      change: "+15.3%",
      trend: "up",
      icon: BookOpen,
      color: "bg-cyan-500/10 text-cyan-500",
    },
    {
      title: "Performance moy.",
      value: "88%",
      change: "+3.2%",
      trend: "up",
      icon: TrendingUp,
      color: "bg-pink-500/10 text-pink-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-600"
                          : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-muted-foreground">vs mois dernier</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
