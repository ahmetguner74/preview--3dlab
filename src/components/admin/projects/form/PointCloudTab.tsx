
import React from 'react';
import { Cloud, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Project3DModel } from '@/types/project';
import { upload3DModel } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface PointCloudTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  project3DModels: Project3DModel[];
  setProject3DModels: React.Dispatch<React.SetStateAction<Project3DModel[]>>;
}

const PointCloudTab: React.FC<PointCloudTabProps> = ({
  projectId,
  isEditing,
  project3DModels,
  setProject3DModels
}) => {
  const handlePointCloudUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      console.log(`Nokta bulutu yükleme başlatılıyor: ${file.name}`);
      const modelUrl = await upload3DModel(file, projectId!, 'point_cloud');
      if (modelUrl) {
        toast.success('Nokta bulutu başarıyla yüklendi');
        console.log('Nokta bulutu URL alındı:', modelUrl);
        
        // Yeni nokta bulutu listesini güncelle
        const { data, error } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectId)
          .eq('model_type', 'point_cloud');
          
        if (!error && data) {
          console.log('Supabase\'den gelen nokta bulutu verileri:', data);
          
          // Tip dönüşümünü açıkça yaparak model_type'ın "3d_model" veya "point_cloud" olduğundan emin olalım
          const typedModels = data.map(model => ({
            ...model,
            model_type: model.model_type as "3d_model" | "point_cloud"
          }));
          
          setProject3DModels(prev => [
            ...prev.filter(model => model.model_type !== 'point_cloud'),
            ...(typedModels as Project3DModel[])
          ]);
        } else {
          console.error('Nokta bulutu verileri alınırken hata:', error);
        }
      } else {
        toast.error('Nokta bulutu yüklenirken bir hata oluştu');
        console.error('Nokta bulutu URL alınamadı');
      }
    } catch (error) {
      console.error('Nokta bulutu yüklenirken hata:', error);
      toast.error('Nokta bulutu yüklenirken bir hata oluştu');
    }
  };

  const handleDeletePointCloud = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      setProject3DModels(project3DModels.filter(model => model.id !== modelId));
      toast.success('Nokta bulutu başarıyla silindi');
    } catch (error) {
      console.error('Nokta bulutu silinirken hata:', error);
      toast.error('Nokta bulutu silinirken bir hata oluştu');
    }
  };

  const pointCloudModels = project3DModels.filter(model => model.model_type === 'point_cloud');

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Nokta Bulutu (Point Cloud)</h2>
        <p className="text-sm text-gray-500">Projeye ait nokta bulutu verilerini buradan yükleyebilirsiniz.</p>
      </div>
      
      <FileUploadBox 
        onFileSelected={handlePointCloudUpload}
        title="Nokta Bulutu Yükle"
        description="LAZ, LAS formatları desteklenir. Nokta bulutu Potree ile görüntülenecektir."
        icon={<Cloud className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['laz', 'las', 'xyz', 'pts']}
      />

      {/* Nokta Bulutu Listesi */}
      {pointCloudModels.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Yüklü Nokta Bulutları</h3>
          <div className="space-y-2">
            {pointCloudModels.map(model => (
              <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center">
                  <Cloud className="h-5 w-5 mr-2 text-gray-500" />
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
                  onClick={() => handleDeletePointCloud(model.id)}
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

export default PointCloudTab;
