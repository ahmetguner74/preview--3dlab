
import React from 'react';
import { Project } from '@/types/project';

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  return (
    <>
      <h1 className="text-3xl md:text-5xl font-display font-light mb-6">{project.title}</h1>
      <div className="flex flex-wrap gap-x-6 gap-y-2 mb-16">
        <p className="text-arch-gray">{project.category || 'Kategori Belirtilmemiş'}</p>
        <p className="text-arch-gray">•</p>
        <p className="text-arch-gray">{project.location || 'Konum Belirtilmemiş'}</p>
        <p className="text-arch-gray">•</p>
        <p className="text-arch-gray">{project.year || 'Yıl Belirtilmemiş'}</p>
      </div>
    </>
  );
};

export default ProjectHeader;
