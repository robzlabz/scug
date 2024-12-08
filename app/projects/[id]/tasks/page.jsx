'use client'

import { useState, useEffect } from 'react'
import { use } from 'react'
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function TasksList({ params }) {
  const projectId = use(params).id
  const router = useRouter()
  const [showOtherProjects, setShowOtherProjects] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [currentProjectTasks, setCurrentProjectTasks] = useState([])
  const [otherProjectTasks, setOtherProjectTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  console.log({projectId})

  const fetchTasks = async () => {
    try {
      // Fetch current project tasks
      const { data: currentTasks, error: currentError } = await supabase
        .from('project_tasks')
        .select(`
          *,
          projects (
            name,
            date
          )
        `)
        .eq('project_id', projectId)
        .eq('filled', false)

      if (currentError) throw currentError

      // Fetch other projects' tasks
      const { data: otherTasks, error: otherError } = await supabase
        .from('project_tasks')
        .select(`
          *,
          projects (
            id,
            name,
            date
          )
        `)
        .neq('project_id', projectId)
        .eq('filled', false)
        .order('created_at', { ascending: false })

      if (otherError) throw otherError

      // Process current project tasks
      const processedCurrentTasks = currentTasks.map(task => ({
        id: task.id,
        project_id: task.project_id,
        title: task.task_name,
        date: task.projects.date,
        description: task.description,
        quantity: task.quantity,
        unit: task.unit
      }))

      // Group other tasks by project
      const groupedOtherTasks = otherTasks.reduce((acc, task) => {
        const projectId = task.projects.id
        if (!acc[projectId]) {
          acc[projectId] = {
            projectId,
            projectTitle: task.projects.name,
            tasks: []
          }
        }
        acc[projectId].tasks.push({
          id: task.id,
          project_id: task.project_id,
          title: task.task_name,
          date: task.projects.date,
          description: task.description,
          quantity: task.quantity,
          unit: task.unit
        })
        return acc
      }, {})

      setCurrentProjectTasks(processedCurrentTasks)
      setOtherProjectTasks(Object.values(groupedOtherTasks))
    } catch (error) {
      console.error('Error fetching tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [projectId, supabase])

  const handleTaskSelect = async (task) => {
    setSelectedTask(task)
  }

  const handleConfirm = () => {
    if (selectedTask) {
      router.push(`/projects/${selectedTask.project_id}/confirm/${selectedTask.id}`)
    }
  }

  if (loading) {
    return <div>Loading...</div>
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
                <span>Tanggal: {new Date(selectedTask.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Dibutuhkan: {selectedTask.quantity} {selectedTask.unit}
              </p>
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
          <Card
            key={task.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
              selectedTask?.id === task.id ? 'border-primary' : ''
            }`}
            onClick={() => handleTaskSelect(task)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{task.title}</h3>
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{new Date(task.date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Dibutuhkan: {task.quantity} {task.unit}
                </p>
              </div>
              <Gift className={`w-5 h-5 ${
                selectedTask?.id === task.id ? 'text-primary' : 'text-muted-foreground'
              }`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Other Projects Tasks */}
      <div className="space-y-4">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => setShowOtherProjects(!showOtherProjects)}
        >
          <h2 className="text-xl font-semibold">Task dari Project Lain</h2>
          {showOtherProjects ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>

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
                  <h3 className="font-medium text-lg mb-3">{project.projectTitle}</h3>
                  <div className="space-y-3">
                    {project.tasks.map((task) => (
                      <Card
                        key={task.id}
                        className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                          selectedTask?.id === task.id ? 'border-primary' : ''
                        }`}
                        onClick={() => handleTaskSelect(task)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{task.title}</h4>
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <CalendarDays className="w-4 h-4" />
                              <span>{new Date(task.date).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Dibutuhkan: {task.quantity} {task.unit}
                            </p>
                          </div>
                          <Gift className={`w-5 h-5 ${
                            selectedTask?.id === task.id ? 'text-primary' : 'text-muted-foreground'
                          }`} />
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
