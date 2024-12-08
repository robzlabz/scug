'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  CalendarDays, 
  Gift,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'

export default function TaskConfirmation({ params }) {
  const projectId = use(params).id
  const taskId = use(params).taskid
  const router = useRouter()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  })
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data: taskData, error: taskError } = await supabase
          .from('project_tasks')
          .select(`
            *,
            projects (
              name,
              date
            )
          `)
          .eq('id', taskId)
          .single()

        if (taskError) throw taskError

        setTask({
          id: taskData.id,
          project_id: taskData.project_id,
          title: taskData.task_name,
          date: taskData.projects.date,
          description: taskData.description,
          quantity: taskData.quantity,
          unit: taskData.unit,
          projectName: taskData.projects.name
        })
      } catch (error) {
        console.error('Error fetching task:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId, supabase])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // update project task
      const { error: updateError } = await supabase
        .from('project_tasks')
        .update({
          filled: true,
          filled_at: new Date().toISOString(),
          name: formData.name,
          phone: formData.phone,
          notes: formData.notes
        })
        .eq('id', taskId)

      if (updateError) throw updateError
      // Redirect to success page
      router.push(`/projects/${projectId}`)
    } catch (error) {
      console.error('Error submitting task:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={`/projects/${projectId}/tasks`}
        className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Daftar Task
      </Link>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Konfirmasi Task</h1>

        {/* Task Info Card */}
        <Card className="p-6 mb-8 bg-primary/5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">{task.title}</h2>
              <p className="text-muted-foreground mb-4">{task.description}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>Tanggal: {new Date(task.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4" />
                  <span>Dibutuhkan: {task.quantity} {task.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Confirmation Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Masukkan nama lengkap Anda"
              />
            </div>

            <div>
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="Contoh: 08123456789"
                type="tel"
              />
            </div>

            <div>
              <Label htmlFor="notes">Catatan (opsional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Tambahkan catatan jika diperlukan"
                rows={4}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={submitting}
          >
            {submitting ? (
              'Memproses...'
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Konfirmasi Task
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
