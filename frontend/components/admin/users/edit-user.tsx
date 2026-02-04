"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info
} from "lucide-react"
import Link from "next/link"
import {
  UserRole,
  formatRoleForDisplay,
  updateUserSchema,
  UserUpdateFormData
} from "@/lib/validations/user.schema"
import { userService } from "@/lib/api/services/user.service"
import { useFormData } from "@/lib/hooks/useFormData"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { PasswordStrengthIndicator } from "@/components/ui/password-strength"
import { UserUpdateDto } from "@/lib/api/services"

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.id as string

  // États UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const [changePassword, setChangePassword] = useState(false)

  // Données pour les sélecteurs
  const { departments, modules, isLoading: isLoadingData, error: dataError } = useFormData()

  // Initialisation du formulaire avec react-hook-form
  const form = useForm<UserUpdateFormData>({
    resolver: zodResolver(updateUserSchema) as any,
    defaultValues: {
      role: 'STUDENT',
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      password: '',
      confirmPassword: '',
      departement: '',
      modules: [],
      isActive: true,
    },
    mode: 'onChange',
  })

  // Surveiller le rôle pour ajuster les validations
  const selectedRole = form.watch('role')
  const watchedDepartmentId = form.watch('departement')
  const watchedModules = form.watch('modules')
  const passwordValue = form.watch('password')

  // Charger les données de l'utilisateur
  useEffect(() => {
    async function fetchUser() {
      try {
        setIsLoadingUser(true)
        const userData = await userService.getUserById(userId)
        
        // Initialiser le formulaire avec les données existantes
        form.reset({
          role: userData.role,
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          telephone: userData.telephone || '',
          password: '',
          confirmPassword: '',
          departement: userData.departement || '',
          modules: userData.modules || [],
          isActive: userData.isActive !== undefined ? userData.isActive : true,
        })
      } catch (error: any) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error)
        toast.error('Erreur de chargement', {
          description: error.message || 'Impossible de charger les données de l\'utilisateur',
          duration: 5000,
        })
        router.push('/admin/users')
      } finally {
        setIsLoadingUser(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId, form, router])

  // Réinitialiser les sélections lorsque le rôle change
  useEffect(() => {
    if (selectedRole === 'ADMIN') {
      form.setValue('departement', '')
      form.setValue('modules', [])
    }
  }, [selectedRole, form])

  // Calculer la force du mot de passe
  const calculatePasswordStrength = (password?: string): number => {
    if (!password) return 0
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1
    return strength
  }

  const passwordStrength = calculatePasswordStrength(passwordValue)

  const addModule = (moduleId: string) => {
    const current = form.getValues("modules") || []
    if (!current.includes(moduleId)) {
      form.setValue("modules", [...current, moduleId], {
        shouldValidate: true,
      })
    }
  }

  const removeModule = (moduleId: string) => {
    const current = form.getValues("modules") || []
    form.setValue(
      "modules",
      current.filter((id) => id !== moduleId),
      { shouldValidate: true }
    )
  }

  const filteredModules = useMemo(() => {
    if (!watchedDepartmentId || selectedRole === 'ADMIN') return []
    return modules.filter(
      (m) => String(m.departmentId) === String(watchedDepartmentId)
    )
  }, [modules, watchedDepartmentId, selectedRole])

  // Soumission du formulaire
  const onSubmit = async (data: UserUpdateFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)
    setSubmitSuccess(false)

    try {
      console.log('📤 Envoi des données de mise à jour:', data)

      // Préparer les données pour l'API
      const userData: UserUpdateDto = {
        nom: data.nom.trim(),
        prenom: data.prenom.trim(),
        email: data.email.trim().toLowerCase(),
        role: data.role,
        telephone: data.telephone?.trim() || undefined,
        departement: data.departement || '',
        modules: data.modules || [],
        isActive: data.isActive,
      }

      // Ajouter le mot de passe seulement s'il est fourni
      if (data.password && data.password.trim() !== '') {
        userData.password = data.password
      }

      // Appel à l'API
      await userService.updateUser(userId, userData)

      // Succès
      toast.success('Utilisateur mis à jour avec succès', {
        description: `${data.prenom} ${data.nom} a été modifié avec le rôle ${formatRoleForDisplay(data.role)}`,
        duration: 5000,
      })

      setSubmitSuccess(true)

      // Redirection après 2 secondes
      setTimeout(() => {
        router.push('/admin/users')
        router.refresh()
      }, 2000)

    } catch (error: any) {
      console.error('❌ Erreur lors de la mise à jour:', error)

      // Gestion des erreurs spécifiques
      let errorMessage = 'Une erreur est survenue lors de la mise à jour'

      if (error.message?.includes('409')) {
        errorMessage = 'Cette adresse email est déjà utilisée'
      } else if (error.message?.includes('validation')) {
        errorMessage = 'Les données fournies sont invalides'
      } else if (error.message?.includes('réseau') || error.message?.includes('network')) {
        errorMessage = 'Erreur de connexion au serveur'
      } else {
        errorMessage = error.message || errorMessage
      }

      setSubmitError(errorMessage)

      toast.error('Erreur de mise à jour', {
        description: errorMessage,
        duration: 5000,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Gérer l'annulation
  const handleCancel = () => {
    if (form.formState.isDirty) {
      if (confirm('Les modifications non enregistrées seront perdues. Voulez-vous vraiment annuler ?')) {
        router.push('/admin/users')
      }
    } else {
      router.push('/admin/users')
    }
  }

  // États de chargement
  if (isLoadingUser || isLoadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement des données...</p>
        </div>
      </div>
    )
  }

  // Erreur de chargement des données
  if (dataError) {
    return (
      <div className="min-h-screen bg-background p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erreur de chargement</AlertTitle>
          <AlertDescription>
            {dataError}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="ml-4"
            >
              Réessayer
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <Link
            href="/admin/users"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
            onClick={(e) => {
              e.preventDefault()
              handleCancel()
            }}
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Modifier l'utilisateur</h1>
              <p className="text-muted-foreground">
                Modifiez les informations de l'utilisateur. Les champs marqués d'un * sont obligatoires.
              </p>
            </div>
          </div>
        </div>

        {/* Message de succès */}
        {submitSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Succès !</AlertTitle>
            <AlertDescription>
              L'utilisateur a été mis à jour avec succès. Redirection vers la liste...
            </AlertDescription>
          </Alert>
        )}

        {/* Message d'erreur de soumission */}
        {submitError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur de mise à jour</AlertTitle>
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section Rôle */}
            <Card className="p-6">
              <div className="mb-4">
                <Label className="text-sm font-medium">Rôle de l'utilisateur *</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Sélectionnez le rôle qui définira les permissions de l'utilisateur
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['STUDENT', 'TEACHER', 'ADMIN'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => form.setValue('role', role)}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left cursor-pointer",
                      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                      selectedRole === role
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 bg-card"
                    )}
                  >
                    <div className="font-medium text-foreground">
                      {formatRoleForDisplay(role)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {role === 'STUDENT' && "Accès aux cours, devoirs et notes"}
                      {role === 'TEACHER' && "Gestion des cours, étudiants et évaluations"}
                      {role === 'ADMIN' && "Accès complet à tous les modules"}
                    </div>
                    {selectedRole === role && (
                      <div className="mt-2 text-xs text-primary font-medium">
                        ✓ Sélectionné
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {form.formState.errors.role && (
                <p className="text-sm text-destructive mt-2">
                  {form.formState.errors.role.message}
                </p>
              )}
            </Card>

            {/* Informations de base */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-foreground mb-6">Informations personnelles</h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Prénom */}
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Prénom"
                          className={cn(
                            form.formState.errors.prenom && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nom */}
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nom"
                          className={cn(
                            form.formState.errors.nom && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="email@exemple.fr"
                          className={cn(
                            form.formState.errors.email && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Utilisé pour la connexion et les communications
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Téléphone */}
                <FormField
                  control={form.control}
                  name="telephone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="771000000 ou 0771000000"
                          className={cn(
                            form.formState.errors.telephone && "border-destructive focus-visible:ring-destructive"
                          )}
                        />
                      </FormControl>
                      <FormDescription>
                        Format: 771000000 ou 0771000000
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* Mot de passe (optionnel pour l'édition) */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Changer le mot de passe</h2>
                  <p className="text-sm text-muted-foreground">
                    Laissez vide pour conserver le mot de passe actuel
                  </p>
                </div>
                <Switch
                  checked={changePassword}
                  onCheckedChange={(checked) => {
                    setChangePassword(checked)
                    if (!checked) {
                      form.setValue('password', '')
                      form.setValue('confirmPassword', '')
                    }
                  }}
                />
              </div>

              {changePassword && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Mot de passe */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nouveau mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 8 caractères"
                                className={cn(
                                  "pr-10",
                                  form.formState.errors.password && "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <PasswordStrengthIndicator strength={passwordStrength} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirmation mot de passe */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Répétez le mot de passe"
                                className={cn(
                                  "pr-10",
                                  form.formState.errors.confirmPassword && "border-destructive focus-visible:ring-destructive"
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          {!form.formState.errors.confirmPassword && field.value && form.watch('password') === field.value && (
                            <div className="flex items-center gap-2 text-sm text-green-600 mt-2">
                              <CheckCircle className="h-4 w-4" />
                              Les mots de passe correspondent
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Indicateur de sécurité */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium">Exigences de sécurité</span>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          (form.watch('password') || '').length >= 8 ? "bg-green-500" : "bg-gray-300"
                        )} />
                        Au moins 8 caractères
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          /[A-Z]/.test(form.watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                        )} />
                        Au moins une majuscule
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          /[a-z]/.test(form.watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                        )} />
                        Au moins une minuscule
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          /[0-9]/.test(form.watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                        )} />
                        Au moins un chiffre
                      </li>
                      <li className="flex items-center gap-2">
                        <div className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          /[^A-Za-z0-9]/.test(form.watch('password') || '') ? "bg-green-500" : "bg-gray-300"
                        )} />
                        Au moins un caractère spécial
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </Card>

            {/* Section Étudiant et Enseignant */}
            {(selectedRole === 'STUDENT' || selectedRole === 'TEACHER') && (
              <>
                {/* Département */}
                <Card className="p-6">
                  <h2 className="text-lg font-semibold text-foreground mb-4">
                    {selectedRole === 'STUDENT' ? 'Département d\'étude *' : 'Département d\'enseignement *'}
                  </h2>
                  <Select
                    value={watchedDepartmentId}
                    onValueChange={(value) => {
                      form.setValue('departement', value)
                      // Réinitialiser les modules quand le département change
                      form.setValue('modules', [])
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name} ({dept.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {form.formState.errors.departement && (
                    <p className="text-sm text-destructive mt-2">
                      {form.formState.errors.departement.message}
                    </p>
                  )}
                  {watchedDepartmentId && (
                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="secondary" className="gap-2">
                        {departments.find(d => String(d.id) === String(watchedDepartmentId))?.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-red-500"
                          onClick={() => {
                            form.setValue('departement', '')
                            form.setValue('modules', [])
                          }}
                        />
                      </Badge>
                    </div>
                  )}
                </Card>

                {/* Modules */}
                {watchedDepartmentId && (
                  <Card className="p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-4">
                      {selectedRole === 'STUDENT' ? 'Modules à suivre *' : 'Modules à enseigner *'}
                    </h2>
                    
                    <div className="mb-4">
                      <Select
                        value=""
                        onValueChange={addModule}
                        disabled={filteredModules.length === 0 || filteredModules.filter(m => !(watchedModules || []).includes(String(m.id))).length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            filteredModules.length === 0 
                              ? "Aucun module disponible pour ce département"
                              : "Ajouter un module"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredModules
                            .filter(m => !(watchedModules || []).includes(String(m.id)))
                            .map(module => (
                              <SelectItem key={module.id} value={String(module.id)}>
                                {module.name} ({module.code})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {form.formState.errors.modules && (
                      <p className="text-sm text-destructive mt-2">
                        {form.formState.errors.modules.message}
                      </p>
                    )}

                    {watchedModules && watchedModules.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {watchedModules.map((moduleId) => {
                          const module = modules.find(m => String(m.id) === String(moduleId))
                          return (
                            <Badge key={moduleId} variant="secondary" className="gap-2">
                              {module?.name}
                              <X
                                className="h-3 w-3 cursor-pointer hover:text-red-500"
                                onClick={() => removeModule(moduleId)}
                              />
                            </Badge>
                          )
                        })}
                      </div>
                    )}

                    {(!watchedModules || watchedModules.length === 0) && watchedDepartmentId && (
                      <div className="text-sm text-muted-foreground mt-2">
                        {selectedRole === 'STUDENT' 
                          ? "Sélectionnez au moins un module que l'étudiant suivra"
                          : "Sélectionnez au moins un module que l'enseignant enseignera"}
                      </div>
                    )}
                  </Card>
                )}
              </>
            )}

            {/* Statut */}
            <Card className="p-6">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel className="text-sm font-medium">Compte actif</FormLabel>
                        <FormDescription className="text-xs text-muted-foreground mt-1">
                          {field.value
                            ? 'L\'utilisateur pourra se connecter immédiatement'
                            : 'Le compte sera créé mais désactivé'}
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </Card>

            {/* Résumé et Actions */}
            <Card className="p-6 bg-muted/30">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-medium text-foreground">Résumé</h3>
                  <p className="text-sm text-muted-foreground">
                    {form.watch('prenom') && form.watch('nom')
                      ? `Mise à jour de ${form.watch('prenom')} ${form.watch('nom')} comme ${formatRoleForDisplay(selectedRole)}`
                      : 'Remplissez le formulaire pour voir le résumé'
                    }
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Annuler
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !form.formState.isValid}
                    className="gap-2 min-w-[120px]"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Mise à jour...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Mettre à jour
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Indicateur de validation */}
              {form.formState.isDirty && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Formulaire {form.formState.isValid ? 'valide' : 'invalide'}
                    </span>
                    <span className={cn(
                      "font-medium",
                      form.formState.isValid ? "text-green-600" : "text-destructive"
                    )}>
                      {form.formState.isValid ? '✓ Prêt à envoyer' : '✗ Corrections nécessaires'}
                    </span>
                  </div>
                </div>
              )}
            </Card>
          </form>
        </Form>
      </div>
    </div>
  )
}