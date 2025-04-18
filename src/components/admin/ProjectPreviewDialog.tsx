
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ProjectHeader from '@/components/project-detail/ProjectHeader';
import ProjectDescription from '@/components/project-detail/ProjectDescription';
import ProjectBeforeAfter from '@/components/project-detail/ProjectBeforeAfter';
import ProjectGallery from '@/components/project-detail/ProjectGallery';
import ProjectVideo from '@/components/project-detail/ProjectVideo';
import ProjectPointCloud from '@/components/project-detail/ProjectPointCloud';
import ProjectThreeDModel from '@/components/project-detail/ProjectThreeDModel';
import ProjectSimilar from '@/components/project-detail/ProjectSimilar';
import { supabase } from '@/integrations/supabase/client';
import { useMediaSelectors } from '@/hooks/useMediaSelectors';

interface ProjectPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Partial<Project>;
}

const ProjectPreviewDialog: React.FC<ProjectPreviewDialogProps> = ({
  open,
  onOpenChange,
  project
}) => {
  const [projectImages, setProjectImages] = useState<{ url: string, type: string }[]>([]);
  const [projectVideos, setProjectVideos] = useState<{ url: string }[]>([]);
  const [project3DModels, setProject3DModels] = useState<{ url: string, type: string }[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  const [activeThreeDModel, setActiveThreeDModel] = useState<string | null>(null);
  const [activePointCloud, setActivePointCloud] = useState<string | null>(null);

  const { handleThreeDModelSelect, handlePointCloudSelect } = useMediaSelectors();
  
  useEffect(() => {
    if (project.id && open) {
      // Proje medyalarını yükle
      const fetchProjectMedia = async () => {
        try {
          // Görseller
          const { data: images, error: imagesError } = await supabase
            .from('project_images')
            .select('*')
            .eq('project_id', project.id)
            .order('sort_order', { ascending: true });
            
          if (imagesError) throw imagesError;
          
          const formattedImages = images?.map(img => ({
            url: img.image_url,
            type: img.image_type
          })) || [];
          
          setProjectImages(formattedImages);
          
          // Before/After görselleri
          const beforeImg = formattedImages.find(img => img.type === 'before')?.url || null;
          const afterImg = formattedImages.find(img => img.type === 'after')?.url || null;
          setBeforeImage(beforeImg);
          setAfterImage(afterImg);
          
          // Videolar
          const { data: videos, error: videosError } = await supabase
            .from('project_videos')
            .select('*')
            .eq('project_id', project.id)
            .order('sort_order', { ascending: true });
            
          if (videosError) throw videosError;
          
          setProjectVideos(videos?.map(video => ({
            url: video.video_url
          })) || []);
          
          // 3D Modeller
          const { data: models, error: modelsError } = await supabase
            .from('project_3d_models')
            .select('*')
            .eq('project_id', project.id);
            
          if (modelsError) throw modelsError;
          
          const formattedModels = models?.map(model => ({
            url: model.model_url,
            type: model.model_type
          })) || [];
          
          setProject3DModels(formattedModels);
          
          // İlk 3D ve nokta bulutu modellerini aktif olarak ayarla
          const threeDModels = formattedModels.filter(m => m.type === '3d_model');
          const pointCloudModels = formattedModels.filter(m => m.type === 'point_cloud');
          
          if (threeDModels.length > 0) {
            setActiveThreeDModel(threeDModels[0].url);
          }
          
          if (pointCloudModels.length > 0) {
            setActivePointCloud(pointCloudModels[0].url);
          }
          
        } catch (error) {
          console.error('Proje medyaları yüklenirken hata:', error);
        }
      };

      fetchProjectMedia();
    }
  }, [project.id, open]);

  // Video kontrolü
  const hasVideos = projectVideos.length > 0;
  const videoUrl = hasVideos ? projectVideos[0].url : '';
  
  // Before/After kontrolü
  const hasBeforeAfter = beforeImage && afterImage;
  
  // 3D modelleri ve nokta bulutu modellerini filtrele
  const threeDModels = project3DModels.filter(model => model.type === '3d_model');
  const pointCloudModels = project3DModels.filter(model => model.type === 'point_cloud');
  
  // Model seçme fonksiyonları
  const onThreeDModelSelect = (modelUrl: string) => {
    setActiveThreeDModel(modelUrl);
  };
  
  const onPointCloudSelect = (modelUrl: string) => {
    setActivePointCloud(modelUrl);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-50 pb-4 border-b">
          <DialogTitle>Önizleme: {project.title || 'İsimsiz Proje'}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <ArrowLeft size={16} className="mr-1" />
            Düzenlemeye Dön
          </Button>
        </DialogHeader>
        
        <div className="bg-white">
          <ProjectHeader project={project as Project} />
          
          <ProjectDescription project={project as Project} />
          
          {hasBeforeAfter && (
            <ProjectBeforeAfter 
              beforeImageUrl={beforeImage!}
              afterImageUrl={afterImage!}
              title={project.title || 'Proje'}
            />
          )}
          
          {projectImages.length > 0 && (
            <ProjectGallery 
              images={projectImages}
              title={project.title || 'Proje'}
            />
          )}
          
          {hasVideos && (
            <ProjectVideo videoUrl={videoUrl} />
          )}
          
          {pointCloudModels.length > 0 && (
            <ProjectPointCloud
              models={pointCloudModels}
              activePointCloudUrl={activePointCloud!}
              onPointCloudSelect={onPointCloudSelect}
            />
          )}
          
          {threeDModels.length > 0 && (
            <ProjectThreeDModel
              models={threeDModels}
              activeModelUrl={activeThreeDModel}
              onModelSelect={onThreeDModelSelect}
            />
          )}
          
          {project.id && (
            <ProjectSimilar title={project.title || 'Proje'} projectId={project.id} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPreviewDialog;
