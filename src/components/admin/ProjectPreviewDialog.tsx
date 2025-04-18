
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project, ProjectImage, ProjectVideo as ProjectVideoType, Project3DModel } from '@/types/project';
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
  
  // Proje medyalarını yükle
  useEffect(() => {
    if (project.id && open) {
      // Görselleri yükle
      const fetchProjectMedia = async () => {
        try {
          // Proje görselleri
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
          
          // Videoları yükle
          const { data: videos, error: videosError } = await supabase
            .from('project_videos')
            .select('*')
            .eq('project_id', project.id)
            .order('sort_order', { ascending: true });
            
          if (videosError) throw videosError;
          
          setProjectVideos(videos?.map(video => ({
            url: video.video_url
          })) || []);
          
          // 3D Modelleri yükle
          const { data: models, error: modelsError } = await supabase
            .from('project_3d_models')
            .select('*')
            .eq('project_id', project.id);
            
          if (modelsError) throw modelsError;
          
          setProject3DModels(models?.map(model => ({
            url: model.model_url,
            type: model.model_type
          })) || []);
          
        } catch (error) {
          console.error('Proje medyaları yüklenirken hata:', error);
        }
      };

      fetchProjectMedia();
    }
  }, [project.id, open]);
  
  // 3D modelleri ve nokta bulutu modellerini filtrele
  const threeDModels = project3DModels.filter(model => model.type === '3d_model');
  const pointCloudModels = project3DModels.filter(model => model.type === 'point_cloud');
  
  // Aktif modelleri belirle
  const activeThreeDModel = threeDModels.length > 0 ? threeDModels[0].url : null;
  const activePointCloud = pointCloudModels.length > 0 ? pointCloudModels[0].url : null;
  
  // Video kontrolü
  const hasVideos = projectVideos.length > 0;
  const videoUrl = hasVideos ? projectVideos[0].url : '';
  
  // Before/After kontrolü
  const hasBeforeAfter = beforeImage && afterImage;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] w-full h-[90vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between sticky top-0 bg-white z-50 pb-4 border-b">
          <DialogTitle>Proje Önizleme: {project.title || 'İsimsiz Proje'}</DialogTitle>
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
              onPointCloudSelect={() => {}}
            />
          )}
          
          {threeDModels.length > 0 && (
            <ProjectThreeDModel
              models={threeDModels}
              activeModelUrl={activeThreeDModel}
              onModelSelect={() => {}}
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
