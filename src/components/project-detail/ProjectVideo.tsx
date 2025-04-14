
import React from 'react';

interface ProjectVideoProps {
  videoUrl: string;
}

const ProjectVideo: React.FC<ProjectVideoProps> = ({ videoUrl }) => {
  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe 
        src={videoUrl}
        frameBorder="0" 
        allow="autoplay; fullscreen" 
        allowFullScreen
        className="w-full h-[500px]"
      />
    </div>
  );
};

export default ProjectVideo;
