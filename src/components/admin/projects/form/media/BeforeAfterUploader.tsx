
import React from 'react';
import { Image, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { ProjectImage } from '@/types/project';
import { uploadProjectImage } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface BeforeAfterUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  onImagesUpdated: () => Promise<void>;
}

const BeforeAfterUploader: React.FC<BeforeAfterUploaderProps> = ({
  projectId,
  isEditing,
  projectImages,
  onImagesUpdated
}) => {
  const beforeImages = projectImages.filter(img => img.image_type === 'before');
  const afterImages = projectImages.filter(img => img.image_type === 'after');
  
  const handleImageUpload = async (file: File, imageType: 'before' | 'after') => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, imageType);
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
      <h3 className="text-md font-medium mb-2">Before/After Görselleri</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <FileUploadBox 
            onFileSelected={(file) => handleImageUpload(file, 'before')}
            title="Öncesi Görseli"
            description="Önceki durumu gösteren görsel"
            icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
            allowedTypes={['jpg', 'jpeg', 'png']}
          />
          
          {beforeImages.length > 0 && (
            <div className="mt-4">
              {beforeImages.map(img => (
                <div key={img.id} className="relative">
                  <img 
                    src={img.image_url} 
                    alt="Before görseli" 
                    className="w-full h-32 object-cover rounded-md"
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
        
        <div>
          <FileUploadBox 
            onFileSelected={(file) => handleImageUpload(file, 'after')}
            title="Sonrası Görseli"
            description="Mevcut durumu gösteren görsel"
            icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
            allowedTypes={['jpg', 'jpeg', 'png']}
          />
          
          {afterImages.length > 0 && (
            <div className="mt-4">
              {afterImages.map(img => (
                <div key={img.id} className="relative">
                  <img 
                    src={img.image_url} 
                    alt="After görseli" 
                    className="w-full h-32 object-cover rounded-md"
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
      </div>
    </div>
  );
};

export default BeforeAfterUploader;
