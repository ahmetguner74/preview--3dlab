
import React from 'react';
import { Project3DModel } from '@/types/project';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';

// Bileşen importları
import PointCloudInfoMessage from './point-cloud/PointCloudInfoMessage';
import PointCloudUrlForm from './point-cloud/PointCloudUrlForm';
import PointCloudIframeForm from './point-cloud/PointCloudIframeForm';
import PointCloudUploader from './point-cloud/PointCloudUploader';
import PointCloudList from './point-cloud/PointCloudList';

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
  const fetchPointCloudModels = async () => {
    if (!projectId) return;
    
    try {
      const { data, error } = await supabase
        .from('project_3d_models')
        .select('*')
        .eq('project_id', projectId)
        .eq('model_type', 'point_cloud');
        
      if (!error && data) {
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
    } catch (error) {
      console.error('Nokta bulutu verileri alınırken hata:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Nokta Bulutu (Point Cloud)</h2>
        <p className="text-sm text-gray-500">Projeye ait nokta bulutu verilerini buradan yükleyebilirsiniz.</p>
      </div>
      
      <PointCloudInfoMessage />
      
      <div className="mb-6 border border-gray-200 p-4 rounded">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL Ekle</TabsTrigger>
            <TabsTrigger value="iframe">iframe Kodu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <PointCloudUrlForm 
              projectId={projectId} 
              isEditing={isEditing} 
              onPointCloudAdded={fetchPointCloudModels} 
            />
            <p className="text-xs text-gray-500 mt-1">
              Potree veya Agisoft Cloud örneğinin tam URL'sini ekleyin
            </p>
          </TabsContent>
          
          <TabsContent value="iframe" className="mt-4">
            <PointCloudIframeForm 
              projectId={projectId} 
              isEditing={isEditing} 
              onPointCloudAdded={fetchPointCloudModels}
            />
            <p className="text-xs text-gray-500 mt-1">
              Agisoft Cloud gibi servislerden aldığınız iframe kodunu buraya yapıştırın
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      <PointCloudUploader 
        projectId={projectId} 
        isEditing={isEditing} 
        onPointCloudAdded={fetchPointCloudModels}
      />

      <PointCloudList 
        models={project3DModels} 
        onPointCloudDeleted={fetchPointCloudModels}
      />
    </div>
  );
};

export default PointCloudTab;
