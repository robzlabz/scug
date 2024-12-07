'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'

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
  const [coverImage, setCoverImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProject()
    fetchProjectImage()
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

  const fetchProjectImage = async () => {
    const { data, error } = await supabase
      .from('project_images')
      .select('url')
      .eq('project_id', resolvedParams.id)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') { // Not found error code
        console.error('Error fetching project image:', error)
      }
      return
    }

    if (data) {
      setImageUrl(data.url)
    }
  }

  const handleImageUpload = async (e) => {
    try {
      setUploading(true)
      
      // Check authentication status
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Only image files are allowed.')
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `project-covers/${fileName}`

      // Upload image to storage
      const { error: uploadError, data } = await supabase.storage
        .from('scug')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error details:', uploadError)
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scug')
        .getPublicUrl(filePath)

      // Delete old image if exists
      if (imageUrl) {
        const oldPath = imageUrl.split('/').pop()
        await supabase.storage
          .from('scug')
          .remove([`project-covers/${oldPath}`])
      }

      // Update or insert into project_images table
      const { error: dbError } = await supabase
        .from('project_images')
        .upsert({
          project_id: resolvedParams.id,
          url: publicUrl
        }, {
          onConflict: 'project_id'
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
          <Label>Cover Image</Label>
          <div className="space-y-4">
            {imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Project cover"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
          </div>
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
          <Button type="submit" disabled={uploading}>Update Project</Button>
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
