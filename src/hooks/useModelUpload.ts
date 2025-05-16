
import { useState } from 'react';
import { upload3DModel } from '@/utils/project3DModels';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Project3DModel } from '@/types/project';

interface UseModelUploadProps {
  projectId: string | undefined;
  isEditing: boolean;
  onModelsAdded: (models: Project3DModel[]) => void;
}

export const useModelUpload = ({ projectId, isEditing, onModelsAdded }: UseModelUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

  const handle3DModelUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    setIsUploading(true);
    
    try {
      console.log(`3D model yükleme başlatılıyor: ${file.name}`);
      const modelUrl = await upload3DModel(file, projectId!, '3d_model');
      
      if (modelUrl) {
        toast.success('Model başarıyla yüklendi');
        console.log('Model URL alındı:', modelUrl);
        
        const { data, error } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectId)
          .eq('model_type', '3d_model');
          
        if (!error && data) {
          console.log('Supabase\'den gelen model verileri:', data);
          
          const typedModels = data.map(model => ({
            ...model,
            model_type: model.model_type as "3d_model" | "point_cloud"
          }));
          
          onModelsAdded(typedModels as Project3DModel[]);
        } else {
          console.error('Model verileri alınırken hata:', error);
        }
      } else {
        toast.error('Model yüklenirken bir hata oluştu');
        console.error('Model URL alınamadı');
      }
    } catch (error) {
      console.error('Model yüklenirken hata:', error);
      toast.error('Model yüklenirken bir hata oluştu');
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    handle3DModelUpload
  };
};
