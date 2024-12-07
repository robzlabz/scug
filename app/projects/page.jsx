'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CheckCircle2, Circle, Clock } from "lucide-react"
import Link from 'next/link'

// Dummy data for demonstration
const dummyProjects = [
  {
    id: 1,
    name: "Berbagi Rabu Minggu 1",
    description: "Kegiatan berbagi untuk guru di minggu pertama",
    totalTasks: 10,
    completedTasks: 7,
    date: "2024-01-10",
    status: "upcoming"
  },
  {
    id: 2,
    name: "Berbagi Rabu Minggu 2",
    description: "Kegiatan berbagi untuk guru di minggu kedua",
    totalTasks: 8,
    completedTasks: 3,
    date: "2024-01-17",
    status: "upcoming"
  },
  {
    id: 3,
    name: "Berbagi Rabu Minggu 3",
    description: "Kegiatan berbagi untuk guru di minggu ketiga",
    totalTasks: 12,
    completedTasks: 0,
    date: "2024-01-24",
    status: "upcoming"
  }
]

const dummyHistory = [
  {
    id: 4,
    name: "Berbagi Rabu Desember Minggu 1",
    description: "Kegiatan berbagi untuk guru di minggu pertama Desember",
    totalTasks: 10,
    completedTasks: 10,
    date: "2023-12-06",
    status: "completed"
  },
  {
    id: 5,
    name: "Berbagi Rabu November Minggu 4",
    description: "Kegiatan berbagi untuk guru di minggu keempat November",
    totalTasks: 8,
    completedTasks: 8,
    date: "2023-11-29",
    status: "completed"
  }
]

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [projects, setProjects] = useState(dummyProjects)
  const [history, setHistory] = useState(dummyHistory)

  const ProjectCard = ({ project }) => {
    const progressPercentage = (project.completedTasks / project.totalTasks) * 100
    const remainingTasks = project.totalTasks - project.completedTasks
    const formattedDate = new Date(project.date).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    return (
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </div>
            {project.status === 'upcoming' && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/projects/${project.id}`}>
                  Detail
                </Link>
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            
            {project.status === 'upcoming' ? (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress ({project.completedTasks}/{project.totalTasks} tugas)</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  {remainingTasks > 0 ? (
                    <>
                      <Clock className="h-4 w-4 text-gold-500" />
                      <span className="text-muted-foreground">
                        {remainingTasks} tugas belum terisi
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-primary-500" />
                      <span className="text-muted-foreground">
                        Semua tugas telah terisi
                      </span>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary-500" />
                <span className="text-muted-foreground">
                  Kegiatan telah selesai
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Proyek</h1>
        <div className="flex gap-2">
          <Button variant="outline">Filter</Button>
          <Button>Tambah Proyek</Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Akan Datang</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
