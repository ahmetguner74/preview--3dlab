
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';

export const useProjectData = (slug: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{url: string, type: string}[]>([]);
  const [videos, setVideos] = useState<{url: string, thumbnail?: string}[]>([]);
  const [models, setModels] = useState<{url: string, type: string}[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        
        if (!slug) {
          console.error('Slug bulunamadı');
          return;
        }
        
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (projectError) throw projectError;
        if (!projectData) {
          console.error('Proje bulunamadı');
          return;
        }
        
        setProject(projectData);
        
        const { data: imageData, error: imageError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true });
          
        if (imageError) {
          console.error('Resimler yüklenirken hata oluştu:', imageError);
        } else {
          const allImages = imageData || [];
          
          setImages(allImages.map(img => ({
            url: img.image_url,
            type: img.image_type
          })));
          
          const beforeImg = allImages.find(img => img.image_type === 'before');
          const afterImg = allImages.find(img => img.image_type === 'after');
          
          if (beforeImg) setBeforeImage(beforeImg.image_url);
          if (afterImg) setAfterImage(afterImg.image_url);
        }
        
        const { data: videoData, error: videoError } = await supabase
          .from('project_videos')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true });
          
        if (videoError) {
          console.error('Videolar yüklenirken hata oluştu:', videoError);
        } else {
          setVideos((videoData || []).map(video => ({
            url: video.video_url,
            thumbnail: video.thumbnail_url || undefined
          })));
        }
        
        const { data: modelData, error: modelError } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectData.id);
          
        if (modelError) {
          console.error('3D Modeller yüklenirken hata oluştu:', modelError);
        } else {
          setModels((modelData || []).map(model => ({
            url: model.model_url,
            type: model.model_type
          })));
        }
        
      } catch (error) {
        console.error('Proje detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [slug]);

  return {
    project,
    loading,
    images,
    videos,
    models,
    beforeImage,
    afterImage
  };
};
