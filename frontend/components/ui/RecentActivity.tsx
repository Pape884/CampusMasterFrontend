// components/ui/RecentActivity.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Clock, BookOpen } from "lucide-react"

interface RecentActivityProps {
  activities?: Array<{
    user: string
    action: string
    time: string
    color: string
  }>
  assignments?: Array<{
    title: string
    course: string
    due: string
    count?: number
  }>
  courses?: Array<{
    title: string
    progress: number
    time: string
  }>
  title: string
  description: string
  type?: "admin" | "teacher" | "student"
}

const RecentActivity = ({ activities, assignments, courses, title, description, type }: RecentActivityProps) => {
  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "admin" && activities?.map((activity, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Avatar className="w-10 h-10">
                <AvatarFallback className={activity.color}>
                  {activity.user.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{activity.user}</p>
                <p className="text-sm text-gray-600">{activity.action}</p>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}

          {type === "teacher" && assignments?.map((assignment, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-sm text-gray-600">{assignment.course}</p>
                </div>
                {assignment.count && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
                    {assignment.count}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {assignment.due}
              </div>
            </div>
          ))}

          {type === "student" && courses?.map((course, i) => (
            <div key={i} className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{course.title}</p>
                  <p className="text-sm text-gray-600">{course.time}</p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-medium text-primary">{course.progress}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default RecentActivity