
import React from 'react';
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
          <ProjectHeader
            title={project.title || ''}
            location={project.location}
            category={project.category}
            thumbnail={project.thumbnail}
          />

          <ProjectDescription
            description={project.description}
            projectDetails={{
              year: project.year,
              client: project.client,
              area: project.area,
              architect: project.architect
            }}
          />

          <ProjectBeforeAfter projectId={project.id} />
          <ProjectGallery projectId={project.id} />
          <ProjectVideo projectId={project.id} />
          <ProjectPointCloud projectId={project.id} />
          <ProjectThreeDModel projectId={project.id} />
          <ProjectSimilar projectId={project.id} currentCategory={project.category} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPreviewDialog;
