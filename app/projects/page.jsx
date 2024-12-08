'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalendarDays, CheckCircle2, Circle, Clock, Image as ImageIcon } from "lucide-react"
import Link from 'next/link'
import Image from 'next/image'
import ProjectCard from '@/components/ProjectCard'

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")
  const [projects, setProjects] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString()

      // Fetch all projects with their tasks and cover images
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_tasks (*),
          project_image (*)
        `)
        .order('date', { ascending: true })
        .is('deleted_at', null)

      if (projectsError) throw projectsError

      // Process projects data
      var processedProjects = projectsData.map(project => {
        // Get tasks
        var tasks = project.project_tasks || []
        var totalTasks = tasks.length
        var completedTasks = tasks.filter(task => task.filled).length

        // Get cover image
        var coverImage = project.project_image?.find(img => img.type === 'cover')

        return {
          ...project,
          totalTasks,
          completedTasks,
          coverImage: coverImage?.url
        }
      })

      // Split into upcoming and history based on date
      const upcomingProjects = processedProjects.filter(
        p => new Date(p.date) >= new Date()
      )
      const historyProjects = processedProjects.filter(
        p => new Date(p.date) < new Date()
      )

      setProjects(upcomingProjects)
      setHistory(historyProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-500">Loading projects...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Proyek</h1>
        <div className="flex gap-2">
          
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming">Akan Datang ({projects.length})</TabsTrigger>
          <TabsTrigger value="history">Riwayat ({history.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada proyek yang akan datang
            </div>
          )}
        </TabsContent>

        <TabsContent value="history">
          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map(project => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Tidak ada riwayat proyek
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
