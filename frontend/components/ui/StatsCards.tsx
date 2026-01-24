// components/ui/StatsCards.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCard {
  title: string
  value: string
  icon: LucideIcon
  description?: string
  gradient: string
}

interface StatsCardsProps {
  stats: StatCard[]
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className={`border-none shadow-lg bg-gradient-to-br ${stat.gradient} text-white`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium opacity-80">{stat.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{stat.value || 0}</div>
              <stat.icon className="w-8 h-8 opacity-80" />
            </div>
            <p className="text-xs opacity-80 mt-2">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default StatsCards