'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ProjectCard from '../ProjectCard';

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const today = new Date().toISOString()

      // Fetch all projects with their tasks and cover images
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select(`
          *,
          project_tasks (*),
          project_image (*)
        `)
        .gte('date', today)
        .order('date', { ascending: true })
        .is('deleted_at', null)

      if (projectsError) throw projectsError

      // Process projects data
      var processedProjects = projectsData.map(project => {
        // Get tasks
        var tasks = project.project_tasks || []
        var totalTasks = tasks.length
        var completedTasks = tasks.filter(task => task.filled).length

        // Get cover image
        var coverImage = project.project_image?.find(img => img.type === 'cover')

        return {
          ...project,
          totalTasks,
          completedTasks,
          coverImage: coverImage?.url
        }
      })

      setProjects(processedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Proyek Terbaru</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Lihat bagaimana kami berbagi kebaikan kepada para guru
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <ProjectCard project={project} key={project.id} />
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/projects">
            <Button size="lg">
              Lihat Semua Proyek
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
