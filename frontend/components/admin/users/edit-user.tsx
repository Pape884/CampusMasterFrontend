"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { UserRole, UserUpdateDto } from "@/lib/api/services"
import { useParams } from "next/navigation"
import { userService } from "@/lib/api/services/user.service"
import { toast } from "sonner"


export default function EditUserPage() {
  const [userRole, setUserRole] = useState<UserRole>()
  const [isActive, setIsActive] = useState(true)
  const [loading, setLoading] = useState(true)
  const [prenom, setPrenom] = useState("")
  const [nom, setNom] = useState("")
  const [email, setEmail] = useState("")
  const [telephone, setTelephone] = useState("")

  const [selectedDepartments, setSelectedDepartments] = useState<string[]>(["math", "informatique"])
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["math101", "math201"])
  const [permissions, setPermissions] = useState({
    gestionUtilisateurs: true,
    gestionDepartements: true,
    gestionCours: true,
  })

  const params = useParams()
  const userId = params.id as string

  useEffect(() => {
    async function fetchUser() {
      try {
        const data = await userService.getUserById(userId)

        setPrenom(data.prenom ?? "")
        setNom(data.nom ?? "")
        setEmail(data.email ?? "")
        setTelephone(data.telephone ?? "")
        setUserRole(data.role)
        setIsActive(data.isActive ?? true)

        // si étudiant / enseignant
        setSelectedDepartments(data.departements ?? [])
        setSelectedCourses(data.courses ?? [])
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [userId])

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

  const handleSave = async () => {
    const payload: UserUpdateDto = {
      prenom,
      nom,
      email,
      telephone,
      role: userRole
    }

    try {
      await userService.updateUser(userId, payload)
      toast.success("Utilisateur mis à jour")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour")
    }
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

  if (loading) {
    return <div className="p-8">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 mx-auto">
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Modifier l'utilisateur</h1>
            <p className="text-muted-foreground text-sm">Mettez à jour les informations</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/users">
              <Button variant="outline">Annuler</Button>
            </Link>
            <Button className="gap-2">
              <Save className="h-4 w-4" />
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Rôle Selection */}
          <Card className="p-6">
            <Label className="text-sm font-medium mb-3 block">Rôle de l'utilisateur</Label>
            <div className="grid grid-cols-3 gap-3">
              {(["STUDENT", "TEACHER", "ADMIN"] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => setUserRole(role)}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${userRole === role ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-card"
                    }`}
                >
                  <div className="font-medium text-foreground">{role}</div>
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
                  Prénom
                </Label>
                <Input id="prenom" defaultValue="Marie" />
              </div>
              <div>
                <Label htmlFor="nom" className="text-sm mb-2 block">
                  Nom
                </Label>
                <Input id="nom" defaultValue="Dupont" />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm mb-2 block">
                  Email
                </Label>
                <Input id="email" type="email" defaultValue="marie.dupont@universite.fr" />
              </div>
              <div>
                <Label htmlFor="telephone" className="text-sm mb-2 block">
                  Téléphone
                </Label>
                <Input id="telephone" defaultValue="+33 6 12 34 56 78" />
              </div>
              <div>
                <Label htmlFor="matricule" className="text-sm mb-2 block">
                  Matricule
                </Label>
                <Input id="matricule" defaultValue="ENS-12345" disabled className="bg-muted" />
              </div>
              <div>
                <Label htmlFor="dateNaissance" className="text-sm mb-2 block">
                  Date de naissance
                </Label>
                <Input id="dateNaissance" type="date" defaultValue="2002-03-15" />
              </div>
            </div>
          </Card>

          {/* Section conditionnelle par rôle */}
          {userRole === "STUDENT" && (
            <>
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">Département</h2>
                <Select
                  defaultValue={selectedDepartments[0]}
                  onValueChange={(value) => setSelectedDepartments([value])}
                >
                  <SelectTrigger>
                    <SelectValue />
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
                <h2 className="text-lg font-semibold text-foreground mb-4">Cours suivis</h2>
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

          {userRole === "TEACHER" && (
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
                <h2 className="text-lg font-semibold text-foreground mb-4">Cours enseignés</h2>
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

          {userRole === "ADMIN" && (
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
                <Label className="text-sm font-medium">Statut du compte</Label>
                <p className="text-xs text-muted-foreground mt-1">Activer ou désactiver ce compte</p>
              </div>
              <Switch checked={isActive} onCheckedChange={setIsActive} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
