'use client'

import React, { useState, useEffect } from 'react';
import ProjectList from '@/components/ProjectList';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    setProjects(data || []);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <ProjectList projects={projects} />
    </main>
  );
}
