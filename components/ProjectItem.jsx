import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const ProjectItem = ({ project }) => {
  return (
    (<Link href={`/project/${project.id}`}>
      <div
        className="border rounded-lg overflow-hidden shadow-sm cursor-pointer mb-3">
        <div className="relative h-48">
          <Image src={project.images[0]} alt={project.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
          <p className="text-gray-600 line-clamp-2">{project.description}</p>
        </div>
      </div>
    </Link>)
  );
};

export default ProjectItem;

