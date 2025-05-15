
import React from 'react';
import { Button } from "@/components/ui/button";
import { Box, X, ExternalLink, Code } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Project3DModel } from '@/types/project';

interface ModelListProps {
  models: Project3DModel[];
  onModelDeleted: (modelId: string) => void;
}

const ModelList: React.FC<ModelListProps> = ({ models, onModelDeleted }) => {
  const handleDelete = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      onModelDeleted(modelId);
      toast.success('Model başarıyla silindi');
    } catch (error) {
      console.error('Model silinirken hata:', error);
      toast.error('Model silinirken bir hata oluştu');
    }
  };

  if (models.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-md font-medium mb-2">Yüklü 3D Modeller</h3>
      <div className="space-y-2">
        {models.map(model => (
          <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <div className="flex items-center flex-1 min-w-0">
              {model.model_url.includes('<iframe') ? (
                <Code className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
              ) : model.model_url.startsWith('https://fab.com/') ? (
                <Box className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
              ) : (
                <Box className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
              )}
              
              {model.model_url.includes('<iframe') ? (
                <span className="text-sm truncate text-purple-700">
                  Sketchfab Modeli
                </span>
              ) : model.model_url.startsWith('https://fab.com/') ? (
                <a 
                  href={model.model_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm truncate flex items-center"
                >
                  <span className="truncate">{model.model_url}</span>
                  <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />
                </a>
              ) : (
                <span className="text-sm truncate">
                  {model.model_url.split('/').pop()}
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => handleDelete(model.id)}
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModelList;
