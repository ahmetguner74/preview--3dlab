
import React from 'react';
import { Project } from '@/types/project';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-4xl font-display font-light mb-3">{project.title}</h1>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-arch-gray">
        {project.category && <span>{project.category}</span>}
        {project.location && (
          <>
            <span>•</span>
            <span>{project.location}</span>
          </>
        )}
        {project.year && (
          <>
            <span>•</span>
            <span>{project.year}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectHeader;
