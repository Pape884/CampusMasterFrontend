"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  User,
  Mail,
  Phone,
  MapPin,
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
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

// Ajout d'un type pour déterminer le rôle dynamiquement
type UserRole = "Étudiant" | "Enseignant" | "Administrateur"

export default function UserDetailsPage() {
  // Ajout de la propriété role pour adapter l'affichage
  const [userRole] = useState<UserRole>("Enseignant")

  // Données de l'utilisateur
  const user = {
    id: "USR-2024-001",
    matricule: userRole === "Étudiant" ? "ETU-45678" : userRole === "Enseignant" ? "ENS-12345" : "ADM-00001",
    nom: "Dupont",
    prenom: "Marie",
    email: "marie.dupont@universite.fr",
    telephone: "+33 6 12 34 56 78",
    adresse: "15 Rue de la République, 75001 Paris",
    dateNaissance: "15/03/1985",
    dateInscription: "01/09/2023",
    role: userRole,
    statut: "Actif",
    departements: ["Mathématiques", "Informatique"],
    derniereConnexion: "20/12/2024 à 14:30",
    progressionGlobale: 78,
  }

  // Données spécifiques pour étudiant
  const coursEtudiant = [
    { id: 1, nom: "Algèbre Linéaire", code: "MATH301", enseignant: "Prof. Martin", progression: 85, note: 16.5 },
    { id: 2, nom: "Analyse Numérique", code: "MATH302", enseignant: "Prof. Laurent", progression: 70, note: 14.0 },
    { id: 3, nom: "Physique Quantique", code: "PHYS201", enseignant: "Dr. Bernard", progression: 92, note: 17.5 },
  ]

  // Données spécifiques pour enseignant
  const coursEnseignant = [
    { id: 1, nom: "Algèbre Linéaire", code: "MATH301", etudiants: 45, departement: "Mathématiques" },
    { id: 2, nom: "Analyse Numérique", code: "MATH302", etudiants: 38, departement: "Mathématiques" },
    { id: 3, nom: "Programmation Python", code: "INFO101", etudiants: 52, departement: "Informatique" },
  ]

  // Données spécifiques pour administrateur
  const permissions = [
    { nom: "Gestion des utilisateurs", actif: true },
    { nom: "Gestion des départements", actif: true },
    { nom: "Gestion des cours", actif: true },
  ]

  const activitesRecentes = [
    { action: "Création d'utilisateur", date: "20/12/2024 14:30", details: "Nouvel étudiant inscrit" },
    { action: "Modification département", date: "20/12/2024 11:15", details: "Mise à jour budget" },
    { action: "Validation cours", date: "19/12/2024 16:45", details: "Approbation nouveau cours" },
    { action: "Export données", date: "19/12/2024 09:20", details: "Rapport mensuel généré" },
  ]

  // Statistiques adaptées selon le rôle
  const getStatistiques = () => {
    if (userRole === "Étudiant") {
      return [
        { label: "Cours inscrits", value: "3", icon: BookOpen, color: "blue" },
        { label: "Moyenne", value: "16.0", icon: GraduationCap, color: "green" },
        { label: "Progression", value: "82%", icon: TrendingUp, color: "purple" },
      ]
    } else if (userRole === "Enseignant") {
      return [
        { label: "Cours enseignés", value: "3", icon: BookOpen, color: "blue" },
        { label: "Étudiants", value: "135", icon: Users, color: "green" },
        { label: "Départements", value: "2", icon: Building2, color: "purple" },
      ]
    } else {
      return [
        { label: "Utilisateurs", value: "542", icon: Users, color: "blue" },
        { label: "Permissions", value: "3", icon: Shield, color: "green" },
        { label: "Activité", value: "94%", icon: TrendingUp, color: "purple" },
      ]
    }
  }

  const stats = getStatistiques()

  const getIconColor = (color: string) => {
    const colors = {
      blue: "bg-blue-500/10 text-blue-600",
      green: "bg-green-500/10 text-green-600",
      purple: "bg-purple-500/10 text-purple-600",
    }
    return colors[color as keyof typeof colors] || "bg-gray-500/10 text-gray-600"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 mx-auto">
        {/* Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
              {user.prenom[0]}
              {user.nom[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {user.prenom} {user.nom}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{user.matricule}</Badge>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">{user.statut}</Badge>
              </div>
            </div>
          </div>
          <Link href={`/user/${user.id}/edit`}>
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
                <div className={`p-3 rounded-xl ${getIconColor(stat.color)}`}>
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
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.telephone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.adresse}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.dateNaissance}</span>
              </div>
            </div>
          </Card>

          {/* Département(s) */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {user.departements.length > 1 ? "Départements" : "Département"}
            </h2>
            <div className="flex flex-wrap gap-2">
              {user.departements.map((dept, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {dept}
                </Badge>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Dernière connexion</p>
                  <p className="text-foreground font-medium">{user.derniereConnexion}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Contenu conditionnel selon le rôle */}
          {userRole === "Étudiant" && (
            <Card className="p-6 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Cours suivis
                </h2>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{user.progressionGlobale}%</p>
                  <p className="text-xs text-muted-foreground">Progression</p>
                </div>
              </div>
              <Progress value={user.progressionGlobale} className="h-2 mb-6" />
              <div className="space-y-3">
                {coursEtudiant.map((cours) => (
                  <div key={cours.id} className="p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{cours.nom}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cours.code} • {cours.enseignant}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">{cours.note}</p>
                        <p className="text-xs text-muted-foreground">/ 20</p>
                      </div>
                    </div>
                    <Progress value={cours.progression} className="h-1.5" />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {userRole === "Enseignant" && (
            <Card className="p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Cours enseignés
              </h2>
              <div className="space-y-3">
                {coursEnseignant.map((cours) => (
                  <div key={cours.id} className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{cours.nom}</h3>
                      <p className="text-sm text-muted-foreground">{cours.code}</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {cours.departement}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{cours.etudiants}</p>
                      <p className="text-xs text-muted-foreground">étudiants</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {userRole === "Administrateur" && (
            <Card className="p-6 md:col-span-2">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Permissions système
              </h2>
              <div className="space-y-3">
                {permissions.map((perm, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                    <span className="text-sm font-medium text-foreground">{perm.nom}</span>
                    <Badge className={perm.actif ? "bg-green-500/10 text-green-600" : "bg-gray-500/10 text-gray-600"}>
                      {perm.actif ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
