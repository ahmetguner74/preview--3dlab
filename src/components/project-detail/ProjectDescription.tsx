
import React from 'react';
import { Project } from '@/types/project';

interface ProjectDescriptionProps {
  project: Project;
}

const ProjectDescription: React.FC<ProjectDescriptionProps> = ({ project }) => {
  return (
    <div className="grid md:grid-cols-3 gap-12 mb-16">
      <div className="md:col-span-2">
        <h2 className="text-xl md:text-2xl font-display mb-6">Proje Hakkında</h2>
        <p className="text-arch-gray">
          {project.description || 'Bu proje için henüz bir açıklama girilmemiş.'}
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-sm uppercase text-arch-gray">Müşteri</h3>
          <p>{project.client || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm uppercase text-arch-gray">Alan</h3>
          <p>{project.area || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm uppercase text-arch-gray">Yıl</h3>
          <p>{project.year || '-'}</p>
        </div>
        <div>
          <h3 className="text-sm uppercase text-arch-gray">Mimar</h3>
          <p>{project.architect || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectDescription;
