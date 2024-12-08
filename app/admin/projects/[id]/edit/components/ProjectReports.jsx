'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export default function ProjectReports({ projectId }) {
  const [uploading, setUploading] = useState(false)
  const [reports, setReports] = useState([])

  const handleFileUpload = async (e) => {
    try {
      setUploading(true)
      const file = e.target.files[0]
      
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      const filePath = `project-reports/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('scug')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('scug')
        .getPublicUrl(filePath)

      // Save to database
      const { error: dbError } = await supabase
        .from('project_reports')
        .insert({
          project_id: projectId,
          file_url: publicUrl,
          file_name: file.name,
          file_type: file.type
        })

      if (dbError) {
        throw dbError
      }

      // Refresh reports list
      fetchReports()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const fetchReports = async () => {
    const { data, error } = await supabase
      .from('project_reports')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reports:', error)
      return
    }

    setReports(data || [])
  }

  // Fetch reports on component mount
  useState(() => {
    fetchReports()
  }, [])

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Project Reports</h2>
          <div>
            <Input
              type="file"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
              id="report-upload"
            />
            <Label htmlFor="report-upload" className="cursor-pointer">
              <Button as="span" disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Report'}
              </Button>
            </Label>
          </div>
        </div>

        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-gray-600">
                  📄
                </div>
                <div>
                  <p className="font-medium">{report.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <a
                href={report.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600"
              >
                Download
              </a>
            </div>
          ))}
          {reports.length === 0 && (
            <p className="text-center text-gray-500 py-8">No reports uploaded yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
