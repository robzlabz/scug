'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from 'date-fns'

export default function ProjectTasks({ params }) {
  const [tasks, setTasks] = useState([])
  const [project, setProject] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    task_name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [])

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return
    }

    setProject(data)
  }

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*, members:filled_by_member_id(*)')
      .eq('project_id', params.id)
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }

    setTasks(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const taskData = {
      ...formData,
      project_id: params.id,
      filled: false,
      filled_by_member_id: null
    }

    if (selectedTask) {
      const { error } = await supabase
        .from('project_tasks')
        .update(taskData)
        .eq('id', selectedTask.id)

      if (error) {
        console.error('Error updating task:', error)
        return
      }
    } else {
      const { error } = await supabase
        .from('project_tasks')
        .insert(taskData)

      if (error) {
        console.error('Error creating task:', error)
        return
      }
    }

    setFormData({ task_name: '', date: format(new Date(), 'yyyy-MM-dd') })
    setSelectedTask(null)
    fetchTasks()
  }

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    fetchTasks()
  }

  if (!project) return <div>Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedTask ? 'Edit Task' : 'Add New Task'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="task_name">Task Name</Label>
                <Input
                  id="task_name"
                  value={formData.task_name}
                  onChange={(e) => setFormData({ ...formData, task_name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">
                {selectedTask ? 'Update' : 'Create'} Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Task Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Filled By</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{format(new Date(task.date), 'dd MMM yyyy')}</TableCell>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>{task.filled ? 'Completed' : 'Pending'}</TableCell>
              <TableCell>{task.members?.name || '-'}</TableCell>
              <TableCell>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedTask(task)
                      setFormData({
                        task_name: task.task_name,
                        date: task.date,
                      })
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
