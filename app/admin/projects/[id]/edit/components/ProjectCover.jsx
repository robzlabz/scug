'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Upload } from 'lucide-react'

export default function ProjectCover({ projectId }) {
  const [dragActive, setDragActive] = useState(false)
  const [coverImage, setCoverImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload({ target: { files: [e.dataTransfer.files[0]] } })
    }
  }

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      setUploading(true)

      const {data: {session}} = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to upload images')
      }

      const file = e.target.files[0]

      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed.')
        throw new Error('Only image files are allowed.')
      }

      // Show preview immediately
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverImage(e.target.result)
      }
      reader.readAsDataURL(file)

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
        .eq('project_id', projectId)

      if (deleteError) {
        throw deleteError
      }

      const {error: dbError} = await supabase
        .from('project_image')
        .insert({
          project_id: projectId,
          url: publicUrl
        })

      if (dbError) {
        throw dbError
      }

      setImageUrl(publicUrl)
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error.message)
      setCoverImage(null)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const fetchProjectImage = async () => {
    const {data, error} = await supabase
      .from('project_image')
      .select('url')
      .eq('project_id', projectId)
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

  useEffect(() => {
    fetchProjectImage()
  }, [])

  const displayImage = coverImage || imageUrl

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Project Cover Image</h2>
        <p className="text-gray-500">Upload or drag and drop your project cover image here.</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
        style={{ cursor: 'pointer' }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={uploading}
          className="hidden"
          id="cover-upload"
        />

        <div className="p-8">
          {displayImage ? (
            <div className="space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image
                  src={displayImage}
                  alt="Project cover"
                  fill
                  className="object-cover"
                  placeholder='empty'
                  priority={false}
                />
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  disabled={uploading}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleButtonClick()
                  }}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Uploading...' : 'Change Cover Image'}
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-12">
              <div className="flex justify-center">
                <Upload className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium">
                  {uploading ? 'Uploading...' : 'Click or drag and drop to upload'}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  SVG, PNG, JPG or GIF (max. 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Image Guidelines:</h3>
        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
          <li>Recommended size: 1920x1080 pixels (16:9 aspect ratio)</li>
          <li>Maximum file size: 5MB</li>
          <li>Supported formats: JPG, PNG, GIF, SVG</li>
          <li>Use high-quality images for best results</li>
        </ul>
      </div>
    </div>
  )
}
