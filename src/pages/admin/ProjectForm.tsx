
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus, ProjectImage, ProjectVideo, Project3DModel } from '@/types/project';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";

// İçe aktarılan bileşenler
import ProjectFormHeader from '@/components/admin/projects/form/ProjectFormHeader';
import GeneralTab from '@/components/admin/projects/form/GeneralTab';
import ContentTab from '@/components/admin/projects/form/ContentTab';
import MediaTab from '@/components/admin/projects/form/MediaTab';
import PointCloudTab from '@/components/admin/projects/form/PointCloudTab';
import ModelTab from '@/components/admin/projects/form/ModelTab';
import SettingsTab from '@/components/admin/projects/form/SettingsTab';
import { getProjectImages, getProjectVideos, getProject3DModels } from '@/utils/mediaHelpers';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined && id !== 'new';

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("genel");
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

      // Projeye ait görselleri, videoları ve 3D modelleri getir
      if (id) {
        const images = await getProjectImages(id);
        const videos = await getProjectVideos(id);
        const models = await getProject3DModels(id);
        
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

  const handleSelectChange = (value: string, fieldName: string) => {
    setProject((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProject((prev) => ({ ...prev, [name]: checked }));
  };

  const handleThumbnailUpdate = (thumbnailUrl: string) => {
    setProject(prev => ({ ...prev, thumbnail: thumbnailUrl }));
  };

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
          .eq('id', id);
          
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
      <ProjectFormHeader 
        isEditing={isEditing} 
        saving={saving} 
        onSave={handleSubmit} 
      />

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                  onClick={() => setActiveTab("genel")}
                >
                  <span className="truncate">Gösterge Paneli</span>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                  onClick={() => setActiveTab("genel")}
                >
                  <span className="truncate">Projeler</span>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                >
                  <span className="truncate">Mesajlar</span>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                >
                  <span className="truncate">Ayarlar</span>
                </Button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="flex-1">
          <Tabs defaultValue="genel" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100 mb-6">
              <TabsTrigger value="genel">Genel</TabsTrigger>
              <TabsTrigger value="icerik">İçerik</TabsTrigger>
              <TabsTrigger value="medya">Medya</TabsTrigger>
              <TabsTrigger value="nokta-bulutu">Nokta Bulutu</TabsTrigger>
              <TabsTrigger value="3d-model">3D Model</TabsTrigger>
              <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="genel">
              <GeneralTab 
                project={project}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />
            </TabsContent>
            
            <TabsContent value="icerik">
              <ContentTab 
                project={project}
                onInputChange={handleInputChange}
              />
            </TabsContent>
            
            <TabsContent value="medya">
              <MediaTab 
                projectId={id}
                isEditing={isEditing}
                projectImages={projectImages}
                projectVideos={projectVideos}
                setProjectImages={setProjectImages}
                setProjectVideos={setProjectVideos}
                thumbnail={project.thumbnail}
                onThumbnailUpdated={handleThumbnailUpdate}
              />
            </TabsContent>
            
            <TabsContent value="nokta-bulutu">
              <PointCloudTab 
                projectId={id}
                isEditing={isEditing}
                project3DModels={project3DModels}
                setProject3DModels={setProject3DModels}
              />
            </TabsContent>
            
            <TabsContent value="3d-model">
              <ModelTab 
                projectId={id}
                isEditing={isEditing}
                project3DModels={project3DModels}
                setProject3DModels={setProject3DModels}
              />
            </TabsContent>
            
            <TabsContent value="ayarlar">
              <SettingsTab 
                project={project}
                onCheckboxChange={handleCheckboxChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
