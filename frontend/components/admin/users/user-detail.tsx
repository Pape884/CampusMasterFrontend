"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  BookOpen,
  GraduationCap,
  Building2,
  TrendingUp,
  Edit,
  ArrowLeft,
  Shield,
  Users,
  AlertCircle,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { userService } from "@/lib/api/services/user.service"
import { formatRoleForDisplay, UserRole } from "@/lib/validations/user.schema"
import { useFormData } from "@/lib/hooks/useFormData"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

export default function UserDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  const [userData, setUserData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Données pour les départements et modules
  const { departments, modules, isLoading: isLoadingData } = useFormData()

  // Charger les données de l'utilisateur
  useEffect(() => {
    async function fetchUserDetails() {
      try {
        setIsLoading(true)
        setError(null)
        
        const data = await userService.getUserById(userId)
        console.log("📊 Données utilisateur:", data)
        setUserData(data)
        
      } catch (error: any) {
        console.error("❌ Erreur lors du chargement:", error)
        setError(error.message || "Impossible de charger les données de l'utilisateur")
        toast.error("Erreur de chargement", {
          description: error.message || "Impossible de charger les données",
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  // Fonction pour formater le téléphone
  const formatPhoneNumber = (phone: number | string | undefined): string => {
    if (!phone) return "Non renseigné"
    
    const phoneStr = String(phone)
    
    // Si c'est un numéro sénégalais (commence par 221 ou 0)
    if (phoneStr.startsWith("221")) {
      return `+${phoneStr.slice(0, 3)} ${phoneStr.slice(3, 5)} ${phoneStr.slice(5, 8)} ${phoneStr.slice(8, 10)} ${phoneStr.slice(10)}`
    } else if (phoneStr.startsWith("0")) {
      return phoneStr.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4")
    }
    
    return phoneStr
  }

  // Trouver le département de l'utilisateur
  const getUserDepartment = () => {
    if (!userData?.enrollments[0]?.module.departmentId) return null
    
    const department = departments.find((d: any) => 
      String(d.id) === String(userData.enrollments[0].module.departmentId)
    )
    
    return department || null
  }

  // Récupérer les modules de l'utilisateur
  const getUserModules = () => {
    if (!userData) return []
    
    // Pour les rôles STUDENT et TEACHER, vérifier les modules dans enrollments
    if (userData.enrollments && userData.enrollments.length > 0) {
      return userData.enrollments.map((enrollment: any) => ({
        ...enrollment.module,
        enrolledAt: enrollment.enrolledAt,
        isActive: enrollment.isActive,
        finalGrade: enrollment.finalGrade,
      }))
    }
    
    // Si pas d'enrollments mais qu'il y a des modules dans l'objet user
    if (userData.modules && userData.modules.length > 0) {
      return userData.modules.map((moduleId: string) => {
        const module = modules.find((m: any) => String(m.id) === String(moduleId))
        return module ? { ...module } : null
      }).filter(Boolean)
    }
    
    return []
  }

  // Calculer la progression moyenne (pour étudiant)
  const calculateAverageProgress = () => {
    const userModules = getUserModules()
    if (userModules.length === 0) return 0
    
    // Ici, vous devriez avoir une logique pour calculer la progression
    // Pour l'exemple, on retourne une valeur fixe
    return 75
  }

  // Obtenir les statistiques selon le rôle
  const getStats = () => {
    if (!userData) return []
    
    const userModules = getUserModules()
    const department = getUserDepartment()
    
    if (userData.role === "STUDENT") {
      return [
        { 
          label: "Modules suivis", 
          value: String(userModules.length), 
          icon: BookOpen, 
          color: "blue" 
        },
        { 
          label: "Département", 
          value: department?.name || "N/A", 
          icon: Building2, 
          color: "green" 
        },
        { 
          label: "Progression", 
          value: `${calculateAverageProgress()}%`, 
          icon: TrendingUp, 
          color: "purple" 
        },
      ]
    } else if (userData.role === "TEACHER") {
      return [
        { 
          label: "Modules enseignés", 
          value: String(userModules.length), 
          icon: BookOpen, 
          color: "blue" 
        },
        { 
          label: "Département", 
          value: department?.name || "N/A", 
          icon: Building2, 
          color: "green" 
        },
        { 
          label: "Étudiants", 
          value: "À définir", 
          icon: Users, 
          color: "purple" 
        },
      ]
    } else {
      return [
        { 
          label: "Rôle", 
          value: formatRoleForDisplay(userData.role as UserRole), 
          icon: Shield, 
          color: "blue" 
        },
        { 
          label: "Compte", 
          value: userData.isActive ? "Actif" : "Inactif", 
          icon: User, 
          color: "green" 
        },
        { 
          label: "Créé le", 
          value: new Date().toLocaleDateString(), 
          icon: Calendar, 
          color: "purple" 
        },
      ]
    }
  }

  // Obtenir la couleur du badge de statut
  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-500/10 text-green-600 border-green-500/20" 
      : "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }

  // Obtenir la couleur de l'icône
  const getIconColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      purple: "bg-purple-500/10 text-purple-600",
    }
    return colors[color as keyof typeof colors] || "bg-gray-500/10 text-gray-600"
  }

  // États de chargement
  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  // Erreur
  if (error) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {error}
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/users")}
              className="ml-4"
            >
              Retour à la liste
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Aucune donnée
  if (!userData) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Aucune donnée</AlertTitle>
          <AlertDescription>
            Aucune donnée utilisateur trouvée.
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin/users")}
              className="ml-4"
            >
              Retour à la liste
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const stats = getStats()
  const userModules = getUserModules()
  const department = getUserDepartment()

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste des utilisateurs
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {userData.prenom?.[0] || ""}
              {userData.nom?.[0] || ""}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {userData.prenom} {userData.nom}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{userData.matricule}</Badge>
                <Badge className={getStatusColor(userData.isActive)}>
                  {userData.isActive ? "Actif" : "Inactif"}
                </Badge>
                <Badge variant="secondary">
                  {formatRoleForDisplay(userData.role as UserRole)}
                </Badge>
              </div>
            </div>
          </div>
          <Link href={`/admin/user/${userId}/edit`}>
            <Button className="gap-2">
              <Edit className="h-4 w-4" />
              Modifier
            </Button>
          </Link>
        </div>

        {/* Statistiques dynamiques selon le rôle */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6">
              <div className="flex items-center gap-4">
                <div className={cn("p-3 rounded-xl", getIconColor(stat.color))}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informations personnelles */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{userData.email || "Non renseigné"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  {formatPhoneNumber(userData.telephone)}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Inscrit le {new Date(userData.createdAt || new Date()).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">
                  Dernière activité: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </Card>

          {/* Département et modules */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {userData.role === "ADMIN" ? "Administration" : "Affiliation académique"}
            </h2>
            
            {userData.role !== "ADMIN" && (
              <>
                {department ? (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Département</p>
                    <Badge variant="secondary" className="text-sm">
                      {department.name} ({department.code})
                    </Badge>
                  </div>
                ) : (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Département</p>
                    <Badge variant="outline" className="text-sm">
                      Non assigné
                    </Badge>
                  </div>
                )}
              </>
            )}

            <div className="mt-4">
              <p className="text-sm text-muted-foreground mb-2">
                {userData.role === "STUDENT" 
                  ? "Modules suivis" 
                  : userData.role === "TEACHER" 
                  ? "Modules enseignés" 
                  : "Administration système"}
              </p>
              
              {userData.role === "ADMIN" ? (
                <div className="space-y-2">
                  <p className="text-sm text-foreground">
                    Accès complet à tous les modules système
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Gestion utilisateurs</Badge>
                    <Badge variant="outline">Gestion départements</Badge>
                    <Badge variant="outline">Gestion cours</Badge>
                    <Badge variant="outline">Administration système</Badge>
                  </div>
                </div>
              ) : userModules.length > 0 ? (
                <div className="space-y-2">
                  {userModules.map((module: any, index: number) => (
                    <Badge key={module.id || index} variant="secondary" className="mr-2 mb-2">
                      {module.name} ({module.code})
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  {userData.role === "STUDENT" 
                    ? "Aucun module suivi" 
                    : "Aucun module assigné"}
                </p>
              )}
            </div>
          </Card>

          {/* Contenu conditionnel selon le rôle */}
          {(userData.role === "STUDENT" || userData.role === "TEACHER") && userModules.length > 0 && (
            <Card className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {userData.role === "STUDENT" ? "Détail des modules suivis" : "Détail des modules enseignés"}
                </h2>
                {userData.role === "STUDENT" && (
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{calculateAverageProgress()}%</p>
                    <p className="text-xs text-muted-foreground">Progression moyenne</p>
                  </div>
                )}
              </div>
              
              {userData.role === "STUDENT" && (
                <Progress value={calculateAverageProgress()} className="h-2 mb-6" />
              )}
              
              <div className="space-y-4">
                {userModules.map((module: any, index: number) => (
                  <div key={module.id || index} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{module.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Code: {module.code} • Semestre: {module.semestre || "Non défini"}
                        </p>
                        {userData.role === "STUDENT" && module.finalGrade !== null && (
                          <div className="mt-2">
                            <Badge variant="outline" className="text-sm">
                              Note: {module.finalGrade}/20
                            </Badge>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {userData.role === "STUDENT" ? (
                          <>
                            <p className="text-lg font-bold text-foreground">
                              Inscrit le {new Date(module.enrolledAt).toLocaleDateString()}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Statut: {module.isActive ? "Actif" : "Inactif"}
                            </p>
                          </>
                        ) : (
                          <>
                            <Badge variant="outline" className="text-sm">
                              Enseignant
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {department?.name || "Département non défini"}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {userData.role === "ADMIN" && (
            <Card className="p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions et accès
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
                    <h3 className="font-semibold text-foreground mb-2">Permissions complètes</h3>
                    <p className="text-sm text-muted-foreground">
                      L'administrateur a accès à toutes les fonctionnalités du système.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
                    <h3 className="font-semibold text-foreground mb-2">Gestion système</h3>
                    <p className="text-sm text-muted-foreground">
                      Peut configurer les paramètres, gérer les utilisateurs et les départements.
                    </p>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-muted/30">
                  <h3 className="font-semibold text-foreground mb-2">Zones d'accès</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Badge className="justify-center">Tableau de bord</Badge>
                    <Badge className="justify-center">Utilisateurs</Badge>
                    <Badge className="justify-center">Départements</Badge>
                    <Badge className="justify-center">Cours</Badge>
                    <Badge className="justify-center">Notes</Badge>
                    <Badge className="justify-center">Rapports</Badge>
                    <Badge className="justify-center">Paramètres</Badge>
                    <Badge className="justify-center">Audit</Badge>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}