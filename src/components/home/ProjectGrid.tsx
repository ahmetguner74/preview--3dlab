
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

const ProjectGrid = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        setLoading(true);
        
        // Sadece 'yayinda' statüsündeki, görünür olan projeleri getir ve 6 ile sınırla
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'yayinda')
          .eq('visible', true)
          .order('created_at', { ascending: false })
          .limit(6);
          
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProjects();
  }, []);

  return (
    <section id="projects" className="py-24">
      <div className="arch-container">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm uppercase text-arch-gray tracking-wider mb-2">Çalışmalarımız</h2>
            <h3 className="text-2xl md:text-4xl font-display">Öne Çıkan Projeler</h3>
          </div>
          <div className="hidden md:block">
            <Link 
              to="/projects" 
              className="flex items-center gap-1 text-sm hover:text-arch-gray transition-colors"
            >
              Tüm Projeleri Gör <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2">Projeler yükleniyor...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-arch-gray">Henüz hiç proje eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <Link to={`/project/${project.slug}`} key={project.id}>
                <div className="group relative h-80 overflow-hidden">
                  <img 
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070'} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="project-card-overlay">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ArrowUpRight size={40} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-6 z-10">
                    <h4 className="text-xl text-white font-medium">{project.title}</h4>
                    <p className="text-sm text-white/80 mt-1">
                      {project.category} · {project.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-10 md:hidden flex justify-center">
          <Link 
            to="/projects" 
            className="flex items-center gap-1 text-sm hover:text-arch-gray transition-colors"
          >
            Tüm Projeleri Gör <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;
