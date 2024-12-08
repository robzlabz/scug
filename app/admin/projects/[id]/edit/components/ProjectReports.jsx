'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'
import { Upload, Pencil, Trash2, X } from 'lucide-react'

export default function ProjectReports({ projectId }) {
  const [uploading, setUploading] = useState(false)
  const [reports, setReports] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    images: []
  })
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      // Fetch reports
      const { data: reportsData, error: reportsError } = await supabase
        .from('project_reports')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })

      if (reportsError) throw reportsError

      // Fetch images for each report
      const reportsWithImages = await Promise.all(
        reportsData.map(async (report) => {
          const { data: imagesData } = await supabase
            .from('project_image')
            .select('*')
            .eq('project_id', projectId)
            .eq('report_id', report.id)
            .eq('type', 'report')

          return {
            ...report,
            images: imagesData || []
          }
        })
      )

      setReports(reportsWithImages || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
      alert('Error fetching reports')
    }
  }

  const handleImageUpload = async (files) => {
    const uploadedImages = []
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert('Only image files are allowed')
        continue
      }

      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `project-reports/${fileName}`

      try {
        const { error: uploadError } = await supabase.storage
          .from('scug')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('scug')
          .getPublicUrl(filePath)

        uploadedImages.push({
          url: publicUrl,
          name: file.name,
          path: filePath
        })
      } catch (error) {
        console.error('Error uploading image:', error)
        alert(`Error uploading image: ${file.name}`)
      }
    }

    return uploadedImages
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      let reportId = selectedReport?.id

      if (selectedReport) {
        // Update existing report
        const { error: updateError } = await supabase
          .from('project_reports')
          .update({
            title: formData.title,
            content: formData.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', reportId)

        if (updateError) throw updateError
      } else {
        // Create new report
        const { data: reportData, error: createError } = await supabase
          .from('project_reports')
          .insert({
            project_id: projectId,
            title: formData.title,
            content: formData.content
          })
          .select()
          .single()

        if (createError) throw createError
        reportId = reportData.id
      }

      // Handle new images
      if (formData.images.length > 0) {
        const uploadedImages = await handleImageUpload(formData.images)
        
        // Save image references to database
        const imageInserts = uploadedImages.map(img => ({
          project_id: projectId,
          report_id: reportId,
          url: img.url,
          type: 'report'
        }))

        const { error: imageError } = await supabase
          .from('project_image')
          .insert(imageInserts)

        if (imageError) throw imageError
      }

      await fetchReports()
      handleCloseDialog()
    } catch (error) {
      console.error('Error saving report:', error)
      alert('Error saving report')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteReport = async (report) => {
    if (!confirm('Are you sure you want to delete this report?')) return

    try {
      // Delete images from storage
      const storagePromises = report.images.map(image => {
        const filePath = image.url.split('/').pop()
        return supabase.storage
          .from('scug')
          .remove([`project-reports/${filePath}`])
      })
      await Promise.all(storagePromises)

      // Delete image records
      await supabase
        .from('project_image')
        .delete()
        .eq('report_id', report.id)

      // Delete report
      const { error } = await supabase
        .from('project_reports')
        .delete()
        .eq('id', report.id)

      if (error) throw error

      await fetchReports()
    } catch (error) {
      console.error('Error deleting report:', error)
      alert('Error deleting report')
    }
  }

  const handleEditReport = (report) => {
    setSelectedReport(report)
    setFormData({
      title: report.title,
      content: report.content,
      images: []
    })
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedReport(null)
    setFormData({ title: '', content: '', images: [] })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Project Reports</h2>
          <p className="text-sm text-gray-500">
            Create and manage project reports with images
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          Create Report
        </Button>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="p-6 bg-white rounded-lg border hover:border-blue-200 transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{report.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(report.created_at).toLocaleDateString()}
                  {report.updated_at && ' (Updated)'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditReport(report)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteReport(report)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{report.content}</p>
            </div>

            {report.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {report.images.map((image, index) => (
                  <div key={index} className="relative aspect-video">
                    <Image
                      src={image.url}
                      alt={`Report image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No reports yet. Click "Create Report" to add one.
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedReport ? 'Edit Report' : 'Create Report'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter report title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter report content"
                required
                className="min-h-[200px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <Input
                ref={fileInputRef}
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
              />
              <p className="text-sm text-gray-500">
                You can select multiple images
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading}>
                {uploading ? 'Saving...' : (selectedReport ? 'Update' : 'Create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
