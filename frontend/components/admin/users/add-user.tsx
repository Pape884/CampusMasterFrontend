"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, UserPlus, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

type UserRole = "Étudiant" | "Enseignant" | "Administrateur"

export default function AddUser() {
  const [userRole, setUserRole] = useState<UserRole>("Étudiant")
  const [isActive, setIsActive] = useState(true)

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [permissions, setPermissions] = useState({
    gestionUtilisateurs: false,
    gestionDepartements: false,
    gestionCours: false,
  })

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const addDepartment = (dept: string) => {
    if (!selectedDepartments.includes(dept)) {
      setSelectedDepartments([...selectedDepartments, dept])
    }
  }

  const removeDepartment = (dept: string) => {
    setSelectedDepartments(selectedDepartments.filter((d) => d !== dept))
  }

  const addCourse = (course: string) => {
    if (!selectedCourses.includes(course)) {
      setSelectedCourses([...selectedCourses, course])
    }
  }

  const removeCourse = (course: string) => {
    setSelectedCourses(selectedCourses.filter((c) => c !== course))
  }

  const departementsList = [
    { value: "math", label: "Mathématiques" },
    { value: "sciences", label: "Sciences" },
    { value: "langues", label: "Langues" },
    { value: "histoire", label: "Histoire" },
    { value: "informatique", label: "Informatique" },
  ]

  const coursList = [
    { value: "math101", label: "Algèbre Linéaire" },
    { value: "math201", label: "Analyse Numérique" },
    { value: "phys101", label: "Physique Quantique" },
    { value: "info101", label: "Programmation Python" },
    { value: "lang101", label: "Anglais Avancé" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 mx-auto">
        <Link
          href="/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Nouvel utilisateur</h1>
            <p className="text-muted-foreground text-sm">Créez un nouveau compte utilisateur</p>
          </div>
          <div className="flex gap-3">
            <Link href="/">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" />
              Créer
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Rôle Selection */}
          <Card className="p-6">
            <Label className="text-sm font-medium mb-3 block">Rôle de l'utilisateur</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["Étudiant", "Enseignant", "Administrateur"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    userRole === role ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
                  }`}
                >
                  <div className="font-medium text-foreground">{role}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {role === "Étudiant" && "Accès aux cours"}
                    {role === "Enseignant" && "Gestion des cours"}
                    {role === "Administrateur" && "Accès complet"}
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Informations de base */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Informations de base</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prenom" className="text-sm mb-2 block">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input id="prenom" placeholder="Prénom" />
              </div>
              <div>
                <Label htmlFor="nom" className="text-sm mb-2 block">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input id="nom" placeholder="Nom" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-2 block">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input id="email" type="email" placeholder="email@exemple.fr" />
              </div>
              <div>
                <Label htmlFor="telephone" className="text-sm mb-2 block">
                  Téléphone
                </Label>
                <Input id="telephone" placeholder="+33 6 00 00 00 00" />
              </div>
              <div>
                <Label htmlFor="dateNaissance" className="text-sm mb-2 block">
                  Date de naissance
                </Label>
                <Input id="dateNaissance" type="date" />
              </div>
              <div>
                <Label htmlFor="motDePasse" className="text-sm mb-2 block">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <Input id="motDePasse" type="password" placeholder="Min. 8 caractères" />
              </div>
            </div>
          </Card>

          {/* Section conditionnelle par rôle */}
          {userRole === "Étudiant" && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Département</h2>
                <Select onValueChange={(value) => setSelectedDepartments([value])}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent>
                    {departementsList.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Cours à suivre</h2>
                <Select onValueChange={addCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter des cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursList
                      .filter((c) => !selectedCourses.includes(c.value))
                      .map((cours) => (
                        <SelectItem key={cours.value} value={cours.value}>
                          {cours.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedCourses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedCourses.map((courseVal) => {
                      const course = coursList.find((c) => c.value === courseVal)
                      return (
                        <Badge key={courseVal} variant="secondary" className="gap-2">
                          {course?.label}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeCourse(courseVal)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </Card>
            </>
          )}

          {userRole === "Enseignant" && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Départements</h2>
                <Select onValueChange={addDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter des départements" />
                  </SelectTrigger>
                  <SelectContent>
                    {departementsList
                      .filter((d) => !selectedDepartments.includes(d.value))
                      .map((dept) => (
                        <SelectItem key={dept.value} value={dept.value}>
                          {dept.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedDepartments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedDepartments.map((deptVal) => {
                      const dept = departementsList.find((d) => d.value === deptVal)
                      return (
                        <Badge key={deptVal} variant="secondary" className="gap-2">
                          {dept?.label}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeDepartment(deptVal)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Cours à enseigner</h2>
                <Select onValueChange={addCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ajouter des cours" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursList
                      .filter((c) => !selectedCourses.includes(c.value))
                      .map((cours) => (
                        <SelectItem key={cours.value} value={cours.value}>
                          {cours.label}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedCourses.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedCourses.map((courseVal) => {
                      const course = coursList.find((c) => c.value === courseVal)
                      return (
                        <Badge key={courseVal} variant="secondary" className="gap-2">
                          {course?.label}
                          <X
                            className="h-3 w-3 cursor-pointer hover:text-red-500"
                            onClick={() => removeCourse(courseVal)}
                          />
                        </Badge>
                      )
                    })}
                  </div>
                )}
              </Card>
            </>
          )}

          {userRole === "Administrateur" && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">Permissions</h2>
              <div className="space-y-3">
                {Object.entries(permissions).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <Label className="text-sm cursor-pointer">
                      {key === "gestionUtilisateurs" && "Gestion des utilisateurs"}
                      {key === "gestionDepartements" && "Gestion des départements"}
                      {key === "gestionCours" && "Gestion des cours"}
                    </Label>
                    <Switch checked={value} onCheckedChange={() => togglePermission(key as keyof typeof permissions)} />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Statut */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Compte actif</Label>
                <p className="text-xs text-muted-foreground mt-1">Activer le compte immédiatement</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
