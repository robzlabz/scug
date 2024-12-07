'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from 'next/navigation'

export default function AdminProjects() {
  const router = useRouter()
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
      return
    }

    setProjects(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (selectedProject) {
      const { error } = await supabase
        .from('projects')
        .update(formData)
        .eq('id', selectedProject.id)

      if (error) {
        console.error('Error updating project:', error)
        return
      }
    } else {
      console.log(formData)
      const { error } = await supabase
        .from('projects')
        .insert(formData)

      if (error) {
        console.error('Error creating project:', error)
        return
      }
    }

    setFormData({ name: '', description: '' })
    setSelectedProject(null)
    fetchProjects()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      return
    }

    fetchProjects()
  }

  return (
    <div className="p-8">
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-500">Manage your organization's projects and their tasks.</p>
      </div>

      <div className="mb-6">
        <Button onClick={() => router.push('/admin/projects/create')}>
          Add New Project
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.name}</TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/projects/${project.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.location.href = `/admin/projects/${project.id}/tasks`}
                    >
                      Tasks
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
