
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '@/types/project';
import { Pencil, Trash2, Eye, EyeOff, Image } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { uploadFileToStorage } from '@/utils/mediaHelpers';

interface ProjectListItemProps {
  project: Project;
  onToggleVisibility: (project: Project) => void;
  onDelete: (id: string) => void;
  onUpdateProject: (project: Project) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ 
  project, 
  onToggleVisibility, 
  onDelete,
  onUpdateProject
}) => {
  const [showThumbnailDialog, setShowThumbnailDialog] = useState(false);
  const [uploading, setUploading] = useState(false);

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
  
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Dosya yükleme işlemi
      const imageUrl = await uploadFileToStorage(file, 'projects');
      
      if (!imageUrl) {
        throw new Error('Görsel yüklenemedi');
      }
      
      // Projeyi güncelleme
      const { error } = await supabase
        .from('projects')
        .update({ thumbnail: imageUrl })
        .eq('id', project.id);
      
      if (error) throw error;
      
      toast.success('Proje görseli güncellendi');
      
      // Ana component'e bildir ve dialog'u kapat
      onUpdateProject({...project, thumbnail: imageUrl});
      setShowThumbnailDialog(false);
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    } finally {
      setUploading(false);
    }
  };
  
  return (
    <>
      <tr className="hover:bg-gray-50">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {project.id.substring(0, 8)}...
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div 
              className="h-12 w-12 flex-shrink-0 mr-4 bg-gray-200 rounded overflow-hidden cursor-pointer"
              onClick={() => setShowThumbnailDialog(true)}
            >
              {project.thumbnail ? (
                <img src={project.thumbnail} alt={project.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <Image size={18} className="text-gray-400" />
                </div>
              )}
            </div>
            <div>
              <div className="font-medium text-gray-900">{project.title}</div>
              <div className="text-sm text-gray-500">{project.slug}</div>
            </div>
          </div>
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
            onClick={() => onToggleVisibility(project)}
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
            onClick={() => onDelete(project.id)}
            className="inline-flex items-center text-red-600 hover:text-red-900"
            title="Sil"
          >
            <Trash2 size={16} className="mr-1" />
            <span className="hidden sm:inline">Sil</span>
          </button>
        </td>
      </tr>
      
      {/* Görsel Yükleme Dialog */}
      <Dialog open={showThumbnailDialog} onOpenChange={setShowThumbnailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proje Görseli</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {project.thumbnail && (
              <div className="border rounded-md overflow-hidden">
                <img 
                  src={project.thumbnail} 
                  alt={project.title} 
                  className="w-full h-auto object-contain"
                />
              </div>
            )}
            
            <FileUploadBox
              onFileSelected={handleImageUpload}
              title="Kapak Görseli Yükle"
              description="Bu görsel ana sayfa ve proje listesinde görünecektir"
              allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
