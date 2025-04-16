
import React, { useState } from 'react';
import { Image, X, FileImage } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { uploadFileToStorage } from '@/utils/mediaHelpers';
import ImagePreviewDialog from '@/components/admin/ImagePreviewDialog';

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
  const [previewOpen, setPreviewOpen] = useState(false);

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
      
      toast.success('Proje kapak görseli güncellendi');
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

  const handlePreviewClick = () => {
    if (thumbnail) {
      setPreviewOpen(true);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white mb-6">
      <h3 className="text-lg font-medium mb-2">Proje Kapak Görseli</h3>
      <p className="text-sm text-gray-500 mb-4">Bu görsel ana sayfada ve proje listesinde kullanılacaktır.</p>
      
      {thumbnail ? (
        <div className="mb-4 relative">
          <div 
            className="aspect-video bg-gray-100 rounded overflow-hidden cursor-pointer"
            onClick={handlePreviewClick}
          >
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
      ) : (
        <div className="mb-6 border-2 border-dashed rounded-md p-6 text-center transition-colors border-gray-300">
          <FileImage className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Kapak Görseli Yok</h3>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP formatları desteklenir.</p>
        </div>
      )}
      
      <FileUploadBox 
        onFileSelected={handleImageUpload}
        title="Kapak Görseli Yükle"
        description="PNG, JPG, WEBP formatları desteklenir. Maksimum 5MB."
        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
      />

      <ImagePreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        imageUrl={thumbnail || null}
      />
    </div>
  );
};

export default ThumbnailUploader;
