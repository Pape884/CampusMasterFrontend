"use client"

import { Card } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { mois: "Jan", taux: 82 },
  { mois: "Fév", taux: 85 },
  { mois: "Mar", taux: 83 },
  { mois: "Avr", taux: 87 },
  { mois: "Mai", taux: 89 },
  { mois: "Jun", taux: 88 },
  { mois: "Jul", taux: 90 },
  { mois: "Aoû", taux: 88 },
  { mois: "Sep", taux: 86 },
  { mois: "Oct", taux: 89 },
  { mois: "Nov", taux: 91 },
  { mois: "Déc", taux: 88 },
]

export function PerformanceOverview() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Performance académique</h3>
            <p className="text-sm text-muted-foreground">Taux de réussite moyen sur l'année</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">88%</p>
            <p className="text-xs text-green-600">+3.2% vs année dernière</p>
          </div>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTaux" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mois" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[75, 95]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="taux"
                stroke="#ec4899"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTaux)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  )
}
