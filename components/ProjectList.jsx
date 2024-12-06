import React from 'react';
import ProjectItem from './ProjectItem';

const ProjectList = ({ projects }) => {
  return (
    (<div className="space-y-4">
      <h1 className="text-2xl font-bold mb-4">Daftar Proyek</h1>
      {projects.map((project) => (
        <ProjectItem key={project.id} project={project} />
      ))}
    </div>)
  );
};

export default ProjectList;

