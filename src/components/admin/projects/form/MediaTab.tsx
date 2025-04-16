
import React from 'react';
import { ProjectImage, ProjectVideo } from '@/types/project';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { uploadProjectImage } from '@/utils/mediaHelpers';
import { Button } from "@/components/ui/button";
import { Image, Video } from 'lucide-react';
import { toast } from "sonner";

interface MediaTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  projectVideos: ProjectVideo[];
  setProjectImages: React.Dispatch<React.SetStateAction<ProjectImage[]>>;
  setProjectVideos: React.Dispatch<React.SetStateAction<ProjectVideo[]>>;
  thumbnail?: string;
  onThumbnailUpdated: (thumbnailUrl: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({ 
  projectId, 
  isEditing,
  projectImages,
  projectVideos,
  setProjectImages,
  setProjectVideos,
  thumbnail,
  onThumbnailUpdated
}) => {
  const handleThumbnailUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, 'main');
      
      if (imageUrl) {
        onThumbnailUpdated(imageUrl);
        toast.success('Proje kapak görseli yüklendi');
      }
    } catch (error) {
      console.error('Kapak görseli yükleme hatası:', error);
      toast.error('Kapak görseli yüklenemedi');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow-sm mb-6">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
          <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
        </div>
      </div>
      
      <div className="border rounded-lg p-6 bg-white mb-6">
        <h3 className="text-lg font-medium mb-2">Proje Kapak Görseli</h3>
        <p className="text-sm text-gray-500 mb-4">Bu görsel ana sayfada ve proje listesinde kullanılacaktır.</p>
        
        {thumbnail ? (
          <div className="mb-4 relative">
            <div className="aspect-video bg-gray-100 rounded overflow-hidden">
              <img 
                src={thumbnail} 
                alt="Kapak görseli" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <div className="mb-6 border-2 border-dashed rounded-md p-6 text-center transition-colors border-gray-300">
            <Image className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Kapak Görseli Yok</h3>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP formatları desteklenir.</p>
          </div>
        )}
        
        <FileUploadBox 
          onFileSelected={handleThumbnailUpload}
          title="Kapak Görseli Yükle"
          description="PNG, JPG, WEBP formatları desteklenir. Maksimum 5MB."
          icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
          allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
        />
      </div>
      
      {/* Diğer medya yükleme bileşenleri buraya gelecek */}
    </div>
  );
};

export default MediaTab;
