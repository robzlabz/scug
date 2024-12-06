'use client'

import React, { useState } from 'react';
import ProjectList from '../components/ProjectList';

const dummyProjects = [
  {
    id: '1',
    name: 'SCUG',
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
  },
  {
    id: '2',
    name: 'Berbagi Telur',
    description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    images: ['https://place-hold.it/300x500', 'https://place-hold.it/300x500', 'https://place-hold.it/300x500'],
    investmentDays: [
      {
        id: 'day3',
        date: '22 Januari 2025',
        items: [
          { id: 'item5', name: 'Makanan', description: 'Duis aute irure dolor' },
          { id: 'item6', name: 'Minuman', description: 'In reprehenderit in voluptate' },
        ],
      },
    ],
  },
];

export default function Home() {
  const [projects, setProjects] = useState(dummyProjects);

  return (
    <main className="container mx-auto p-4">
      <ProjectList projects={projects} />
    </main>
  );
}

