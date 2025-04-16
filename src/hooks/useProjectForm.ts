
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus, ProjectImage, ProjectVideo, Project3DModel } from '@/types/project';
import { getProjectImages, getProjectVideos, getProject3DModels } from '@/utils/mediaHelpers';

type UseProjectFormProps = {
  projectId: string | undefined;
  isEditing: boolean;
};

export const useProjectForm = ({ projectId, isEditing }: UseProjectFormProps) => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [projectVideos, setProjectVideos] = useState<ProjectVideo[]>([]);
  const [project3DModels, setProject3DModels] = useState<Project3DModel[]>([]);

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
    visible: false,
    thumbnail: ''
  });

  // Proje verilerini yükleme
  const fetchProject = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data || {});

      // Projeye ait görselleri, videoları ve 3D modelleri getir
      if (projectId) {
        const images = await getProjectImages(projectId);
        const videos = await getProjectVideos(projectId);
        const models = await getProject3DModels(projectId);
        
        setProjectImages(images as ProjectImage[]);
        setProjectVideos(videos as ProjectVideo[]);
        setProject3DModels(models as Project3DModel[]);
      }
    } catch (error) {
      console.error('Proje yüklenirken hata:', error);
      toast.error('Proje yüklenirken bir hata oluştu');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  // Input değişikliğini izleme
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !isEditing) {
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

  // Select değişikliğini izleme
  const handleSelectChange = (value: string, fieldName: string) => {
    setProject((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Checkbox değişikliğini izleme
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProject((prev) => ({ ...prev, [name]: checked }));
  };

  // Thumbnail güncellemesi
  const handleThumbnailUpdate = (thumbnailUrl: string) => {
    setProject(prev => ({ ...prev, thumbnail: thumbnailUrl }));
  };

  // Proje kaydetme
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
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
          .eq('id', projectId);
          
        if (error) throw error;
        toast.success('Proje başarıyla güncellendi');
      } else {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            title: project.title!,
            slug: project.slug!,
            description: project.description,
            location: project.location,
            category: project.category,
            year: project.year,
            client: project.client,
            area: project.area,
            architect: project.architect,
            status: project.status,
            visible: project.visible,
            thumbnail: project.thumbnail
          })
          .select();
          
        if (error) {
          if (error.code === '23505' && error.details?.includes('slug')) {
            toast.error('Bu URL zaten kullanılıyor. Lütfen başka bir URL seçin.');
            return;
          }
          throw error;
        }
        
        toast.success('Proje başarıyla oluşturuldu');
        
        // Yeni oluşturulan projenin düzenleme sayfasına git
        if (data && data.length > 0) {
          navigate(`/admin/projects/${data[0].id}/edit`);
        } else {
          navigate('/admin/projects');
        }
      }
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      toast.error('Proje kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  // İlk yükleme
  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [projectId]);

  return {
    loading,
    saving,
    project,
    projectImages,
    projectVideos,
    project3DModels,
    setProjectImages,
    setProjectVideos,
    setProject3DModels,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleThumbnailUpdate,
    handleSubmit
  };
};
