'use client'

import { useState } from 'react'
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

export default function CreateProject() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { error } = await supabase
      .from('projects')
      .insert(formData)
      .single()

    if (error) {
      console.error('Error creating project:', error)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <div className="p-8 max-w-4xl mx-auto" data-color-mode="light">
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Create New Project</h1>
        <p className="text-gray-500">Create a new project with markdown description.</p>
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
          <Button type="submit">Create Project</Button>
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
