
import React from 'react';
import { Project } from '@/types/project';

interface ProjectDescriptionProps {
  project: Project;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <div className="mb-12">
      {project.description && (
        <div className="mb-8">
          <h2 className="text-xl md:text-2xl font-display mb-4">Proje Hakkında</h2>
          <p className="text-arch-gray leading-relaxed">
            {project.description}
          </p>
        </div>
      )}
      
      {/* Sadece dolu olan alanları göster - daha kompakt grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {project.client && (
          <div>
            <h3 className="text-xs uppercase text-arch-gray mb-1">Müşteri</h3>
            <p className="text-sm font-medium">{project.client}</p>
          </div>
        )}
        {project.area && (
          <div>
            <h3 className="text-xs uppercase text-arch-gray mb-1">Alan</h3>
            <p className="text-sm font-medium">{project.area}</p>
          </div>
        )}
        {project.year && (
          <div>
            <h3 className="text-xs uppercase text-arch-gray mb-1">Yıl</h3>
            <p className="text-sm font-medium">{project.year}</p>
          </div>
        )}
        {project.architect && (
          <div>
            <h3 className="text-xs uppercase text-arch-gray mb-1">Mimar</h3>
            <p className="text-sm font-medium">{project.architect}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDescription;
