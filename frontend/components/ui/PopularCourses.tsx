// components/ui/PopularCourses.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Clock } from "lucide-react"

interface PopularCoursesProps {
  courses?: Array<{
    title: string
    students: number
    progress: number
  }>
  classes?: Array<{
    course: string
    time: string
    room: string
    students: number
  }>
  assignments?: Array<{
    title: string
    course: string
    due: string
    urgent: boolean
  }>
  title: string
  description: string
  type?: "admin" | "teacher" | "student"
}

const PopularCourses = ({ courses, classes, assignments, title, description, type }: PopularCoursesProps) => {
  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {type === "admin" && courses?.map((course, i) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{course.title}</p>
                    <p className="text-xs text-gray-600">{course.students} étudiants</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-primary">{course.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          ))}

          {type === "teacher" && classes?.map((schedule, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{schedule.course}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{schedule.time}</span>
                    <span>•</span>
                    <span>{schedule.room}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{schedule.students} étudiants</p>
                </div>
              </div>
            </div>
          ))}

          {type === "student" && assignments?.map((assignment, i) => (
            <div
              key={i}
              className="p-4 rounded-lg border border-gray-200 hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{assignment.title}</p>
                  <p className="text-sm text-gray-600">{assignment.course}</p>
                </div>
                {assignment.urgent && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">Urgent</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {assignment.due}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default PopularCourses