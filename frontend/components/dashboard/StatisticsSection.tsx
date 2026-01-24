// components/dashboard/StatisticsSection.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BarChart from "@/components/charts/BarChart"
import PieChart from "@/components/charts/PieChart"

const StatisticsSection = () => {
  const statsData = [
    { name: 'Jan', users: 400, orders: 240 },
    { name: 'Feb', users: 300, orders: 139 },
    { name: 'Mar', users: 500, orders: 380 },
    { name: 'Apr', users: 278, orders: 190 },
  ]

  const pieData = [
    { name: 'Admins', value: 4 },
    { name: 'Clients', value: 20 },
    { name: 'Visiteurs', value: 76 },
  ]

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Statistiques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle>Utilisateurs et Commandes Mensuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={statsData} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle>Répartition des Rôles des Utilisateurs</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={pieData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StatisticsSection