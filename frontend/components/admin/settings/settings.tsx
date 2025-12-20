"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, Bell, Shield, Mail, Database } from "lucide-react"

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general")

  const tabs = [
    { id: "general", label: "Général", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Sécurité", icon: Shield },
    { id: "email", label: "Email", icon: Mail },
    { id: "system", label: "Système", icon: Database },
  ]

  return (
    <div className="min-h-screen bg-background ">
      <div className="p-8">

        <div className="border-b border-border mb-6">
          <nav className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="max-w-4xl">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "email" && <EmailSettings />}
          {activeTab === "system" && <SystemSettings />}
        </div>
      </div>
    </div>
  )
}

function GeneralSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Informations de l'établissement</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="siteName">Nom de l'établissement</Label>
            <Input id="siteName" defaultValue="Université de Paris" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="language">Langue par défaut</Label>
            <Select defaultValue="fr">
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="timezone">Fuseau horaire</Label>
            <Select defaultValue="europe/paris">
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="europe/paris">Europe/Paris (GMT+1)</SelectItem>
                <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                <SelectItem value="america/new_york">America/New York (GMT-5)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Enregistrer les modifications</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Paramètres d'inscription</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Permettre l'auto-inscription</p>
              <p className="text-sm text-muted-foreground">Les utilisateurs peuvent créer un compte</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Vérification d'email obligatoire</p>
              <p className="text-sm text-muted-foreground">Validation email requise</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nouveaux utilisateurs</p>
              <p className="text-sm text-muted-foreground">
                Notification lors de l'inscription d'un nouvel utilisateur
              </p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Activité suspecte</p>
              <p className="text-sm text-muted-foreground">Alertes de sécurité et connexions inhabituelles</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Rapports hebdomadaires</p>
              <p className="text-sm text-muted-foreground">Résumé des statistiques de la plateforme</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notifications push</p>
              <p className="text-sm text-muted-foreground">Notifications en temps réel</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  )
}

function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Changer le mot de passe</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="currentPassword">Mot de passe actuel</Label>
            <Input id="currentPassword" type="password" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="newPassword">Nouveau mot de passe</Label>
            <Input id="newPassword" type="password" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <Input id="confirmPassword" type="password" className="mt-1.5" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Changer le mot de passe</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Sécurité supplémentaire</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Authentification à deux facteurs</p>
              <p className="text-sm text-muted-foreground">Sécurité supplémentaire pour votre compte</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>
    </div>
  )
}

function EmailSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Configuration SMTP</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="smtpHost">Serveur SMTP</Label>
            <Input id="smtpHost" placeholder="smtp.example.com" className="mt-1.5" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="smtpPort">Port</Label>
              <Input id="smtpPort" placeholder="587" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="smtpEncryption">Chiffrement</Label>
              <Select defaultValue="tls">
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  <SelectItem value="tls">TLS</SelectItem>
                  <SelectItem value="ssl">SSL</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="smtpUsername">Nom d'utilisateur</Label>
            <Input id="smtpUsername" placeholder="user@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="smtpPassword">Mot de passe</Label>
            <Input id="smtpPassword" type="password" className="mt-1.5" />
          </div>
        </div>
        <div className="mt-6 flex justify-between">
          <Button variant="outline">Tester la connexion</Button>
          <Button>Enregistrer</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Email par défaut</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="fromEmail">Adresse d'expéditeur</Label>
            <Input id="fromEmail" defaultValue="noreply@universite.fr" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="fromName">Nom d'expéditeur</Label>
            <Input id="fromName" defaultValue="Université de Paris" className="mt-1.5" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button>Enregistrer</Button>
        </div>
      </div>
    </div>
  )
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Maintenance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Mode maintenance</p>
              <p className="text-sm text-muted-foreground">Désactiver l'accès à la plateforme</p>
            </div>
            <Switch />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Sauvegarde</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dernière sauvegarde</p>
              <p className="text-sm text-muted-foreground">20 Décembre 2024, 14:30</p>
            </div>
            <Button variant="outline">Créer une sauvegarde</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Sauvegarde automatique</p>
              <p className="text-sm text-muted-foreground">Sauvegarde quotidienne à 02:00</p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cache</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Nettoyer le cache</p>
              <p className="text-sm text-muted-foreground">Vider le cache de l'application</p>
            </div>
            <Button variant="outline">Nettoyer</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
