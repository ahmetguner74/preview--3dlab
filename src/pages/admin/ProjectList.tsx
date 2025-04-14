
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch(status) {
      case 'taslak': 
        return 'bg-yellow-100 text-yellow-800';
      case 'yayinda': 
        return 'bg-green-100 text-green-800';
      case 'arsiv': 
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projeler</h1>
        <Link 
          to="/admin/projects/new" 
          className="bg-arch-black hover:bg-black text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Yeni Proje
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2">Yükleniyor...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-md">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proje Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Görünürlük</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Henüz hiç proje eklenmemiş
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
                        {project.status === 'taslak' ? 'Taslak' : 
                         project.status === 'yayinda' ? 'Yayında' : 'Arşiv'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.created_at).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {project.visible ? 
                        <span className="text-green-600 inline-flex items-center">
                          <Eye size={16} className="mr-1" />
                          Görünür
                        </span> : 
                        <span className="text-gray-600 inline-flex items-center">
                          <EyeOff size={16} className="mr-1" />
                          Gizli
                        </span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => toggleVisibility(project)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                      >
                        {project.visible ? 
                          <EyeOff size={16} className="mr-1" /> : 
                          <Eye size={16} className="mr-1" />
                        }
                        {project.visible ? 'Gizle' : 'Göster'}
                      </button>
                      <Link
                        to={`/admin/projects/${project.id}/edit`}
                        className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <Pencil size={16} className="mr-1" />
                        Düzenle
                      </Link>
                      <button
                        onClick={() => deleteProject(project.id)}
                        className="inline-flex items-center text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
