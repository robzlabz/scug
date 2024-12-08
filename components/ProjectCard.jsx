'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock, CheckCircle2, ImageIcon } from "lucide-react"

export default function ProjectCard({ project }) {
  const progressPercentage = project.totalTasks > 0
    ? (project.completedTasks / project.totalTasks) * 100
    : 0
  const remainingTasks = project.totalTasks - project.completedTasks
  const formattedDate = new Date(project.date).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  const isHistory = new Date(project.date) < new Date()

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg mb-2">{project.name}</CardTitle>
          </div>
          {!isHistory && (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/projects/${project.id}`}>
                Detail
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Cover Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
            {project.coverImage ? (
              <Image
                src={project.coverImage}
                alt={project.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-300" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          
          {!isHistory ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress ({project.completedTasks}/{project.totalTasks} tugas)</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                {remainingTasks > 0 ? (
                  <>
                    <Clock className="h-4 w-4 text-gold-500" />
                    <span className="text-muted-foreground">
                      {remainingTasks} tugas belum terisi
                    </span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-primary-500" />
                    <span className="text-muted-foreground">
                      Semua tugas telah terisi
                    </span>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-primary-500" />
              <span className="text-muted-foreground">
                Kegiatan telah selesai
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
