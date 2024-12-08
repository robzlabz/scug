'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function ProjectMembers({ projectId }) {
  const [members, setMembers] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [newMember, setNewMember] = useState({
    name: '',
    phone: ''
  })

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('project_id', projectId)

    if (error) {
      console.error('Error fetching members:', error)
      return
    }

    setMembers(data || [])
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          name: newMember.name,
          role: newMember.role,
          email: newMember.email
        })

      if (error) throw error

      setNewMember({ name: '', role: '', email: '' })
      setIsOpen(false)
      fetchMembers()
    } catch (error) {
      console.error('Error adding member:', error)
      alert('Error adding member')
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Project Members</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">Add Member</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Member</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <Input
                  placeholder="Name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  placeholder="Role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  required
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-gray-500">{member.role}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
        ))}
        {members.length === 0 && (
          <p className="text-center text-gray-500 py-8">No members added yet</p>
        )}
      </div>
    </div>
  )
}
