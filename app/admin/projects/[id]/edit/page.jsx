'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import dynamic from 'next/dynamic'

// Import Markdown editor with dynamic import to avoid SSR issues
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

export default function EditProject({ params }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  useEffect(() => {
    fetchProject()
  }, [])

  const fetchProject = async () => {
    const { data, error } = await supabase
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { error } = await supabase
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
        <p className="text-gray-500">Edit your project details using markdown for the description.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Description (Markdown)</Label>
          <MDEditor
            value={formData.description}
            onChange={(value) => setFormData({ ...formData, description: value || '' })}
            preview="edit"
            height={400}
          />
        </div>
        <div className="flex gap-4">
          <Button type="submit">Update Project</Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.push('/admin/projects')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
