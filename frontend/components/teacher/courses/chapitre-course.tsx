"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    ArrowLeft,
    Plus,
    Edit,
    Trash2,
    FileText,
    Video,
    Link as LinkIcon,
    GripVertical,
    Eye,
    EyeOff,
    Save,
    Upload
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { courseService } from "@/lib/api/services/course.service"
import { chapterService } from "@/lib/api/services/chapter.service"
import { Chapter } from "@/lib/api/services"

export default function CourseChaptersPage() {
    const router = useRouter()
    const params = useParams()
    const courseId = params.id as string

    const [course, setCourse] = useState<any>(null)
    const [chapters, setChapters] = useState<Chapter[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null)
    const [newResource, setNewResource] = useState({
        name: "",
        type: "pdf" as const,
        url: "",
        file: null as File | null,
    })

    // Charger les données
    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true)

                // Charger le cours
                const courseData = await courseService.getCourseById(courseId)
                setCourse(courseData)

                // Charger les chapitres
                const chaptersData = await chapterService.getChaptersByCourse(courseId)
                setChapters(chaptersData)

            } catch (error: any) {
                toast.error("Erreur", {
                    description: "Impossible de charger les données",
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadData()
    }, [courseId])

    // Gérer le drag and drop
    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return

        const items = Array.from(chapters)
        const [reorderedItem] = items.splice(result.source.index, 1)
        items.splice(result.destination.index, 0, reorderedItem)

        // Mettre à jour l'ordre
        const updatedChapters = items.map((item, index) => ({
            ...item,
            order: index + 1,
        }))

        setChapters(updatedChapters)

        // Mettre à jour l'ordre dans l'API
        try {
            await chapterService.updateChaptersOrder(
                courseId,
                updatedChapters.map(ch => ({ id: ch.id, order: ch.order }))
            )
        } catch (error) {
            toast.error("Erreur", {
                description: "Impossible de mettre à jour l'ordre",
            })
        }
    }

    // Ajouter/Modifier un chapitre
    const handleSaveChapter = async (data: any) => {
        try {
            if (editingChapter) {
                // Mettre à jour
                await chapterService.updateChapter(editingChapter.id, data)
                toast.success("Chapitre mis à jour")
            } else {
                // Créer
                await chapterService.createChapter({
                    ...data,
                    courseId,
                    order: chapters.length + 1,
                })
                toast.success("Chapitre ajouté")
            }

            // Recharger les chapitres
            const chaptersData = await chapterService.getChaptersByCourse(courseId)
            setChapters(chaptersData)

            setIsDialogOpen(false)
            setEditingChapter(null)
        } catch (error: any) {
            toast.error("Erreur", {
                description: error.message || "Une erreur est survenue",
            })
        }
    }

    // Supprimer un chapitre
    const handleDeleteChapter = async (chapterId: string) => {
        if (!confirm("Êtes-vous sûr de vouloir supprimer ce chapitre ?")) {
            return
        }

        try {
            await chapterService.deleteChapter(chapterId)
            toast.success("Chapitre supprimé")

            // Recharger les chapitres
            const chaptersData = await chapterService.getChaptersByCourse(courseId)
            setChapters(chaptersData)
        } catch (error: any) {
            toast.error("Erreur", {
                description: error.message || "Impossible de supprimer le chapitre",
            })
        }
    }

    // Ajouter une ressource
    const handleAddResource = async (chapterId: string) => {
        if (!newResource.name || (!newResource.url && !newResource.file)) {
            toast.error("Erreur", {
                description: "Veuillez remplir tous les champs",
            })
            return
        }

        try {
            const formData = new FormData()
            formData.append("name", newResource.name)
            formData.append("type", newResource.type)

            if (newResource.file) {
                formData.append("file", newResource.file)
            } else {
                formData.append("url", newResource.url)
            }

            await chapterService.addResource(chapterId, formData)
            toast.success("Ressource ajoutée")

            // Recharger les chapitres
            const chaptersData = await chapterService.getChaptersByCourse(courseId)
            setChapters(chaptersData)

            // Réinitialiser le formulaire
            setNewResource({ name: "", type: "pdf", url: "", file: null })
        } catch (error: any) {
            toast.error("Erreur", {
                description: error.message || "Impossible d'ajouter la ressource",
            })
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-3">Chargement...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="p-8 mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/teacher/courses/${courseId}`)}
                        className="mb-4"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Retour au cours
                    </Button>

                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                {course?.title}
                            </h1>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Gestion des chapitres • {chapters.length} chapitre(s)
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="gap-2">
                                    <Plus className="h-4 w-4" />
                                    Nouveau chapitre
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingChapter ? "Modifier le chapitre" : "Nouveau chapitre"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingChapter
                                            ? "Modifiez les informations de ce chapitre"
                                            : "Ajoutez un nouveau chapitre à votre cours"}
                                    </DialogDescription>
                                </DialogHeader>

                                {/* Formulaire du chapitre */}
                                <div className="space-y-4">
                                    <div>
                                        <Label>Titre du chapitre *</Label>
                                        <Input
                                            placeholder="Introduction à l'algèbre"
                                            value={editingChapter?.title || ""}
                                            onChange={(e) => setEditingChapter({
                                                ...editingChapter,
                                                title: e.target.value,
                                            } as Chapter)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Description du chapitre..."
                                            value={editingChapter?.description || ""}
                                            onChange={(e) => setEditingChapter({
                                                ...editingChapter,
                                                description: e.target.value,
                                            } as Chapter)}
                                        />
                                    </div>

                                    <div>
                                        <Label>Contenu (markdown supporté)</Label>
                                        <Textarea
                                            placeholder="Contenu détaillé du chapitre..."
                                            className="min-h-[200px]"
                                            value={editingChapter?.content || ""}
                                            onChange={(e) => setEditingChapter({
                                                ...editingChapter,
                                                content: e.target.value,
                                            } as Chapter)}
                                        />
                                    </div>
                                </div>

                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsDialogOpen(false)
                                            setEditingChapter(null)
                                        }}
                                    >
                                        Annuler
                                    </Button>
                                    <Button onClick={() => handleSaveChapter(editingChapter)}>
                                        {editingChapter ? "Mettre à jour" : "Créer"}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Liste des chapitres avec drag and drop */}
                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="chapters">
                        {(provided: any) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="space-y-4"
                            >
                                {chapters.map((chapter, index) => (
                                    <Draggable
                                        key={chapter.id}
                                        draggableId={chapter.id}
                                        index={index}
                                    >
                                        {(provided: any) => (
                                            <Card
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="p-6"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Handle pour drag and drop */}
                                                    <div {...provided.dragHandleProps} className="pt-1">
                                                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                                                    </div>

                                                    {/* Contenu */}
                                                    <div className="flex-1">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-3">
                                                                <Badge variant="outline">
                                                                    Chapitre {chapter.order}
                                                                </Badge>
                                                                <h3 className="text-lg font-semibold">
                                                                    {chapter.title}
                                                                </h3>
                                                            </div>

                                                            <div className="flex gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setEditingChapter(chapter)
                                                                        setIsDialogOpen(true)
                                                                    }}
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleDeleteChapter(chapter.id)}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        {chapter.description && (
                                                            <p className="text-sm text-muted-foreground mb-3">
                                                                {chapter.description}
                                                            </p>
                                                        )}

                                                        {/* Ressources */}
                                                        <div className="mt-4">
                                                            <div className="flex items-center justify-between mb-3">
                                                                <h4 className="text-sm font-semibold">
                                                                    Ressources ({chapter.resources?.length || 0})
                                                                </h4>

                                                                {/* Formulaire pour ajouter une ressource */}
                                                                <div className="flex gap-2">
                                                                    <Select
                                                                        value={newResource.type}
                                                                        onValueChange={(value: any) => setNewResource({
                                                                            ...newResource,
                                                                            type: value,
                                                                        })}
                                                                    >
                                                                        <SelectTrigger className="w-[100px]">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="pdf">PDF</SelectItem>
                                                                            <SelectItem value="video">Vidéo</SelectItem>
                                                                            <SelectItem value="link">Lien</SelectItem>
                                                                            <SelectItem value="document">Document</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>

                                                                    <Input
                                                                        placeholder="Nom de la ressource"
                                                                        value={newResource.name}
                                                                        onChange={(e) => setNewResource({
                                                                            ...newResource,
                                                                            name: e.target.value,
                                                                        })}
                                                                        className="w-[200px]"
                                                                    />

                                                                    <Input
                                                                        type="file"
                                                                        accept={
                                                                            newResource.type === "pdf" ? ".pdf" :
                                                                                newResource.type === "video" ? "video/*" :
                                                                                    newResource.type === "document" ? ".doc,.docx,.txt" :
                                                                                        "*"
                                                                        }
                                                                        onChange={(e) => setNewResource({
                                                                            ...newResource,
                                                                            file: e.target.files?.[0] || null,
                                                                            url: "",
                                                                        })}
                                                                        className="w-[250px]"
                                                                    />

                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => handleAddResource(chapter.id)}
                                                                    >
                                                                        <Plus className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {/* Liste des ressources */}
                                                            {chapter.resources && chapter.resources.length > 0 ? (
                                                                <div className="grid gap-2">
                                                                    {chapter.resources.map((resource) => (
                                                                        <div
                                                                            key={resource.id}
                                                                            className="flex items-center justify-between p-2 border rounded"
                                                                        >
                                                                            <div className="flex items-center gap-3">
                                                                                {resource.type === "pdf" && <FileText className="h-4 w-4" />}
                                                                                {resource.type === "video" && <Video className="h-4 w-4" />}
                                                                                {resource.type === "link" && <LinkIcon className="h-4 w-4" />}
                                                                                <span className="text-sm">{resource.name}</span>
                                                                                {resource.size && (
                                                                                    <span className="text-xs text-muted-foreground">
                                                                                        ({resource.size})
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            <Button variant="ghost" size="sm">
                                                                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                                                                    Ouvrir
                                                                                </a>
                                                                            </Button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <p className="text-sm text-muted-foreground italic">
                                                                    Aucune ressource pour ce chapitre
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {chapters.length === 0 && (
                    <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertDescription>
                            Aucun chapitre pour ce cours. Commencez par en créer un !
                        </AlertDescription>
                    </Alert>
                )}
            </div>
        </div>
    )
}