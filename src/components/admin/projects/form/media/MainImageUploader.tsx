
import React from 'react';
import { Image, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { ProjectImage } from '@/types/project';
import { uploadProjectImage } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface MainImageUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  onImagesUpdated: () => Promise<void>;
}

const MainImageUploader: React.FC<MainImageUploaderProps> = ({
  projectId,
  isEditing,
  projectImages,
  onImagesUpdated
}) => {
  const mainImages = projectImages.filter(img => img.image_type === 'main');
  
  const handleImageUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, 'main');
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
      <h3 className="text-md font-medium mb-2">Ana Görsel</h3>
      <FileUploadBox 
        onFileSelected={handleImageUpload}
        title="Ana Görsel Yükle"
        description="PNG, JPG, GIF formatları desteklenir. Maksimum 5MB."
        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
      />

      {mainImages.length > 0 && (
        <div className="mt-4">
          {mainImages.map(img => (
            <div key={img.id} className="relative">
              <img 
                src={img.image_url} 
                alt="Ana görsel" 
                className="w-full h-48 object-cover rounded-md"
              />
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute top-2 right-2"
                onClick={() => handleDeleteImage(img.id)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainImageUploader;
