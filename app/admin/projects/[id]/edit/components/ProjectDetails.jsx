'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useEffect } from 'react'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

export default function ProjectDetails({ projectId }) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
  })
  const [loading, setLoading] = useState(true)

  const fetchProject = async () => {
    console.log("fetching project...")
    
    const {data, error} = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      alert(error.message)
      return
    }

    setFormData({
      name: data.name,
      date: data.date,
      description: data.description,
    })

    setLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {error} = await supabase
      .from('projects')
      .update(formData)
      .eq('id', projectId)
      .single()

    if (error) {
      console.error('Error updating project:', error)
      return
    }

    router.push('/admin/projects')
    router.refresh()
  }

  useEffect(() => {
    fetchProject()
  }, [])

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
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
          <Label htmlFor="date">Project Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
      </div>
      <div className="flex gap-4 mt-8">
          <Button type="submit" disabled={loading}>Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/projects')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
    </form>
  )
}
