
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Eye, 
  EyeOff, 
  Filter, 
  Search, 
  ArrowLeftCircle, 
  LogOut,
  RefreshCw
} from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
        {/* Üst Menü */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Siteye Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Projeler</h1>
          </div>
          
          <div>
            <button className="flex items-center text-gray-600 hover:text-arch-black">
              <span className="text-sm mr-2">Çıkış Yap</span>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Filtreleme Alanı */}
            <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Proje ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Kategoriler</SelectItem>
                    {categories.map((category, index) => (
                      <SelectItem key={index} value={category || 'undefined'}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Durum" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tüm Durumlar</SelectItem>
                    <SelectItem value="taslak">Taslak</SelectItem>
                    <SelectItem value="yayinda">Yayında</SelectItem>
                    <SelectItem value="arsiv">Arşiv</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Başlık ve Butonlar */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-medium">Projeler</h2>
              <div className="flex space-x-3">
                <button 
                  onClick={fetchProjects}
                  className="bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 flex items-center hover:bg-gray-50"
                >
                  <RefreshCw size={16} className="mr-2" />
                  Yenile
                </button>
                <Link 
                  to="/admin/projects/new"
                  className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
                >
                  <Plus size={16} className="mr-2" />
                  Yeni Proje
                </Link>
              </div>
            </div>

            {/* Projeler Tablosu */}
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Başlık</th>
                    <th className="px-6 py-3 font-medium">Kategori</th>
                    <th className="px-6 py-3 font-medium">Durum</th>
                    <th className="px-6 py-3 font-medium">Son Güncelleme</th>
                    <th className="px-6 py-3 font-medium text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                        <p className="mt-2">Yükleniyor...</p>
                      </td>
                    </tr>
                  ) : filteredProjects.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? 
                          'Arama kriterlerine uygun proje bulunamadı' : 
                          'Henüz hiç proje eklenmemiş'}
                        {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
                          <div className="mt-4">
                            <Link 
                              to="/admin/projects/new"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              <Plus size={16} className="mr-2" />
                              İlk Projeyi Ekle
                            </Link>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500">{project.slug}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.category || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
                            {project.status === 'taslak' ? 'Taslak' : 
                             project.status === 'yayinda' ? 'Yayında' : 'Arşiv'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(project.updated_at).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => toggleVisibility(project)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
                            title={project.visible ? 'Gizle' : 'Göster'}
                          >
                            {project.visible ? 
                              <EyeOff size={16} className="mr-1" /> : 
                              <Eye size={16} className="mr-1" />
                            }
                            <span className="hidden sm:inline">
                              {project.visible ? 'Gizle' : 'Göster'}
                            </span>
                          </button>
                          <Link
                            to={`/admin/projects/${project.id}/edit`}
                            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
                            title="Düzenle"
                          >
                            <Pencil size={16} className="mr-1" />
                            <span className="hidden sm:inline">Düzenle</span>
                          </Link>
                          <button
                            onClick={() => deleteProject(project.id)}
                            className="inline-flex items-center text-red-600 hover:text-red-900"
                            title="Sil"
                          >
                            <Trash2 size={16} className="mr-1" />
                            <span className="hidden sm:inline">Sil</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectList;
