'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ProjectDetail from '@/components/ProjectDetail';
import { supabase } from '@/lib/supabase';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) {
        console.error('Error fetching project:', error);
      } else {
        setProject(data);
      }
      setLoading(false);
    }

    fetchProject();
  }, [projectId]);

  console.log(project);

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <ProjectDetail project={project} />
    </div>
  );
}
