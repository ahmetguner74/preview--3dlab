
import React from 'react';

interface ProjectMainImageProps {
  imageUrl: string;
  title: string;
}

const ProjectMainImage: React.FC<ProjectMainImageProps> = ({ imageUrl, title }) => {
  return (
    <div className="w-full h-96 md:h-[600px] mb-16 bg-arch-light-gray">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ProjectMainImage;
