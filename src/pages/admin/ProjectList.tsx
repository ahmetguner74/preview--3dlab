
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { toast } from "sonner";
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ProjectListHeader } from '@/components/admin/projects/ProjectListHeader';
import { ProjectFilter } from '@/components/admin/projects/ProjectFilter';
import { ProjectListToolbar } from '@/components/admin/projects/ProjectListToolbar';
import { ProjectTable } from '@/components/admin/projects/ProjectTable';

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Projeler yüklenirken hata oluştu:', error);
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ visible: !project.visible })
        .eq('id', project.id);

      if (error) throw error;
      
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, visible: !p.visible } : p
      ));
      
      toast.success(project.visible 
        ? 'Proje gizlendi' 
        : 'Proje görünür yapıldı');
    } catch (error) {
      console.error('Proje durumu değiştirilirken hata:', error);
      toast.error('Proje durumu değiştirilemedi');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Proje başarıyla silindi');
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      toast.error('Proje silinemedi');
    }
  };
  
  // Yeni güncelleme fonksiyonu
  const updateProject = (updatedProject: Project) => {
    setProjects(projects.map(p => 
      p.id === updatedProject.id ? updatedProject : p
    ));
  };

  // Filtreleme fonksiyonu
  const filteredProjects = projects.filter(project => {
    const titleMatch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = categoryFilter === 'all' ? true : project.category === categoryFilter;
    const statusMatch = statusFilter === 'all' ? true : project.status === statusFilter;
    return titleMatch && categoryMatch && statusMatch;
  });

  // Mevcut kategorileri bulma
  const categories = [...new Set(projects.map(p => p.category).filter(Boolean))];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <ProjectListHeader />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <ProjectFilter 
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              categories={categories}
              onSearchChange={setSearchTerm}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
            />

            <ProjectListToolbar onRefresh={fetchProjects} />

            <ProjectTable 
              projects={filteredProjects}
              loading={loading}
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
              onToggleVisibility={toggleVisibility}
              onDelete={deleteProject}
              onUpdateProject={updateProject}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectList;
