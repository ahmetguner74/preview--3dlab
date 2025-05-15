
import React from 'react';
import { Box } from 'lucide-react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { upload3DModel } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Project3DModel } from '@/types/project';

interface ModelUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  onModelAdded: (models: Project3DModel[]) => void;
}

const ModelUploader: React.FC<ModelUploaderProps> = ({ 
  projectId, 
  isEditing,
  onModelAdded
}) => {
  const handle3DModelUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
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
          
          onModelAdded(typedModels as Project3DModel[]);
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
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Model Dosyası Yükle</h3>
      <FileUploadBox 
        onFileSelected={handle3DModelUpload}
        title="3D Model Yükle"
        description="OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir."
        icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['obj', 'gltf', 'glb']}
      />
    </div>
  );
};

export default ModelUploader;
