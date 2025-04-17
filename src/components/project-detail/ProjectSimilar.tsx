
import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

interface ProjectSimilarProps {
  title: string;
  projectId: string;
}

const ProjectSimilar: React.FC<ProjectSimilarProps> = ({ title, projectId }) => {
  const { data: similarProjects, isLoading } = useQuery({
    queryKey: ['similarProjects', projectId],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'yayinda')
        .eq('visible', true)
        .neq('id', projectId)
        .limit(3)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return projects as Project[];
    }
  });

  if (isLoading) {
    return (
      <div className="text-center mb-16">
        <h2 className="text-xl md:text-2xl font-display mb-8">Benzer Projeler</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-64 bg-arch-light-gray animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!similarProjects || similarProjects.length === 0) {
    return null;
  }

  return (
    <div className="text-center mb-16">
      <h2 className="text-xl md:text-2xl font-display mb-8">Benzer Projeler</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {similarProjects.map((project) => (
          <Link to={`/project/${project.slug}`} key={project.id}>
            <div className="group relative h-64 overflow-hidden">
              <img 
                src={project.thumbnail || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070'}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-40" />
              <div className="absolute bottom-0 left-0 p-4 z-10">
                <h4 className="text-lg text-white font-medium">{project.title}</h4>
                {project.location && (
                  <p className="text-sm text-white/80 mt-1">{project.location}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectSimilar;
