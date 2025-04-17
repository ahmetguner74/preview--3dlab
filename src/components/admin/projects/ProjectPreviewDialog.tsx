
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Project } from '@/types/project';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

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
      <DialogContent className="max-w-5xl h-[80vh] overflow-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>Proje Önizleme: {project.title || 'İsimsiz Proje'}</DialogTitle>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            <ArrowLeft size={16} className="mr-1" />
            Düzenlemeye Dön
          </Button>
        </DialogHeader>
        
        <div className="bg-white rounded-md">
          {/* Proje Önizleme İçeriği */}
          <div className="space-y-6">
            {/* Proje Başlığı ve Kapak Görseli */}
            {project.thumbnail && (
              <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                  {project.location && (
                    <p className="text-white/90 text-lg">{project.location}</p>
                  )}
                </div>
              </div>
            )}
            
            {!project.thumbnail && (
              <div className="p-6 bg-gray-100 rounded-lg">
                <h1 className="text-3xl font-bold">{project.title || 'İsimsiz Proje'}</h1>
                {project.location && (
                  <p className="text-gray-600 text-lg">{project.location}</p>
                )}
              </div>
            )}
            
            {/* Proje Bilgileri */}
            <div className="p-6 border rounded-lg space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.year && (
                  <div>
                    <p className="text-sm text-gray-500">Yıl</p>
                    <p className="font-medium">{project.year}</p>
                  </div>
                )}
                
                {project.client && (
                  <div>
                    <p className="text-sm text-gray-500">Müşteri</p>
                    <p className="font-medium">{project.client}</p>
                  </div>
                )}
                
                {project.area && (
                  <div>
                    <p className="text-sm text-gray-500">Alan</p>
                    <p className="font-medium">{project.area}</p>
                  </div>
                )}
                
                {project.architect && (
                  <div>
                    <p className="text-sm text-gray-500">Mimar</p>
                    <p className="font-medium">{project.architect}</p>
                  </div>
                )}
              </div>
              
              {/* Proje Açıklaması */}
              {project.description && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Proje Hakkında</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border rounded-lg">
              <h3 className="text-lg font-medium mb-2">Proje Durumu</h3>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  project.status === 'yayinda' ? 'bg-green-500' : 
                  project.status === 'taslak' ? 'bg-yellow-500' : 
                  'bg-gray-500'
                }`}></div>
                <span className="capitalize">{project.status === 'yayinda' ? 'Yayında' : 
                project.status === 'taslak' ? 'Taslak' : 'Arşiv'}</span>
                
                {project.visible !== undefined && (
                  <span className="ml-6">
                    {project.visible ? 'Görünür' : 'Gizli'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectPreviewDialog;
