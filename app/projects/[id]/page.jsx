'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  CalendarDays, 
  Users, 
  Heart,
  ChevronLeft,
  ChevronRight,
  Gift,
  Wallet
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'

// Dummy data
const projectData = {
  id: 1,
  title: "Bantuan untuk Guru di Pelosok",
  date: "20 December 2024",
  location: "Desa Sukamaju, Kab. Bandung",
  description: "Program bantuan untuk guru-guru yang mengajar di daerah pelosok dengan kondisi sekolah yang membutuhkan perhatian khusus.",
  images: [
    "/dummy1.jpg",
    "/dummy2.jpg",
    "/dummy3.jpg"
  ],
  participants: [
    { name: "Ahmad Sudirman", phone: "08123456789" },
    { name: "Siti Aminah", phone: "08234567890" },
  ],
  tasks: [
    { id: 1, title: "Donasi Buku Pelajaran", status: "available", count: 5 },
    { id: 2, title: "Alat Tulis", status: "available", count: 10 },
    { id: 3, title: "Seragam Guru", status: "completed", count: 2 },
  ],
  reports: [
    { date: "2024-12-05", content: "Survei lokasi telah dilakukan" },
    { date: "2024-12-06", content: "Koordinasi dengan kepala sekolah" },
  ],
  quote: "Setiap bantuan kecil membawa perubahan besar bagi mereka yang membutuhkan."
}

export default function ProjectDetail({id}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projectData.images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projectData.images.length) % projectData.images.length)
  }

  const maskPhone = (phone) => {
    return phone.replace(/(\d{4})\d{4}(\d{3})/, '$1****$2')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - 3/5 width */}
        <div className="lg:w-3/5">
          {/* Image Slider */}
          <div className="relative aspect-video mb-8 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src={projectData.images[currentSlide]}
                alt={`Slide ${currentSlide + 1}`}
                className="object-cover w-full h-full"
              />
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <CalendarDays className="w-5 h-5" />
              <span>{projectData.date}</span>
              <Users className="w-5 h-5 ml-4" />
              <span>{projectData.location}</span>
            </div>

            <div className="prose max-w-none">
              <h1 className="text-3xl font-bold mb-4">{projectData.title}</h1>
              <p>{projectData.description}</p>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reports" className="mt-8">
              <TabsList>
                <TabsTrigger value="reports">Laporan Kegiatan</TabsTrigger>
                <TabsTrigger value="participants">Partisipan</TabsTrigger>
                <TabsTrigger value="quote">Kata Hari Ini</TabsTrigger>
              </TabsList>

              <TabsContent value="reports">
                <Card className="p-6">
                  {projectData.reports.map((report, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="font-semibold">{report.date}</div>
                      <div className="text-muted-foreground">{report.content}</div>
                    </div>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="participants">
                <Card className="p-6">
                  {projectData.participants.map((participant, idx) => (
                    <div key={idx} className="mb-4 last:mb-0">
                      <div className="font-semibold">{participant.name}</div>
                      <div className="text-muted-foreground">{maskPhone(participant.phone)}</div>
                    </div>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="quote">
                <Card className="p-6">
                  <blockquote className="italic text-lg">
                    &quot;{projectData.quote}&quot;
                  </blockquote>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Side - 2/5 width */}
        <div className="lg:w-2/5">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Daftar Task</h2>
            <div className="space-y-4">
              {projectData.tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    task.status === "completed" ? "bg-muted" : "bg-card"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Dibutuhkan: {task.count} item
                      </p>
                    </div>
                    {task.status === "available" && (
                      <Button size="sm" asChild>
                        <Link href={`/projects/1/confirm`} className="flex items-center">
                          <Gift className="w-4 h-4 mr-2" />
                          <span>Penuhi Task</span>
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <Button className="w-full mb-3" size="lg" variant="secondary">
                <Wallet className="w-5 h-5 mr-2" />
                Tambah Dana
              </Button>
              <Button className="w-full" size="lg" asChild>
                <Link href={`/projects/${id}/tasks`}>
                  Pilih Task
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Mobile Action Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t">
        <div className="flex gap-4">
          <Button className="flex-1" variant="secondary">
            <Wallet className="w-4 h-4 mr-2" />
            Tambah Dana
          </Button>
          <Button className="flex-1">
            <Link href={`/projects/1/tasks`}>
            <div className="flex-1">
            <Gift className="w-4 h-4 mr-2" />
            Penuhi Task
            </div>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
