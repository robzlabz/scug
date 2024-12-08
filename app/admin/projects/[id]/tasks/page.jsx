'use client'

import { useEffect, useState, use } from 'react'
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
import { format, isAfter, parseISO } from 'date-fns'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function ProjectTasks({ params }) {
  const resolvedParams = use(params)
  const [tasks, setTasks] = useState([])
  const [project, setProject] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formData, setFormData] = useState({
    task_name: '',
    date: format(new Date(), 'yyyy-MM-dd'),
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState(null)
  const itemsPerPage = 10

  

  const fetchProject = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', resolvedParams.id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return
    }

    setProject(data)
  }

  const fetchTasks = async () => {
    // First, get the total count
    const { count } = await supabase
      .from('project_tasks')
      .select('*', { count: 'exact', head: true })
      .eq('project_id', resolvedParams.id)

    setTotalPages(Math.ceil(count / itemsPerPage))

    // Then fetch the paginated data
    const { data, error } = await supabase
      .from('project_tasks')
      .select('*, members:filled_by_member_id(*)')
      .eq('project_id', resolvedParams.id)
      .order('date', { ascending: false })
      .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)

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
      project_id: resolvedParams.id,
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
    setIsDialogOpen(false)
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

    setTaskToDelete(null)
    fetchTasks()
  }

  const handleEdit = (task) => {
    setSelectedTask(task)
    setFormData({
      task_name: task.task_name,
      date: task.date,
    })
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setSelectedTask(null)
    setFormData({ task_name: '', date: format(new Date(), 'yyyy-MM-dd') })
  }

  const isOverdue = (date) => {
    const taskDate = parseISO(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return isAfter(today, taskDate)
  }

  useEffect(() => {
    fetchProject()
    fetchTasks()
  }, [currentPage])

  if (!project) return <div>Loading...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setSelectedTask(null)
              setFormData({ task_name: '', date: format(new Date(), 'yyyy-MM-dd') })
            }}>
              Add New Task
            </Button>
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
              <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedTask ? 'Update' : 'Create'} Task
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-lg border">
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
              <TableRow 
                key={task.id}
                className={cn(
                  isOverdue(task.date) && !task.filled && "bg-red-50"
                )}
              >
                <TableCell className={cn(
                  isOverdue(task.date) && !task.filled && "text-red-600 font-medium"
                )}>
                  {format(new Date(task.date), 'dd MMM yyyy')}
                </TableCell>
                <TableCell>{task.task_name}</TableCell>
                <TableCell>{task.filled ? 'Completed' : 'Pending'}</TableCell>
                <TableCell>{task.members?.name || '-'}</TableCell>
                <TableCell>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setTaskToDelete(task)}
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

      <div className="mt-4 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <AlertDialog open={!!taskToDelete} onOpenChange={() => setTaskToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              &quot;{taskToDelete?.task_name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete(taskToDelete?.id)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
