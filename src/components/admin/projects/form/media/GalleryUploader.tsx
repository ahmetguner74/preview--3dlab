
import React from 'react';
import { Image, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { ProjectImage } from '@/types/project';
import { uploadProjectImage } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface GalleryUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  onImagesUpdated: () => Promise<void>;
}

const GalleryUploader: React.FC<GalleryUploaderProps> = ({
  projectId,
  isEditing,
  projectImages,
  onImagesUpdated
}) => {
  const galleryImages = projectImages.filter(img => img.image_type === 'gallery');
  
  const handleImageUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, 'gallery');
      if (imageUrl) {
        toast.success('Görsel başarıyla yüklendi');
        await onImagesUpdated();
      } else {
        toast.error('Görsel yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error);
      toast.error('Görsel yüklenirken bir hata oluştu');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      toast.success('Görsel başarıyla silindi');
      await onImagesUpdated();
    } catch (error) {
      console.error('Görsel silinirken hata:', error);
      toast.error('Görsel silinirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium mb-2">Galeri Görselleri</h3>
      <FileUploadBox 
        onFileSelected={handleImageUpload}
        title="Görsel Ekle"
        description="Birden fazla görsel ekleyebilirsiniz. Sürükleyerek sıralayabilirsiniz."
        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
      />

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {galleryImages.map(img => (
            <div key={img.id} className="relative group">
              <img 
                src={img.image_url} 
                alt="Galeri görseli" 
                className="w-full h-24 object-cover rounded-md"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button 
                  variant="destructive" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => handleDeleteImage(img.id)}
                >
                  <X size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryUploader;
