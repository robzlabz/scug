'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectDetails from './components/ProjectDetails'
import ProjectTasks from './components/ProjectTasks'
import ProjectReports from './components/ProjectReports'
import ProjectMembers from './components/ProjectMembers'

export default function EditProject({params}) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
  })
  const [coverImage, setCoverImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetchProject()
    fetchProjectImage()
    fetchTasks()
  }, [])

  const fetchProject = async () => {
    const {data, error} = await supabase
      .from('projects')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      router.push('/admin/projects')
      return
    }

    setFormData({
      name: data.name,
      description: data.description,
    })
    setLoading(false)
  }

  const fetchProjectImage = async () => {
    const {data, error} = await supabase
      .from('project_image')
      .select('url')
      .eq('project_id', resolvedParams.id)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        console.error('Error fetching project image:', error)
      }
      return
    }

    if (data) {
      setImageUrl(data.url)
    }
  }

  const fetchTasks = async () => {
    const {data, error} = await supabase
      .from('project_tasks')
      .select('*')
      .eq('project_id', resolvedParams.id)
    
    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }
    
    setTasks(data || [])
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)

      const {data: {session}} = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.')
        throw new Error('Only image files are allowed.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `project-covers/${fileName}`

      const {error: uploadError} = await supabase.storage
        .from('scug')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        throw uploadError
      }

      const {data: {publicUrl}} = supabase.storage
        .from('scug')
        .getPublicUrl(filePath)

      if (imageUrl) {
        const oldPath = imageUrl.split('/').pop()
        await supabase.storage
          .from('scug')
          .remove([`project-covers/${oldPath}`])
      }

      const {error: deleteError} = await supabase
        .from('project_image')
        .delete()
        .eq('project_id', resolvedParams.id)

      if (deleteError) {
        throw deleteError
      }

      const {error: dbError} = await supabase
        .from('project_image')
        .insert({
          project_id: resolvedParams.id,
          url: publicUrl
        })

      if (dbError) {
        throw dbError
      }

      setImageUrl(publicUrl)
      setCoverImage(null)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleAddTask = async (taskName) => {
    const {error} = await supabase
      .from('project_tasks')
      .insert({
        project_id: resolvedParams.id,
        name: taskName,
        status: 'pending'
      })

    if (error) {
      console.error('Error adding task:', error)
      return
    }

    fetchTasks()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {error} = await supabase
      .from('projects')
      .update(formData)
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  if (loading) {
    return (
      <div className="p-8">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto" data-color-mode="light">
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-gray-500">Manage your project details, tasks, reports, and team members.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <ProjectDetails
              formData={formData}
              setFormData={setFormData}
              imageUrl={imageUrl}
              handleImageUpload={handleImageUpload}
              uploading={uploading}
            />
          </TabsContent>

          <TabsContent value="tasks">
            <ProjectTasks
              tasks={tasks}
              onAddTask={handleAddTask}
            />
          </TabsContent>

          <TabsContent value="reports">
            <ProjectReports projectId={resolvedParams.id} />
          </TabsContent>

          <TabsContent value="members">
            <ProjectMembers projectId={resolvedParams.id} />
          </TabsContent>
        </Tabs>

        <div className="flex gap-4 mt-8">
          <Button type="submit" disabled={uploading}>Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/projects')}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
