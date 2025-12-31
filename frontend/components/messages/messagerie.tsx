"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Plus, Megaphone, Search, X, Paperclip } from "lucide-react"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"messages" | "announcements">("messages")
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [selectedRecipient, setSelectedRecipient] = useState("")
  const [messageSubject, setMessageSubject] = useState("")
  const [messageContent, setMessageContent] = useState("")

  // Utilisateur connecté (à remplacer par les vraies données)
  const currentUser = {
    id: 1,
    name: "Prof. Martin Dubois",
    role: "Enseignant",
    avatar: "/placeholder.svg?height=40&width=40",
  }

  // Conversations
  const conversations = [
    {
      id: 1,
      name: "Marie Laurent",
      role: "Étudiante",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Merci pour vos explications sur le chapitre 3",
      timestamp: "Il y a 5 min",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Dr. Sophie Martin",
      role: "Enseignante",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Pouvons-nous programmer une réunion ?",
      timestamp: "Il y a 1h",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Admin Système",
      role: "Administrateur",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Les modifications ont été appliquées",
      timestamp: "Il y a 3h",
      unread: 1,
      online: true,
    },
  ]

  // Annonces
  const announcements = [
    {
      id: 1,
      title: "Réunion pédagogique",
      content: "Une réunion pédagogique aura lieu le 15 janvier à 14h en salle A201.",
      author: "Direction Académique",
      timestamp: "Il y a 2 jours",
      type: "important",
    },
    {
      id: 2,
      title: "Nouvelle politique de notation",
      content: "Les nouvelles directives de notation entreront en vigueur le prochain semestre.",
      author: "Administration",
      timestamp: "Il y a 5 jours",
      type: "info",
    },
  ]

  // Messages de la conversation sélectionnée
  const messages = [
    {
      id: 1,
      senderId: 2,
      content: "Bonjour Professeur, j'ai une question sur le devoir de la semaine dernière.",
      timestamp: "10:30",
      isCurrentUser: false,
    },
    {
      id: 2,
      senderId: 1,
      content: "Bonjour Marie, je vous écoute. Quelle est votre question ?",
      timestamp: "10:32",
      isCurrentUser: true,
    },
    {
      id: 3,
      senderId: 2,
      content: "Je ne comprends pas bien la question 5 sur les fonctions récursives.",
      timestamp: "10:35",
      isCurrentUser: false,
    },
    {
      id: 4,
      senderId: 1,
      content: "Je vois. Les fonctions récursives appellent elles-mêmes. Avez-vous regardé l'exemple du chapitre 3 ?",
      timestamp: "10:38",
      isCurrentUser: true,
    },
    {
      id: 5,
      senderId: 2,
      content: "Merci pour vos explications sur le chapitre 3",
      timestamp: "10:45",
      isCurrentUser: false,
    },
  ]

  const selectedConv = conversations.find((c) => c.id === selectedConversation)

  const filteredConversations = conversations.filter((conv) =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("[v0] Sending message:", newMessage)
      setNewMessage("")
    }
  }

  const handleCreateNewMessage = () => {
    console.log("[v0] Creating new message:", { selectedRecipient, messageSubject, messageContent })
    setIsNewMessageOpen(false)
    setSelectedRecipient("")
    setMessageSubject("")
    setMessageContent("")
  }

  return (
    <div className="h-full">
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar - Liste des conversations */}
        <div className="shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Messagerie</h2>
              <Dialog open={isNewMessageOpen} onOpenChange={setIsNewMessageOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nouveau
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Nouveau message</DialogTitle>
                    <DialogDescription>Envoyer un message privé à un utilisateur</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Destinataire</label>
                      <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un destinataire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Marie Laurent (Étudiante)</SelectItem>
                          <SelectItem value="2">Dr. Sophie Martin (Enseignante)</SelectItem>
                          <SelectItem value="3">Admin Système</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sujet</label>
                      <Input
                        value={messageSubject}
                        onChange={(e) => setMessageSubject(e.target.value)}
                        placeholder="Objet du message"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        placeholder="Votre message..."
                        rows={5}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Paperclip className="h-4 w-4" />
                        Joindre un fichier
                      </Button>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsNewMessageOpen(false)}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateNewMessage}>Envoyer</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Onglets */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={activeTab === "messages" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("messages")}
                className="flex-1 gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Messages
              </Button>
              <Button
                variant={activeTab === "announcements" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("announcements")}
                className="flex-1 gap-2"
              >
                <Megaphone className="h-4 w-4" />
                Annonces
              </Button>
            </div>

            {/* Recherche */}
            {activeTab === "messages" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une conversation..."
                  className="pl-9"
                />
              </div>
            )}
          </div>

          {/* Liste des conversations ou annonces */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "messages" ? (
              <div className="divide-y divide-border">
                {filteredConversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`w-full p-4 hover:bg-accent/50 transition-colors text-left ${
                      selectedConversation === conv.id ? "bg-accent" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {conv.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conv.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">{conv.name}</p>
                          <span className="text-xs text-muted-foreground">{conv.timestamp}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{conv.role}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unread > 0 && (
                        <Badge variant="default" className="shrink-0">
                          {conv.unread}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {/* Bouton créer annonce (admin/enseignant seulement) */}
                {(currentUser.role === "Administrateur" || currentUser.role === "Enseignant") && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Megaphone className="h-4 w-4" />
                        Créer une annonce
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Nouvelle annonce</DialogTitle>
                        <DialogDescription>Publier une annonce visible par tous les utilisateurs</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Titre</label>
                          <Input placeholder="Titre de l'annonce" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Type</label>
                          <Select defaultValue="info">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Information</SelectItem>
                              <SelectItem value="important">Important</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Destinataires</label>
                          <Select defaultValue="all">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les utilisateurs</SelectItem>
                              <SelectItem value="students">Étudiants uniquement</SelectItem>
                              <SelectItem value="teachers">Enseignants uniquement</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Message</label>
                          <Textarea placeholder="Contenu de l'annonce..." rows={5} />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline">Annuler</Button>
                          <Button>Publier</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}

                {/* Liste des annonces */}
                {announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Megaphone className="h-4 w-4 text-primary" />
                        <h3 className="font-medium">{announcement.title}</h3>
                      </div>
                      <Badge variant={announcement.type === "important" ? "destructive" : "secondary"}>
                        {announcement.type === "important" ? "Important" : "Info"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.content}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{announcement.author}</span>
                      <span>{announcement.timestamp}</span>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Zone de conversation */}
        <div className="flex-1 flex flex-col bg-background">
          {selectedConv && activeTab === "messages" ? (
            <>
              {/* Header conversation */}
              <div className="shrink-0 border-b border-border bg-card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {selectedConv.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{selectedConv.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedConv.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isCurrentUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                        }`}
                      >
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input message */}
              <div className="shrink-0 border-t border-border bg-card">
                <div className="flex items-end gap-2">
                  <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Votre message..."
                    rows={1}
                    className="resize-none"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button size="icon" onClick={handleSendMessage} className="shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Sélectionnez une conversation pour commencer</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
