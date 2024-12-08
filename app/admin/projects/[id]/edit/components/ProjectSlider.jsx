'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import {
  DragDropContext,
  Droppable,
  Draggable
} from '@hello-pangea/dnd'

export default function ProjectSlider({ projectId }) {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchSliderImages()
  }, [])

  const fetchSliderImages = async () => {
    const { data, error } = await supabase
      .from('project_slider_images')
      .select('*')
      .eq('project_id', projectId)
      .order('order_index')

    if (error) {
      console.error('Error fetching slider images:', error)
      return
    }

    setImages(data || [])
  }

  const handleImageUpload = async (e) => {
    try {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Project Image Slider</h2>
          <p className="text-sm text-gray-500">
            Drag and drop to reorder images. Add captions to describe each image.
          </p>
        </div>
        <div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            multiple
            className="hidden"
            id="slider-upload"
          />
          <label htmlFor="slider-upload">
            <Button as="span" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Add Images'}
            </Button>
          </label>
        </div>
      </div>

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
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border"
                    >
                      <div {...provided.dragHandleProps} className="cursor-move">
                        ⋮
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
                        <Input
                          value={image.caption}
                          onChange={(e) => handleCaptionChange(image.id, e.target.value)}
                          placeholder="Add a caption for this image..."
                          className="mb-2"
                        />
                        <p className="text-sm text-gray-500">
                          Order: {index + 1}
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteImage(image.id, image.image_url)}
                      >
                        Delete
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

      {images.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-gray-500">No images in the slider yet</p>
          <p className="text-sm text-gray-400">
            Click "Add Images" to upload some images
          </p>
        </div>
      )}
    </div>
  )
}
