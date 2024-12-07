'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'

export default function ConfirmTask() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [isChecked, setIsChecked] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    router.push(`/projects/thankyou`)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className="mb-4 bg-amber-50 border-2 border-amber-200 rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-2 text-amber-800">Task yang Dipilih:</h2>
        <div className="bg-white p-3 rounded-md border border-amber-300">
          <p className="text-gray-800 font-bold text-lg">65 Snack</p>
          <p className="text-sm text-gray-600">Tanggal: <span className="font-bold">Rabu, 22 November 2024</span></p>
        </div>
      </div>

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

          <div className="items-top flex space-x-2">
            <Checkbox id="terms1" checked={isChecked} onCheckedChange={setIsChecked} />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="terms1"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Display my name and phone number
              </label>
              <p className="text-sm text-muted-foreground">
                By checking this box, you agree to share your name and phone number with the contributor.
              </p>
            </div>
          </div>


          <Button type="submit" className="w-full">
            Kirim Data
          </Button>



        </form>
      </Card>
    </div>
  )
}
