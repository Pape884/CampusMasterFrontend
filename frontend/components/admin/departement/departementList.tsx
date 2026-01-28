"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  Search,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  Plus,
  RefreshCw,
  Loader2,
  AlertCircle,
  Euro,
  XCircle,
  CheckCircle
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import StatsCard from "@/components/ui/StatsCards"
import Link from "next/link"
import { useDepartmentsQuery } from "@/lib/hooks/useDepartmentsQuery"
import { departmentService } from "@/lib/api/services/department.service"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Department, DepartmentsResponse, DepartmentStatus } from "@/lib/api/services"
import { ConfirmDeleteDialog } from "@/components/shared/ConfirmDeleteDialog"

export default function DepartmentCards() {
  const router = useRouter()

  // États pour les filtres
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [openDelete, setOpenDelete] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [page, setPage] = useState(0)
  const limit = 8

  const onSuccess = useCallback((data: DepartmentsResponse) => {
    console.log(`✅ ${data.data.length} départements chargés`)
  }, []);

  const onError = useCallback((error: Error) => {
    toast.error("Erreur de chargement", {
      description: error.message
    })
  }, []);


  // Utiliser le hook pour récupérer les départements
  const {
    data: departmentsData,
    isLoading,
    isRefreshing,
    error,
    refetch,
    invalidateAndRefetch,
  } = useDepartmentsQuery({
    search: searchQuery || undefined,
    status: statusFilter !== "all" ? statusFilter as DepartmentStatus : "all",
    page,
    limit,
    sortBy: "createdAt",
    sortOrder: "desc",
    enabled: true,
    onSuccess,
    onError,
  })



  // Fonction pour changer le statut d'un département
  const handleToggleStatus = async (departmentId: string, currentStatus: boolean) => {
    try {
      await departmentService.toggleDepartmentStatus(departmentId, currentStatus)

      toast.success("Statut mis à jour", {
        description: "Le statut du département a été modifié avec succès"
      })

      // Recharger les données
      await refetch()

    } catch (error: any) {
      toast.error("Erreur", {
        description: error.message || "Impossible de modifier le statut"
      })
    }
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
      title: "Total Départements",
      value: departmentsData?.stats?.totalDepartments?.toString() || "0",
      icon: Building2,
      gradient: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Départements Actives",
      value: departmentsData?.stats?.activeDepartments?.toString() || "0",
      icon: Users,
      gradient: "from-green-500 to-green-600",
    },
    {
      title: "Départements Inactives",
      value: departmentsData?.stats?.inactiveDepartments?.toString() || "0",
      icon: GraduationCap,
      gradient: "from-purple-500 to-purple-600",
    },
    {
      title: "Total Modules",
      value: departmentsData?.stats?.totalModules?.toString() || "0",
      icon: BookOpen,
      gradient: "from-yellow-500 to-yellow-600",
    },
  ]


  return (
    <>
      <div className="space-y-6">
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
        <div>
          <StatsCard stats={stats} />
        </div>

        {/* En-tête avec titre et actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>

          </div>

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

            <Link href="/admin/department/add">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un département
              </Button>
            </Link>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, code ou directeur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="actif">Actif</SelectItem>
                    <SelectItem value="inactif">Inactif</SelectItem>
                    <SelectItem value="en_construction">En construction</SelectItem>
                  </SelectContent>
                </Select>


              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des départements */}
        {isLoading && !departmentsData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                  <Skeleton className="h-20 rounded-lg" />
                </div>
                <div className="flex gap-3">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 flex-1" />
                </div>
              </Card>
            ))}
          </div>
        ) : departmentsData?.data?.length === 0 ? (
          <Card className="p-12 text-center">
            <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucun département trouvé</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : "Commencez par créer votre premier département"}
            </p>
            <div className="flex gap-3 justify-center">
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Effacer la recherche
                </Button>
              )}
              <Link href="/admin/department/add">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un département
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {departmentsData?.data?.map((dept: Department) => {
              //const performanceColor = departmentService.getPerformanceColor(dept.performance)
              //const statusColor = departmentService.getStatusColor(dept.status)
              //const statusLabel = departmentService.getStatusLabel(dept.status)

              return (
                <Card key={dept.id} className="p-6 border border-border bg-card hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{
                          backgroundColor: '#8b5cf6',
                          background: `linear-gradient(135deg, ${dept.couleur}80, ${dept.couleur})`
                        }}
                      >
                        <Building2 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-foreground">{dept.name}</h3>

                        </div>
                        <p className="text-sm text-muted-foreground">
                          Code: <span className="font-mono">{dept.code}</span>
                        </p>

                      </div>
                    </div>
                    {/* afficher le status du département */}
                    <Badge
                      variant={dept.isActive ? "default" : "secondary"}
                      className="flex items-center gap-1"
                    >
                      {dept.isActive ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      {dept.isActive ? "Actif" : "Inactif"}
                    </Badge>

                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleToggleStatus(dept.id, dept.isActive)}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Changer le statut
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/department/${dept.id}`} className="flex items-center w-full">
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link href={`/admin/department/${dept.id}/edit`} className="flex items-center w-full">
                              <Edit className="w-4 h-4 mr-2" />
                              Modifier
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onSelect={(e) => {
                              e.preventDefault()
                              setOpenDelete(true)
                              setSelectedDepartment(dept)
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Description */}
                  {dept.description && (
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">
                      {dept.description}
                    </p>
                  )}

                  {/* Statistics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                      <Users className="h-5 w-5 text-green-600 mb-2" />
                      <p className="text-2xl font-bold text-foreground">{dept.teachersCount}</p>
                      <p className="text-xs text-muted-foreground">Enseignants</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                      <GraduationCap className="h-5 w-5 text-purple-600 mb-2" />
                      <p className="text-2xl font-bold text-foreground">{dept.studentsCount}</p>
                      <p className="text-xs text-muted-foreground">Étudiants</p>
                    </div>
                    <div className="flex flex-col items-center p-4 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-blue-600 mb-2" />
                      <p className="text-2xl font-bold text-foreground">{dept.modulesCount}</p>
                      <p className="text-xs text-muted-foreground">Modules</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/admin/department/${dept.id}`}>
                      <Button variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </Button>
                    </Link>
                    <Link href={`/admin/department/${dept.id}/edit`}>
                      <Button className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </Button>
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {departmentsData && departmentsData.pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.max(1, prev - 1))}
              disabled={page === 1 || isLoading}
            >
              Précédent
            </Button>

            <span className="text-sm text-muted-foreground">
              Page {departmentsData.pagination.page} sur {departmentsData.pagination.totalPages}
            </span>

            <Button
              variant="outline"
              onClick={() => setPage(prev => Math.min(departmentsData.pagination.totalPages, prev + 1))}
              disabled={page === departmentsData.pagination.totalPages || isLoading}
            >
              Suivant
            </Button>
          </div>
        )}

        {/* Info résultats */}
        {departmentsData && (
          <div className="text-center text-sm text-muted-foreground">
            Affichage de {departmentsData.data.length} sur {departmentsData.pagination.totalPages} départements
            {searchQuery && ` pour "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* DIALOG */}
      {selectedDepartment && (
        <ConfirmDeleteDialog
          open={openDelete}
          onOpenChange={(open) => {
            setOpenDelete(open)
            if (!open) setSelectedDepartment(null)
          }}
          title="Supprimer le département"
          description={`Vous êtes sur le point de supprimer le département "${selectedDepartment.name}". Cette action est irréversible.`}
          confirmationText={selectedDepartment.name}
          onConfirm={async () => {
            await departmentService.deleteDepartment(selectedDepartment.id)
            toast.success("Département supprimé")
            await refetch()
          }}
        />
      )}

    </>
  )
}