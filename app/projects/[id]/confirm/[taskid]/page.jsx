'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { use } from 'react'
import { supabase } from '@/lib/supabase'

export default function ConfirmTask({params}) {
  //get taskid from params
  const taskId = use(params).taskid
  const projectId = use(params).id

  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [isChecked, setIsChecked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [task, setTask] = useState(null)

  const handleSubmit = async (e) => {
    // cek apakah member sudah terdaftar
    var { data, error } = await supabase.from("members")
      .select("*")
      .eq("phone", formData.phone)
      .single()

    if (error) throw error

    // jika belum terdaftar, buat member baru
    if (!data) {
      var { data } = await supabase.from("members")
        .insert({
          name: formData.name,
          phone: formData.phone,
          created_at: new Date().toISOString(),
        })
        .single()
    }

    const { error: taskError } = await supabase.from("project_tasks")
      .update({
        filled: true,
        filled_by_member_id: data.id,
      })
      .eq("id", taskId)
      .eq("project_id", projectId)
      .single()

    if (taskError) throw taskError

    e.preventDefault()
    router.push(`/projects/thankyou`)
  }

  useEffect(() => {
    const fetchTask = async () => {
      const {data, error} = await supabase.from("project_tasks")
        .select("*")
        .eq("id", taskId)
        .eq("project_id", projectId)
        .single()

        if (error) throw error

        if (data) {
          setTask(data)
        }

        setLoading(false)
    }
    fetchTask()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <p className="text-lg text-amber-800">Loading...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      {task && (
        <div className="mb-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2 text-amber-800">Task yang Dipilih:</h2>
          <div className="bg-white p-3 rounded-md border border-amber-300">
            <p className="text-gray-800 font-bold text-lg">{task.task_name}</p>
            <p className="text-gray-600 text-sm">Jumlah {task.quantity} {task.unit}</p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Konfirmasi Data Diri</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Masukkan nama lengkap Anda"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Handphone</Label>
            <Input
              id="phone"
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Contoh: 08123456789"
            />
          </div>

          <Button type="submit" className="w-full">
            Kirim Data
          </Button>
        </form>
      </Card>
    </div>
  )
}
