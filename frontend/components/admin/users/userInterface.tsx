"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, MoreVertical, Eye, Edit, Trash2, UserPlus, BookOpen, GraduationCap, Shield, Users } from "lucide-react"
import StatsCard from "@/components/ui/StatsCards"

type UserRole = "admin" | "enseignant" | "etudiant"
type UserStatus = "actif" | "inactif"

interface User {
  id: string
  matricule: string
  nom: string
  prenom: string
  email: string
  role: UserRole
  status: UserStatus
}

// Données fictives pour la démo
const mockUsers: User[] = [
  {
    id: "1",
    matricule: "ADM001",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@school.fr",
    role: "admin",
    status: "actif",
  },
  {
    id: "2",
    matricule: "ENS042",
    nom: "Martin",
    prenom: "Pierre",
    email: "pierre.martin@school.fr",
    role: "enseignant",
    status: "actif",
  },
  {
    id: "3",
    matricule: "ETU1523",
    nom: "Bernard",
    prenom: "Sophie",
    email: "sophie.bernard@student.fr",
    role: "etudiant",
    status: "actif",
  },
  {
    id: "4",
    matricule: "ETU1524",
    nom: "Dubois",
    prenom: "Lucas",
    email: "lucas.dubois@student.fr",
    role: "etudiant",
    status: "inactif",
  },
  {
    id: "5",
    matricule: "ENS043",
    nom: "Petit",
    prenom: "Julie",
    email: "julie.petit@school.fr",
    role: "enseignant",
    status: "actif",
  },
  {
    id: "6",
    matricule: "ETU1525",
    nom: "Moreau",
    prenom: "Thomas",
    email: "thomas.moreau@student.fr",
    role: "etudiant",
    status: "actif",
  },
]

export function UsersTable() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("tous")
  const [statusFilter, setStatusFilter] = useState<string>("tous")

  const getRoleBadge = (role: UserRole) => {
    const variants = {
      admin: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      enseignant: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      etudiant: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    }
    const labels = {
      admin: "Administrateur",
      enseignant: "Enseignant",
      etudiant: "Étudiant",
    }
    return { variant: variants[role], label: labels[role] }
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: user.status === "actif" ? "inactif" : "actif" } : user,
      ),
    )
  }

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.prenom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.matricule.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesRole = roleFilter === "tous" || user.role === roleFilter
    const matchesStatus = statusFilter === "tous" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = [
      {
        title: "Total Utilisateurs",
        value: "1,248",
        icon: Users,
        description: "+12% ce mois",
        gradient: "from-blue-500 to-blue-600",
      },
      {
        title: "Administrateurs",
        value: "24",
        icon: Shield,
        description: "+2 nouveaux",
        gradient: "from-purple-500 to-purple-600",

      },
      {
        title: "Enseignants",
        value: "186",
        icon: BookOpen,
        description: "+5 nouveaux",
        gradient: "from-green-500 to-green-600",
      },
      {
        title: "Étudiants",
        value: "1,038",
        icon: GraduationCap,
        description: "+15 nouveaux",
        gradient: "from-orange-500 to-orange-600",
      },
    ]

  return (
    <>
    <StatsCard stats={stats} />
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Barre de recherche et filtres */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, prénom ou matricule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les rôles</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="enseignant">Enseignant</SelectItem>
                  <SelectItem value="etudiant">Étudiant</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tous">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>

              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Tableau */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matricule</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prénom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Aucun utilisateur trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role)
                    return (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-sm">{user.matricule}</TableCell>
                        <TableCell className="font-medium">{user.nom}</TableCell>
                        <TableCell>{user.prenom}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge className={roleBadge.variant}>{roleBadge.label}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === "actif"}
                              onCheckedChange={() => toggleUserStatus(user.id)}
                            />
                            <span
                              className={`text-sm ${user.status === "actif" ? "text-green-500" : "text-muted-foreground"}`}
                            >
                              {user.status === "actif" ? "Actif" : "Inactif"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Détails
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Résultats */}
          <div className="text-sm text-muted-foreground">
            Affichage de {filteredUsers.length} sur {users.length} utilisateurs
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
