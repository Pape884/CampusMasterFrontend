"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  UserPlus, 
  BookOpen, 
  GraduationCap, 
  Shield, 
  Users,
  Loader2,
  AlertCircle,
  RefreshCw
} from "lucide-react"
import StatsCard from "@/components/ui/StatsCards"
import Link from "next/link"
import { useUsersQuery } from "@/lib/hooks/useUsersQuery"
import { userService } from "@/lib/api/services/user.service"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserRole, UserStatus, User } from "@/lib/api/services"

export function UsersTable() {
  const router = useRouter()
  
  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("tous")
  const [statusFilter, setStatusFilter] = useState<string>("tous")
  const [page, setPage] = useState(0)
  const limit = 10

  // Utiliser le hook pour récupérer les utilisateurs
  const {
    data: usersData,
    isLoading,
    isRefreshing,
    error,
    refetch,
    invalidateAndRefetch,
  } = useUsersQuery({
    search: searchQuery || undefined,
    role: roleFilter !== "tous" ? roleFilter as UserRole : "all",
    status: statusFilter !== "tous" ? statusFilter as UserStatus : "all",
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    enabled: true,
    onSuccess: (data) => {
      console.log(`✅ ${data.data.length} utilisateurs chargés (page ${data.pagination.page})`)
    },
    onError: (error) => {
      toast.error("Erreur de chargement", {
        description: error.message
      })
    }
  })

  // Fonction pour changer le statut d'un utilisateur
  const toggleUserStatus = async (userId: string, currentStatus: UserStatus) => {
    try {
      await userService.toggleUserStatus(userId, currentStatus)
      
      toast.success("Statut mis à jour", {
        description: "Le statut de l'utilisateur a été modifié avec succès"
      })
      
      // Recharger les données
      await refetch()
      
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible de modifier le statut"
      })
    }
  }

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${userName}" ? Cette action est irréversible.`)) {
      return
    }

    try {
      await userService.deleteUser(userId)
      
      toast.success("Utilisateur supprimé", {
        description: "L'utilisateur a été supprimé avec succès"
      })
      
      // Recharger les données
      await refetch()
      
    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible de supprimer l'utilisateur"
      })
    }
  }

  // Fonction pour formater le badge de rôle
  const getRoleBadge = (role: UserRole) => {
    const variants = {
      ADMIN: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
      TEACHER: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
      STUDENT: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
    }
    const labels = {
      ADMIN: "Administrateur",
      TEACHER: "Enseignant",
      STUDENT: "Étudiant",
    }
    return { variant: variants[role], label: labels[role] }
  }

  // Gérer le changement de recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        setPage(1) // Réinitialiser à la première page lors d'une nouvelle recherche
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Statistiques
  const stats = [
    {
      title: "Total Utilisateurs",
      value: usersData?.stats?.totalUsers?.toString() || "0",
      icon: Users,
      description: "+12% ce mois",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      title: "Administrateurs",
      value: usersData?.stats?.adminsCount?.toString() || "0",
      icon: Shield,
      description: "+2 nouveaux",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Enseignants",
      value: usersData?.stats?.teachersCount?.toString() || "0",
      icon: BookOpen,
      description: "+5 nouveaux",
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Étudiants",
      value: usersData?.stats?.studentsCount?.toString() || "0",
      icon: GraduationCap,
      description: "+15 nouveaux",
      gradient: "from-orange-500 to-orange-600",
    },
  ]

  // Pagination
  const pagination = usersData?.pagination
  const totalPages = pagination?.totalPages || 1

  return (
    <>

      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetch()}
              className="ml-2 h-6 px-2"
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Statistiques */}
      <div className="mb-6">
        <StatsCard stats={stats} />
      </div>
      {/* En-tête avec boutons d'action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div></div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={invalidateAndRefetch}
            disabled={isLoading || isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Actualiser
          </Button>
          
          <Link href="/admin/user/add">
            <Button>
              <UserPlus className="w-4 h-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </Link>
        </div>
      </div>

      {/* Carte principale */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Barre de recherche et filtres */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, prénom, matricule ou email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select 
                  value={roleFilter} 
                  onValueChange={setRoleFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les rôles</SelectItem>
                    <SelectItem value="ADMIN">Administrateur</SelectItem>
                    <SelectItem value="TEACHER">Enseignant</SelectItem>
                    <SelectItem value="STUDENT">Étudiant</SelectItem>
                  </SelectContent>
                </Select>

                <Select 
                  value={statusFilter} 
                  onValueChange={setStatusFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tableau */}
            <div className="border rounded-lg">
              {isLoading && !usersData ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Chargement des utilisateurs...</span>
                </div>
              ) : (
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
                    {usersData?.data.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Users className="h-12 w-12 text-gray-300" />
                            <p>Aucun utilisateur trouvé</p>
                            {searchQuery && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSearchQuery('')}
                              >
                                Effacer la recherche
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      usersData?.data.map((user: User) => {
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
                                  checked={user.isActive === true}
                                  onCheckedChange={() => toggleUserStatus(user.id, user.isActive ? "actif" : "inactif")}
                                  disabled={isLoading}
                                />
                                <span
                                  className={`text-sm ${user.isActive === true ? "text-green-500" : "text-muted-foreground"}`}
                                >
                                  {user.isActive === true ? "Actif" : "Inactif"}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" disabled={isLoading}>
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Link href={`/admin/users/${user.id}`} className="flex items-center w-full">
                                      <Eye className="w-4 h-4 mr-2" />
                                      Détails
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Link href={`/admin/users/${user.id}/edit`} className="flex items-center w-full">
                                      <Edit className="w-4 h-4 mr-2" />
                                      Modifier
                                    </Link>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    onClick={() => handleDeleteUser(user.id, `${user.prenom} ${user.nom}`)}
                                  >
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
              )}
            </div>

            {/* Pagination et informations */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {usersData ? (
                  <>
                    Affichage de {usersData.data.length} sur {usersData.pagination.total} utilisateurs
                    {searchQuery && ` pour "${searchQuery}"`}
                  </>
                ) : (
                  "Chargement..."
                )}
              </div>
              
              {pagination && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.max(1, prev - 1))}
                    disabled={page === 1 || isLoading}
                  >
                    Précédent
                  </Button>
                  
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.page} sur {totalPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={page === totalPages || isLoading}
                  >
                    Suivant
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache info (développement seulement) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 p-3 bg-muted rounded-lg text-xs">
          <div className="font-medium mb-1">Info Cache:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Page: {page}</div>
            <div>Recherche: {searchQuery || 'aucune'}</div>
            <div>Rôle: {roleFilter}</div>
            <div>Statut: {statusFilter}</div>
          </div>
        </div>
      )}
    </>
  )
}