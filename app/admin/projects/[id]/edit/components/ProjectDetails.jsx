'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
)

export default function ProjectDetails({ 
  formData, 
  setFormData, 
  imageUrl, 
  handleImageUpload, 
  uploading 
}) {
  return (
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
        <Label>Cover Image</Label>
        <div className="space-y-4">
          {imageUrl && (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt="Project cover"
                fill
                className="object-cover"
                placeholder='empty'
                priority={false}
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
    </div>
  )
}
