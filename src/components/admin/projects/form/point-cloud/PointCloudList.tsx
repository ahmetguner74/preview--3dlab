
import React from 'react';
import { Button } from "@/components/ui/button";
import { Project3DModel } from '@/types/project';
import { X, Code, Link, Cloud } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";

interface PointCloudListProps {
  models: Project3DModel[];
  onPointCloudDeleted: () => void;
}

const PointCloudList: React.FC<PointCloudListProps> = ({ models, onPointCloudDeleted }) => {
  const pointCloudModels = models.filter(model => model.model_type === 'point_cloud');

  const handleDeletePointCloud = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      onPointCloudDeleted();
      toast.success('Nokta bulutu başarıyla silindi');
    } catch (error) {
      console.error('Nokta bulutu silinirken hata:', error);
      toast.error('Nokta bulutu silinirken bir hata oluştu');
    }
  };

  if (pointCloudModels.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-2">Yüklü Nokta Bulutları</h3>
      <div className="space-y-2">
        {pointCloudModels.map(model => (
          <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <div className="flex items-center overflow-hidden">
              {model.model_url.includes('<iframe') ? (
                <Code className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
              ) : model.model_url.includes('cloud.agisoft.com') ? (
                <img 
                  src="/cloud-agisoft-logo.png" 
                  alt="Agisoft Cloud" 
                  className="h-5 w-5 mr-2 flex-shrink-0" 
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              ) : model.model_url.startsWith('http') && !model.model_url.includes('storage.googleapis') ? (
                <Link className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              ) : (
                <Cloud className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              )}
              <div className="truncate">
                {model.model_url.includes('<iframe') ? (
                  <span className="text-sm text-purple-700">Agisoft Cloud iframe</span>
                ) : (
                  <a 
                    href={model.model_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline text-sm truncate"
                  >
                    {model.model_url.includes('cloud.agisoft.com') 
                      ? 'Agisoft Cloud Projesi' 
                      : (model.model_url.split('/').pop() || model.model_url)}
                  </a>
                )}
              </div>
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
  );
};

export default PointCloudList;
