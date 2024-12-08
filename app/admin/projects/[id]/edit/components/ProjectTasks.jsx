'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { supabase } from '@/lib/supabase'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2 } from 'lucide-react'

export default function ProjectTasks({ projectId }) {
  const [newTask, setNewTask] = useState('')
  const [quantity, setQuantity] = useState('')
  const [unit, setUnit] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from('project_tasks')
      .select(`
        id,
        task_name,
        quantity,
        unit,
        filled, 
        name,
        phone
      `)
      .eq('project_id', projectId)
    
    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }
    
    setTasks(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const {error} = await supabase
      .from('project_tasks')
      .insert({
        project_id: projectId,
        task_name: newTask,
        quantity: quantity,
        unit: unit,
      })

    if (error) {
      console.error('Error adding task:', error)
      return
    }

    setNewTask('')
    setQuantity('')
    setUnit('')
    setIsAddOpen(false)

    fetchTasks()
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setIsEditOpen(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    const {error} = await supabase
      .from('project_tasks')
      .update({
        task_name: editingTask.task_name,
        quantity: editingTask.quantity,
        unit: editingTask.unit,
      })
      .eq('id', editingTask.id)

    if (error) {
      console.error('Error updating task:', error)
      return
    }

    setIsEditOpen(false)
    setEditingTask(null)
    fetchTasks()
  }

  const handleDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return

    const {error} = await supabase
      .from('project_tasks')
      .delete()
      .eq('id', taskId)

    if (error) {
      console.error('Error deleting task:', error)
      return
    }

    fetchTasks()
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Tasks</h2>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter task description (e.g., Snack untuk Asatidz)"
                className="mb-2"
              />
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Quantity (e.g., 60)"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-1/2"
                />
                <Input
                  placeholder="Unit (e.g., pcs)"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-1/2"
                />
              </div>
              <Button type="submit">Add Task</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Task Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                value={editingTask.task_name}
                onChange={(e) => setEditingTask({
                  ...editingTask,
                  task_name: e.target.value
                })}
                placeholder="Task description"
                className="mb-2"
              />
              <div className="flex space-x-2">
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={editingTask.quantity}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    quantity: e.target.value
                  })}
                  className="w-1/2"
                />
                <Input
                  placeholder="Unit"
                  value={editingTask.unit}
                  onChange={(e) => setEditingTask({
                    ...editingTask,
                    unit: e.target.value
                  })}
                  className="w-1/2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Update Task
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Filled By</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id} className={task.filled ? "bg-green-100" : "bg-orange-100"}>
              <TableCell>{task.task_name}</TableCell>
              <TableCell>{task.quantity}</TableCell>
              <TableCell>{task.unit}</TableCell>
              <TableCell>
                {task.filled ? (
                  <div>
                    <p>{task.name}</p>
                    <p>{task.phone}</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Not filled yet</p>
                )}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(task)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(task.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {tasks.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No tasks added yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
