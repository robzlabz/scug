'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  CalendarDays, 
  ChevronDown,
  ChevronUp,
  Gift,
  ArrowRight
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

// Dummy data
const currentProjectTasks = [
  {
    id: 1,
    title: "Donasi Buku Pelajaran",
    date: "20 December 2024",
    description: "Buku pelajaran untuk kelas 1-6 SD",
    count: 5,
  },
  {
    id: 2,
    title: "Alat Tulis",
    date: "20 December 2024",
    description: "Alat tulis untuk guru mengajar",
    count: 10,
  },
]

const otherProjectTasks = [
  {
    projectId: 2,
    projectTitle: "Bantuan Guru SD Sukamaju",
    tasks: [
      {
        id: 3,
        title: "Seragam Guru",
        date: "25 December 2024",
        description: "Seragam untuk 3 orang guru",
        count: 3,
      },
    ],
  },
  {
    projectId: 3,
    projectTitle: "Bantuan Guru MI Al-Hidayah",
    tasks: [
      {
        id: 4,
        title: "Laptop untuk Mengajar",
        date: "27 December 2024",
        description: "Laptop untuk keperluan mengajar daring",
        count: 1,
      },
    ],
  },
]

export default function TasksList() {
  const router = useRouter()
  const [showOtherProjects, setShowOtherProjects] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const handleTaskSelect = (task) => {
    setSelectedTask(task)
  }

  const handleConfirm = () => {
    if (selectedTask) {
      router.push(`/projects/${selectedTask.id}/confirm`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pilih Task yang Ingin Anda Penuhi</h1>

      {/* Selected Task Info */}
      {selectedTask && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 bg-primary/5 border-primary">
            <h2 className="text-xl font-semibold mb-4">Task yang Dipilih</h2>
            <div className="space-y-2">
              <p className="font-medium">{selectedTask.title}</p>
              <p className="text-muted-foreground">{selectedTask.description}</p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span>Tanggal: {selectedTask.date}</span>
              </div>
            </div>
            <Button onClick={handleConfirm} className="mt-4">
              Konfirmasi Pilihan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </motion.div>
      )}

      {/* Current Project Tasks */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xl font-semibold">Task dari Project Ini</h2>
        {currentProjectTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card
              className="p-6 cursor-pointer hover:border-primary transition-colors"
              onClick={() => handleTaskSelect(task)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-muted-foreground">{task.description}</p>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2">
                    <CalendarDays className="w-4 h-4" />
                    <span>{task.date}</span>
                  </div>
                </div>
                <Gift className="w-5 h-5 text-primary" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Other Projects */}
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setShowOtherProjects(!showOtherProjects)}
        >
          {showOtherProjects ? (
            <ChevronUp className="w-4 h-4 mr-2" />
          ) : (
            <ChevronDown className="w-4 h-4 mr-2" />
          )}
          Lihat Task dari Project Lain
        </Button>

        <AnimatePresence>
          {showOtherProjects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-6"
            >
              {otherProjectTasks.map((project) => (
                <div key={project.projectId}>
                  <h3 className="font-semibold mb-4">{project.projectTitle}</h3>
                  <div className="space-y-4">
                    {project.tasks.map((task) => (
                      <Card
                        key={task.id}
                        className="p-6 cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleTaskSelect(task)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{task.title}</h3>
                            <p className="text-muted-foreground">
                              {task.description}
                            </p>
                            <div className="flex items-center gap-2 text-muted-foreground mt-2">
                              <CalendarDays className="w-4 h-4" />
                              <span>{task.date}</span>
                            </div>
                          </div>
                          <Gift className="w-5 h-5 text-primary" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
