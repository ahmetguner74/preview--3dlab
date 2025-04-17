
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'yayinda')
          .eq('visible', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setProjects(data);
          const uniqueCategories = ['All', ...new Set(data.map(p => p.category).filter(Boolean) as string[])];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Projeler yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <Layout>
      <section className="pt-16 md:pt-24 pb-16">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8">Projelerimiz</h1>
            <p className="text-lg text-arch-gray">
              Çeşitli ölçeklerdeki mimarlık projelerimizi keşfedin.
            </p>
          </div>
          
          {/* Kategori Filtreleme */}
          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 text-sm transition-colors ${
                    selectedCategory === category
                      ? 'bg-arch-black text-white'
                      : 'bg-white border border-arch-black text-arch-black hover:bg-arch-light-gray'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
          
          {/* Proje Listesi */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
              <p className="mt-2">Projeler yükleniyor...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-arch-gray">
                {selectedCategory === 'All' ? 
                  'Henüz hiç proje yayınlanmamış.' : 
                  `"${selectedCategory}" kategorisinde proje bulunamadı.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <Link to={`/project/${project.slug}`} key={project.id}>
                  <div className="group relative h-72 overflow-hidden">
                    <img 
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070'} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 group-hover:bg-opacity-40" />
                    <div className="absolute bottom-0 left-0 p-6 z-10">
                      <h4 className="text-xl text-white font-medium">{project.title}</h4>
                      {(project.category || project.location) && (
                        <p className="text-sm text-white/80 mt-1">
                          {[project.category, project.location].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center text-sm text-white">
                          Detayları Gör <ArrowUpRight size={16} className="ml-1" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
