"use client"

import { useState } from "react"
import { Search, Download, Eye, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data
const coursesData = [
  {
    id: 1,
    name: "Mathématiques Avancées",
    code: "MATH301",
    students: [
      {
        id: 1,
        name: "Alice Dupont",
        matricule: "MAT001",
        email: "alice.dupont@example.com",
        moyenne: 15.5,
        progression: 85,
        presence: 95,
      },
      {
        id: 2,
        name: "Bob Martin",
        matricule: "MAT002",
        email: "bob.martin@example.com",
        moyenne: 13.2,
        progression: 72,
        presence: 88,
      },
      {
        id: 3,
        name: "Claire Bernard",
        matricule: "MAT003",
        email: "claire.bernard@example.com",
        moyenne: 16.8,
        progression: 92,
        presence: 98,
      },
      {
        id: 4,
        name: "David Laurent",
        matricule: "MAT004",
        email: "david.laurent@example.com",
        moyenne: 12.5,
        progression: 68,
        presence: 82,
      },
      {
        id: 5,
        name: "Emma Rousseau",
        matricule: "MAT005",
        email: "emma.rousseau@example.com",
        moyenne: 14.7,
        progression: 78,
        presence: 90,
      },
    ],
  },
  {
    id: 2,
    name: "Algorithmique et Structures de Données",
    code: "INFO202",
    students: [
      {
        id: 6,
        name: "François Petit",
        matricule: "INF001",
        email: "francois.petit@example.com",
        moyenne: 16.2,
        progression: 88,
        presence: 92,
      },
      {
        id: 7,
        name: "Gabrielle Simon",
        matricule: "INF002",
        email: "gabrielle.simon@example.com",
        moyenne: 15.8,
        progression: 85,
        presence: 95,
      },
      {
        id: 8,
        name: "Hugo Blanc",
        matricule: "INF003",
        email: "hugo.blanc@example.com",
        moyenne: 13.9,
        progression: 75,
        presence: 85,
      },
      {
        id: 9,
        name: "Isabelle Moreau",
        matricule: "INF004",
        email: "isabelle.moreau@example.com",
        moyenne: 17.5,
        progression: 95,
        presence: 100,
      },
    ],
  },
  {
    id: 3,
    name: "Physique Quantique",
    code: "PHYS401",
    students: [
      {
        id: 10,
        name: "Jules Fontaine",
        matricule: "PHY001",
        email: "jules.fontaine@example.com",
        moyenne: 14.3,
        progression: 80,
        presence: 88,
      },
      {
        id: 11,
        name: "Léa Girard",
        matricule: "PHY002",
        email: "lea.girard@example.com",
        moyenne: 15.1,
        progression: 82,
        presence: 91,
      },
      {
        id: 12,
        name: "Marc Leroy",
        matricule: "PHY003",
        email: "marc.leroy@example.com",
        moyenne: 12.8,
        progression: 70,
        presence: 80,
      },
    ],
  },
]

export default function TeacherStudentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [expandedCourses, setExpandedCourses] = useState<number[]>([1])

  const toggleCourse = (courseId: number) => {
    setExpandedCourses((prev) => (prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]))
  }

  const filteredCourses = coursesData.filter((course) => {
    if (selectedCourse !== "all" && course.id.toString() !== selectedCourse) return false

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        course.name.toLowerCase().includes(query) ||
        course.students.some(
          (student) =>
            student.name.toLowerCase().includes(query) ||
            student.matricule.toLowerCase().includes(query) ||
            student.email.toLowerCase().includes(query),
        )
      )
    }
    return true
  })

  const filterStudents = (students: any[]) => {
    if (!searchQuery) return students
    const query = searchQuery.toLowerCase()
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.matricule.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query),
    )
  }

  const totalStudents = filteredCourses.reduce((acc, course) => acc + filterStudents(course.students).length, 0)

  const handleExport = () => {
    console.log("Export students data")
  }

  return (
    <div className="min-h-screen bg-background" style={{ marginLeft: "10px"}}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-muted-foreground">Gérez et suivez vos étudiants par cours</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total étudiants</p>
                <p className="text-3xl font-bold text-foreground">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Cours enseignés</p>
                <p className="text-3xl font-bold text-foreground">{filteredCourses.length}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Présence moyenne</p>
                <p className="text-3xl font-bold text-foreground">89%</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher par nom, matricule ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="Tous les cours" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les cours</SelectItem>
                {coursesData.map((course) => (
                  <SelectItem key={course.id} value={course.id.toString()}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const filteredStudents = filterStudents(course.students)
            if (filteredStudents.length === 0) return null

            const isExpanded = expandedCourses.includes(course.id)

            return (
              <div key={course.id} className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Course Header */}
                <button
                  onClick={() => toggleCourse(course.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg text-foreground">{course.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {course.code} • {filteredStudents.length} étudiants
                      </p>
                    </div>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>

                {/* Students Table */}
                {isExpanded && (
                  <div className="border-t border-border">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-muted/30">
                          <tr>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Étudiant</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Matricule</th>
                            <th className="text-left p-4 text-sm font-medium text-muted-foreground">Email</th>
                            <th className="text-center p-4 text-sm font-medium text-muted-foreground">Moyenne</th>
                            <th className="text-center p-4 text-sm font-medium text-muted-foreground">Progression</th>
                            <th className="text-center p-4 text-sm font-medium text-muted-foreground">Présence</th>
                            <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-semibold text-primary">
                                      {student.name
                                        .split(" ")
                                        .map((n:any) => n[0])
                                        .join("")}
                                    </span>
                                  </div>
                                  <span className="font-medium text-foreground">{student.name}</span>
                                </div>
                              </td>
                              <td className="p-4 text-muted-foreground">{student.matricule}</td>
                              <td className="p-4 text-muted-foreground">{student.email}</td>
                              <td className="p-4 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                    student.moyenne >= 15
                                      ? "bg-green-100 text-green-800"
                                      : student.moyenne >= 12
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.moyenne.toFixed(1)}/20
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="w-full max-w-[100px] bg-muted rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all"
                                      style={{ width: `${student.progression}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-muted-foreground">{student.progression}%</span>
                                </div>
                              </td>
                              <td className="p-4 text-center">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${
                                    student.presence >= 90
                                      ? "bg-green-100 text-green-800"
                                      : student.presence >= 75
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {student.presence}%
                                </span>
                              </td>
                              <td className="p-4">
                                <div className="flex justify-center">
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">Aucun cours trouvé</p>
          </div>
        )}
      </div>
    </div>
  )
}
