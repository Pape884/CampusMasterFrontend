import { Card } from "@/components/ui/card"
import { UserPlus, FileEdit, Trash2, Settings } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "user",
    action: "Nouvel utilisateur ajouté",
    user: "Marie Dubois",
    time: "Il y a 5 min",
    icon: UserPlus,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "edit",
    action: "Cours modifié",
    user: "Dr. Laurent",
    time: "Il y a 23 min",
    icon: FileEdit,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "delete",
    action: "Utilisateur supprimé",
    user: "Admin",
    time: "Il y a 1h",
    icon: Trash2,
    color: "text-red-600",
  },
  {
    id: 4,
    type: "settings",
    action: "Paramètres modifiés",
    user: "Admin",
    time: "Il y a 2h",
    icon: Settings,
    color: "text-orange-600",
  },
  {
    id: 5,
    type: "user",
    action: "Nouveau département",
    user: "Dr. Sophie Laurent",
    time: "Il y a 3h",
    icon: UserPlus,
    color: "text-green-600",
  },
]

export function RecentActivities() {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Activités récentes</h3>
          <p className="text-sm text-muted-foreground">Dernières actions sur la plateforme</p>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`p-2 rounded-lg bg-muted ${activity.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.user}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
