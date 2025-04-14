
import React from 'react';

interface ProjectBeforeAfterProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  title: string;
}

const ProjectBeforeAfter: React.FC<ProjectBeforeAfterProps> = ({ beforeImageUrl, afterImageUrl, title }) => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-xl font-display">Öncesi</h3>
        <div className="h-80 bg-arch-light-gray">
          <img 
            src={beforeImageUrl}
            alt={`${title} - Öncesi`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-display">Sonrası</h3>
        <div className="h-80 bg-arch-light-gray">
          <img 
            src={afterImageUrl}
            alt={`${title} - Sonrası`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectBeforeAfter;
