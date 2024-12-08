'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd'
import { Upload, Pencil, Trash2, GripVertical } from 'lucide-react'

export default function ProjectSlider({ projectId }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    const { data, error } = await supabase
      .from('project_slider_images')
      .select('*')
      .eq('project_id', projectId)
      .eq('type', 'slider')
      .order('order_index')

    if (error) {
      console.error('Error fetching slider images:', error)
      return
    }

    setImages(data || [])
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      await handleImageUpload({ target: { files } })
    }
  }

  const handleImageUpload = async (e) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return
      }

      setUploading(true)
      const files = Array.from(e.target.files)
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert('Only image files are allowed')
          continue
        }

        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `project-sliders/${fileName}`

        // Upload image to storage
        const { error: uploadError } = await supabase.storage
          .from('scug')
          .upload(filePath, file, {
            contentType: file.type,
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('scug')
          .getPublicUrl(filePath)

        // Get the current highest order index
        const maxOrderIndex = images.length > 0 
          ? Math.max(...images.map(img => img.order_index))
          : -1

        // Save to database
        const { error: dbError } = await supabase
          .from('project_slider_images')
          .insert({
            project_id: projectId,
            image_url: publicUrl,
            order_index: maxOrderIndex + 1,
            type: 'slider',
            caption: ''
          })

        if (dbError) {
          throw dbError
        }
      }

      // Refresh images list
      fetchSliderImages()
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Error uploading images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const items = Array.from(images)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update the order_index for all items
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }))

    setImages(updatedItems)

    // Update the database
    for (const item of updatedItems) {
      const { error } = await supabase
        .from('project_slider_images')
        .update({ order_index: item.order_index })
        .eq('id', item.id)

      if (error) {
        console.error('Error updating image order:', error)
      }
    }
  }

  const handleDeleteImage = async (imageId, imageUrl) => {
    try {
      if (!confirm('Are you sure you want to delete this image?')) return

      // Delete from storage
      const filePath = imageUrl.split('/').pop()
      await supabase.storage
        .from('scug')
        .remove([`project-sliders/${filePath}`])

      // Delete from database
      const { error } = await supabase
        .from('project_slider_images')
        .delete()
        .eq('id', imageId)

      if (error) throw error

      // Refresh images list
      fetchSliderImages()
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Error deleting image')
    }
  }

  const handleCaptionChange = async (imageId, newCaption) => {
    try {
      const { error } = await supabase
        .from('project_slider_images')
        .update({ caption: newCaption })
        .eq('id', imageId)

      if (error) throw error

      setImages(images.map(img => 
        img.id === imageId ? { ...img, caption: newCaption } : img
      ))
    } catch (error) {
      console.error('Error updating caption:', error)
      alert('Error updating caption')
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Project Image Slider</h2>
          <p className="text-sm text-gray-500">
            Drag and drop to reorder images. Add captions to describe each image.
          </p>
        </div>
      </div>

      {/* Upload Area */}
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
          multiple
          className="hidden"
        />

        <div className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Upload className="w-12 h-12 text-gray-400" />
          </div>
          <div>
            <p className="text-lg font-medium">
              {uploading ? 'Uploading...' : 'Click or drag and drop to upload images'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              You can select multiple images
            </p>
          </div>
        </div>
      </div>

      {/* Images List */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slider-images">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {images.map((image, index) => (
                <Draggable
                  key={image.id}
                  draggableId={image.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border group hover:border-blue-200 transition-colors"
                    >
                      <div 
                        {...provided.dragHandleProps}
                        className="cursor-move flex items-center text-gray-400 hover:text-gray-600"
                      >
                        <GripVertical className="w-5 h-5" />
                      </div>
                      <div className="relative w-40 h-24 rounded-md overflow-hidden">
                        <Image
                          src={image.image_url}
                          alt={image.caption || 'Slider image'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <input
                          value={image.caption || ''}
                          onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                          placeholder="Add a caption for this image..."
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          Position: {index + 1}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteImage(image.id, image.image_url)}
                        className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {images.length === 0 && !uploading && (
        <div className="text-center py-8 text-gray-500">
          No images in the slider yet
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-sm font-medium mb-2">Image Guidelines:</h3>
        <ul className="text-sm text-gray-500 list-disc pl-5 space-y-1">
          <li>Recommended size: 1920x1080 pixels (16:9 aspect ratio)</li>
          <li>Maximum file size: 5MB per image</li>
          <li>Supported formats: JPG, PNG, GIF, SVG</li>
          <li>You can upload multiple images at once</li>
          <li>Drag and drop to reorder images</li>
        </ul>
      </div>
    </div>
  )
}
