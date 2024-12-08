'use client'

import { useEffect, useState } from 'react'
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
  Wallet,
  ImageIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Empty cover SVG
const EmptyCoverSVG = () => (
  <div className="w-full h-full flex items-center justify-center bg-gray-100">
    <ImageIcon className="w-12 h-12 text-gray-400" />
  </div>
)

export default function ProjectDetail({ params }) {
  const [project, setProject] = useState(null)
  const [sliderImages, setSliderImages] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch project details
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select(`
            *,
            project_tasks (*),
            project_reports (
              *,
              project_image (*)
            )
          `)
          .eq('id', params.id)
          .single()

        if (projectError) throw projectError

        // Fetch slider images
        const { data: sliderImagesData, error: sliderError } = await supabase
          .from('project_slider_images')
          .select('*')
          .eq('project_id', params.id)
          .order('created_at', { ascending: true })

        if (sliderError) throw sliderError

        // Process reports with their images
        const processedReports = projectData.project_reports?.map(report => ({
          ...report,
          images: report.project_image
        }))

        setProject({
          ...projectData,
          reports: processedReports
        })
        setSliderImages(sliderImagesData || [])
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProjectData()
    }
  }, [params.id, supabase])

  const nextSlide = () => {
    if (!sliderImages?.length) return
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
  }

  const prevSlide = () => {
    if (!sliderImages?.length) return
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!project) {
    return <div>Project not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side - 3/5 width */}
        <div className="lg:w-3/5">
          {/* Image Slider */}
          <div className="relative aspect-video mb-8 bg-gray-100 rounded-lg overflow-hidden">
            {sliderImages.length > 0 ? (
              <>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={sliderImages[currentSlide].image_url}
                    alt={`Slide ${currentSlide + 1}`}
                    fill
                    className="object-cover"
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
              </>
            ) : (
              <EmptyCoverSVG />
            )}
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-muted-foreground">
              <CalendarDays className="w-5 h-5" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
              <Users className="w-5 h-5 ml-4" />
              <span>{project.location}</span>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="reports" className="mt-8">
              <TabsList>
                <TabsTrigger value="info">Project Info</TabsTrigger>
                <TabsTrigger value="reports">Laporan Kegiatan</TabsTrigger>
                <TabsTrigger value="quote">Kata Hari Ini</TabsTrigger>
              </TabsList>

              <TabsContent value="reports">
                <Card className="p-6">
                  {project.reports?.map((report) => (
                    <div key={report.id} className="mb-6 last:mb-0">
                      <div className="mb-2">
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="mb-4">{report.content}</p>
                      {report.images?.length > 0 && (
                        <div className="grid grid-cols-2 gap-2">
                          {report.images.map((image) => (
                            <div key={image.id} className="relative aspect-video">
                              <Image
                                src={image.url}
                                alt={report.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </Card>
              </TabsContent>

              <TabsContent value="info">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About Project</h3>
                      <p className="text-muted-foreground">{project.description}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Location</h3>
                      <p className="text-muted-foreground">{project.location}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="quote">
                <Card className="p-6">
                  <blockquote className="italic text-lg">
                    &quot;{project.quote || 'Setiap bantuan kecil membawa perubahan besar bagi mereka yang membutuhkan.'}&quot;
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
              {project.project_tasks?.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "p-4 rounded-lg border",
                    task.filled ? "bg-muted" : "bg-card"
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">{task.task_name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Dibutuhkan: {task.quantity} {task.unit}
                      </p>
                    </div>
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
                <Link href={`/projects/${params.id}/tasks`}>
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
          <Button className="flex-1" asChild>
            <Link href={`/projects/${params.id}/tasks`}>
              <div className="flex items-center justify-center">
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
