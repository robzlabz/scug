'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import ProjectDetail from '../../../components/ProjectDetail';

const getProjectById = id => {
  return {
    id,
    name: 'Proyek A',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    images: ['https://place-hold.it/300x500', 'https://place-hold.it/300x500', 'https://place-hold.it/300x500'],
    investmentDays: [
      {
        id: 'day1',
        date: '22 Januari 2025',
        items: [
          { id: 'item1', name: 'Makanan', description: 'Lorem ipsum dolor sit amet' },
          { id: 'item2', name: 'Minuman', description: 'Consectetur adipiscing elit' },
          { id: 'item3', name: 'Snack', description: 'Sed do eiusmod tempor' },
        ],
      },
      {
        id: 'day2',
        date: '27 Januari 2025',
        items: [
          { id: 'item4', name: 'Makanan', description: 'Ut enim ad minim veniam' },
        ],
      },
    ],
  };
};

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id;
  const project = getProjectById(projectId);

  return (
    (<div className="min-h-screen bg-gray-100">
      <ProjectDetail project={project} />
    </div>)
  );
}

