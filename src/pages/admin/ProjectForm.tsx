
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project';
import { toast } from "sonner";
import { ArrowLeft, Save } from 'lucide-react';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined && id !== 'new';

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    location: '',
    category: '',
    year: '',
    client: '',
    area: '',
    architect: '',
    status: 'taslak',
    visible: false
  });

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data || {});
    } catch (error) {
      console.error('Proje yüklenirken hata:', error);
      toast.error('Proje yüklenirken bir hata oluştu');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !isEditing) {
      // Başlık değiştiğinde otomatik slug oluştur (sadece yeni projeler için)
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9ğüşiöç]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
        
      setProject((prev) => ({ ...prev, title: value, slug }));
    } else {
      setProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProject((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project.title || !project.slug) {
      toast.error('Başlık ve URL alanları zorunludur');
      return;
    }
    
    try {
      setSaving(true);
      
      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...project,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        toast.success('Proje başarıyla güncellendi');
      } else {
        // Obje dizisi olarak değil, tek obje olarak gönderiyoruz
        const { error } = await supabase
          .from('projects')
          .insert(project);
          
        if (error) {
          // Slug benzersizlik hatası kontrolü
          if (error.code === '23505' && error.details?.includes('slug')) {
            toast.error('Bu URL zaten kullanılıyor. Lütfen başka bir URL seçin.');
            return;
          }
          throw error;
        }
        
        toast.success('Proje başarıyla oluşturuldu');
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      toast.error('Proje kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
        <p className="mt-2">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/projects')}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Projeyi Düzenle' : 'Yeni Proje Oluştur'}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proje Başlığı */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proje Başlığı *</label>
              <input
                type="text"
                name="title"
                value={project.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Proje URL (Slug) */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proje URL *</label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">/project/</span>
                <input
                  type="text"
                  name="slug"
                  value={project.slug}
                  onChange={handleInputChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  pattern="[a-z0-9-]+"
                  title="Sadece küçük harfler, sayılar ve tire (-) kullanabilirsiniz"
                />
              </div>
            </div>

            {/* Proje Açıklaması */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Proje Açıklaması</label>
              <textarea
                name="description"
                value={project.description || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Konum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Konum</label>
              <input
                type="text"
                name="location"
                value={project.location || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                type="text"
                name="category"
                value={project.category || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Yıl */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yıl</label>
              <input
                type="text"
                name="year"
                value={project.year || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Müşteri */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Müşteri</label>
              <input
                type="text"
                name="client"
                value={project.client || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Alan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Alan</label>
              <input
                type="text"
                name="area"
                value={project.area || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Mimar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mimar</label>
              <input
                type="text"
                name="architect"
                value={project.architect || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Durum */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
              <select
                name="status"
                value={project.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="taslak">Taslak</option>
                <option value="yayinda">Yayında</option>
                <option value="arsiv">Arşiv</option>
              </select>
            </div>

            {/* Görünürlük */}
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="visible"
                  checked={project.visible}
                  onChange={handleCheckboxChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Ana sayfada görünür</span>
              </label>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/admin/projects')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
              disabled={saving}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-arch-black text-white rounded-md hover:bg-black flex items-center"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save size={18} className="mr-2" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectForm;
