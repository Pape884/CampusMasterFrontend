"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pencil, Save, X, Upload, Mail, Phone, MapPin, Building2, GraduationCap, BookOpen } from "lucide-react"

export default function ProfilePage() {
  // Simuler l'utilisateur connecté (à remplacer par les vraies données)
  const [userRole, setUserRole] = useState<"enseignant" | "etudiant">("enseignant")
  const [isEditing, setIsEditing] = useState(false)

  const [userData, setUserData] = useState({
    nom: "Dubois",
    prenom: "Marie",
    email: "marie.dubois@universite.fr",
    telephone: "+33 6 12 34 56 78",
    adresse: "123 Rue de l'Université, Paris",
    photo: "/placeholder.svg?height=120&width=120",
    matricule: userRole === "enseignant" ? "ENS-2023-001" : "ETU-2023-456",
    departement: "Mathématiques",
    specialite: userRole === "enseignant" ? "Algèbre et Géométrie" : undefined,
    grade: userRole === "enseignant" ? "Professeur" : undefined,
    niveau: userRole === "etudiant" ? "Master 2" : undefined,
    annee: userRole === "etudiant" ? "2023-2024" : undefined,
  })

  const handleSave = () => {
    // Logique de sauvegarde
    setIsEditing(false)
    console.log("Données sauvegardées:", userData)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Réinitialiser les données
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUserData({ ...userData, photo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto ">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-muted-foreground mt-1">Gérez vos informations personnelles</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Pencil className="h-4 w-4" />
              Modifier
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} className="gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Annuler
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Enregistrer
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Photo de profil */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={userData.photo || "/placeholder.svg"} alt={`${userData.prenom} ${userData.nom}`} />
                <AvatarFallback className="text-2xl">
                  {userData.prenom[0]}
                  {userData.nom[0]}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="w-full">
                  <Label htmlFor="photo" className="cursor-pointer">
                    <div className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 p-4 hover:border-primary hover:bg-accent transition-colors">
                      <Upload className="h-5 w-5" />
                      <span className="text-sm">Changer la photo</span>
                    </div>
                  </Label>
                  <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              )}

              <div className="w-full space-y-2 text-center">
                <p className="text-xl font-semibold">
                  {userData.prenom} {userData.nom}
                </p>
                <p className="text-sm text-muted-foreground">{userRole === "enseignant" ? "Enseignant" : "Étudiant"}</p>
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {userData.matricule}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations personnelles */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Informations personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="nom">Nom</Label>
                  <div className="relative">
                    <Input
                      id="nom"
                      value={userData.nom}
                      onChange={(e) => setUserData({ ...userData, nom: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">👤</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prenom">Prénom</Label>
                  <div className="relative">
                    <Input
                      id="prenom"
                      value={userData.prenom}
                      onChange={(e) => setUserData({ ...userData, prenom: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">👤</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telephone">Téléphone</Label>
                  <div className="relative">
                    <Input
                      id="telephone"
                      value={userData.telephone}
                      onChange={(e) => setUserData({ ...userData, telephone: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="adresse">Adresse</Label>
                  <div className="relative">
                    <Input
                      id="adresse"
                      value={userData.adresse}
                      onChange={(e) => setUserData({ ...userData, adresse: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations académiques */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Informations académiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="departement">Département</Label>
                  <div className="relative">
                    <Input
                      id="departement"
                      value={userData.departement}
                      onChange={(e) => setUserData({ ...userData, departement: e.target.value })}
                      disabled={!isEditing}
                      className="pl-10"
                    />
                    <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {userRole === "enseignant" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="specialite">Spécialité</Label>
                      <div className="relative">
                        <Input
                          id="specialite"
                          value={userData.specialite}
                          onChange={(e) => setUserData({ ...userData, specialite: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="grade">Grade</Label>
                      <div className="relative">
                        <Input
                          id="grade"
                          value={userData.grade}
                          onChange={(e) => setUserData({ ...userData, grade: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}

                {userRole === "etudiant" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="niveau">Niveau</Label>
                      <div className="relative">
                        <Input
                          id="niveau"
                          value={userData.niveau}
                          onChange={(e) => setUserData({ ...userData, niveau: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <GraduationCap className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="annee">Année académique</Label>
                      <div className="relative">
                        <Input
                          id="annee"
                          value={userData.annee}
                          onChange={(e) => setUserData({ ...userData, annee: e.target.value })}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                        <BookOpen className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
