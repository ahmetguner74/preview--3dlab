
import React from 'react';
import { Box, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Project3DModel } from '@/types/project';
import { upload3DModel } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface ModelTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  project3DModels: Project3DModel[];
  setProject3DModels: React.Dispatch<React.SetStateAction<Project3DModel[]>>;
}

const ModelTab: React.FC<ModelTabProps> = ({
  projectId,
  isEditing,
  project3DModels,
  setProject3DModels
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
        
        // Yeni model listesini güncelle
        const { data, error } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectId)
          .eq('model_type', '3d_model');
          
        if (!error && data) {
          console.log('Supabase\'den gelen model verileri:', data);
          
          // Tip dönüşümünü açıkça yaparak model_type'ın "3d_model" veya "point_cloud" olduğundan emin olalım
          const typedModels = data.map(model => ({
            ...model,
            model_type: model.model_type as "3d_model" | "point_cloud"
          }));
          
          setProject3DModels(prev => [
            ...prev.filter(model => model.model_type !== '3d_model'),
            ...(typedModels as Project3DModel[])
          ]);
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

  const handleDelete3DModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      setProject3DModels(project3DModels.filter(model => model.id !== modelId));
      toast.success('Model başarıyla silindi');
    } catch (error) {
      console.error('Model silinirken hata:', error);
      toast.error('Model silinirken bir hata oluştu');
    }
  };

  const threeJSModels = project3DModels.filter(model => model.model_type === '3d_model');

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">3D Model</h2>
        <p className="text-sm text-gray-500">Projeye ait 3D modelleri buradan yükleyebilirsiniz.</p>
      </div>
      
      <FileUploadBox 
        onFileSelected={handle3DModelUpload}
        title="3D Model Yükle"
        description="OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir."
        icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['obj', 'gltf', 'glb']}
      />

      {/* 3D Model Listesi */}
      {threeJSModels.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Yüklü 3D Modeller</h3>
          <div className="space-y-2">
            {threeJSModels.map(model => (
              <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <Box className="h-5 w-5 mr-2 text-gray-500" />
                  <a 
                    href={model.model_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm truncate max-w-md"
                  >
                    {model.model_url.split('/').pop()}
                  </a>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete3DModel(model.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelTab;
