"use client"

import { Building2, Users, GraduationCap, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/ui/StatsCards"
import Link from "next/link"

const departments = [
  {
    name: "Département de Mathématiques",
    director: "Dr. Marie Dubois",
    performance: 92,
    teachers: 12,
    students: 245,
    modules: 28,
    budget: "450,000 €",
  },
  {
    name: "Département des Sciences",
    director: "Dr. Sophie Laurent",
    performance: 88,
    teachers: 15,
    students: 320,
    modules: 35,
    budget: "580,000 €",
  },
  {
    name: "Département des Langues",
    director: "Dr. Thomas Petit",
    performance: 85,
    teachers: 10,
    students: 290,
    modules: 42,
    budget: "380,000 €",
  },
  {
    name: "Département d'Histoire",
    director: "Dr. Julie Martin",
    performance: 90,
    teachers: 8,
    students: 180,
    courses: 20,
    budget: "320,000 €",
  },
]

const stats = [
  {
    title: "Total Départements",
    value: "12",
    icon: Building2,
    description: "+3 ce mois",
    gradient: "from-indigo-500 to-indigo-600",
  },
  {
    title: "Total Enseignants",
    value: "150",
    icon: Users,
    description: "+10 nouveaux",
    gradient: "from-green-500 to-green-600",
  },
  {
    title: "Total Étudiants",
    value: "1,035",
    icon: GraduationCap,
    description: "+50 nouveaux",
    gradient: "from-purple-500 to-purple-600",
  },
  {
    title: "Total Cours",
    value: "125",
    icon: BookOpen,
    description: "+8 ce mois",
    gradient: "from-yellow-500 to-yellow-600",
  },
]

export default function DepartmentCards() {
  return (
    <>
      <StatsCard stats={stats} />
      {/* bouton pour ajouter un departement */}
      <div className="mb-6">
        
        <Button variant="default" className="bg-foreground text-background hover:bg-foreground/90">
          <Link href="/admin/department/add">
            Ajouter un Département
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departments.map((dept, index) => (
          <Card key={index} className="p-6 border border-border bg-card">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>
                  <p className="text-sm text-muted-foreground">Dirigé par {dept.director}</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-foreground">
                {dept.performance}%
              </span>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <Users className="h-5 w-5 text-green-600 mb-2" />
                <p className="text-2xl font-bold text-foreground">{dept.teachers}</p>
                <p className="text-xs text-muted-foreground">Enseignants</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <GraduationCap className="h-5 w-5 text-purple-600 mb-2" />
                <p className="text-2xl font-bold text-foreground">{dept.students}</p>
                <p className="text-xs text-muted-foreground">Étudiants</p>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                <BookOpen className="h-5 w-5 text-blue-600 mb-2" />
                <p className="text-2xl font-bold text-foreground">{dept.modules}</p>
                <p className="text-xs text-muted-foreground">Modules</p>
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">Budget annuel</span>
              <span className="text-lg font-semibold text-foreground">{dept.budget}</span>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Link href={`/admin/department/${index + 1}`}>
                <Button variant="outline" className="w-full bg-transparent">
                  Voir détails
                </Button>
              </Link>
              <Link href={`/admin/department/${index + 1}/edit`} >
                <Button className="w-full bg-foreground text-background hover:bg-foreground/90">Modifier</Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
