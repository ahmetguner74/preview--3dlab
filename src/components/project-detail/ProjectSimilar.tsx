
import React from 'react';

interface ProjectSimilarProps {
  title: string;
}

const ProjectSimilar: React.FC<ProjectSimilarProps> = ({ title }) => {
  return (
    <div className="text-center mb-16">
      <h2 className="text-xl md:text-2xl font-display mb-8">Benzer Projeler</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="h-64 bg-arch-light-gray">
            <img 
              src={`https://images.unsplash.com/photo-${1600607000000 + item * 100}-4e2a09cf159d?q=80&w=2070`}
              alt={`Benzer proje ${item}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSimilar;
