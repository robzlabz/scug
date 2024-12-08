'use client'

import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { use, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProjectDetails from './components/ProjectDetails'
import ProjectTasks from './components/ProjectTasks'
import ProjectReports from './components/ProjectReports'
import ProjectMembers from './components/ProjectMembers'
import ProjectCover from './components/ProjectCover'
import ProjectSlider from './components/ProjectSlider'

export default function EditProject({params}) {
  const resolvedParams = use(params)

  return (
    <div className="p-8 max-w-4xl mx-auto" data-color-mode="light">
      <div className="mb-8 space-y-4">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <p className="text-gray-500">Manage your project details, tasks, reports, and team members.</p>
      </div>

      
        <Tabs defaultValue="details" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="cover">Cover</TabsTrigger>
            <TabsTrigger value="slider">Slider</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-6">
            <ProjectDetails projectId={resolvedParams.id}/>
          </TabsContent>

          <TabsContent value="cover">
            <ProjectCover projectId={resolvedParams.id}/>
          </TabsContent>

          <TabsContent value="slider">
            <ProjectSlider projectId={resolvedParams.id} />
          </TabsContent>

          <TabsContent value="tasks">
            <ProjectTasks projectId={resolvedParams.id}/>
          </TabsContent>

          <TabsContent value="reports">
            <ProjectReports projectId={resolvedParams.id}/>
          </TabsContent>
        </Tabs>

        
    </div>
  )
}
