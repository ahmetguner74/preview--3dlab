
import React from 'react';
import { Image, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { uploadFileToStorage } from '@/utils/mediaHelpers';
import { Project } from '@/types/project';

interface ThumbnailUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  thumbnail?: string;
  onThumbnailUpdated: (thumbnailUrl: string) => void;
}

const ThumbnailUploader: React.FC<ThumbnailUploaderProps> = ({
  projectId,
  isEditing,
  thumbnail,
  onThumbnailUpdated
}) => {
  const handleImageUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadFileToStorage(file, 'projects');
      
      if (!imageUrl) {
        throw new Error('Görsel yüklenemedi');
      }
      
      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update({ thumbnail: imageUrl })
          .eq('id', projectId);
        
        if (error) throw error;
      }
      
      toast.success('Proje görseli güncellendi');
      onThumbnailUpdated(imageUrl);
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!projectId) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .update({ thumbnail: null })
        .eq('id', projectId);
      
      if (error) throw error;
      
      toast.success('Görsel silindi');
      onThumbnailUpdated('');
    } catch (error) {
      console.error('Görsel silinirken hata:', error);
      toast.error('Görsel silinemedi');
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium mb-2">Proje Kapak Görseli</h3>
      <p className="text-sm text-gray-500 mb-2">Bu görsel ana sayfada ve proje listesinde kullanılacaktır.</p>
      
      {thumbnail ? (
        <div className="mb-4 relative">
          <div className="aspect-video bg-gray-100 rounded overflow-hidden">
            <img 
              src={thumbnail} 
              alt="Kapak görseli" 
              className="w-full h-full object-cover"
            />
          </div>
          <Button 
            variant="destructive" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={handleDeleteThumbnail}
          >
            <X size={16} />
          </Button>
        </div>
      ) : null}
      
      <FileUploadBox 
        onFileSelected={handleImageUpload}
        title="Kapak Görseli Yükle"
        description="PNG, JPG, WEBP formatları desteklenir. Maksimum 5MB."
        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
      />
    </div>
  );
};

export default ThumbnailUploader;
