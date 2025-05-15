
import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Project3DModel } from '@/types/project';
import FabUrlForm from './model/FabUrlForm';
import SketchfabEmbedForm from './model/SketchfabEmbedForm';
import ModelUploader from './model/ModelUploader';
import ModelList from './model/ModelList';

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
  const handleModelAdded = (newModel: Project3DModel) => {
    setProject3DModels(prev => [...prev, newModel]);
  };

  const handleModelsAdded = (models: Project3DModel[]) => {
    setProject3DModels(prev => [
      ...prev.filter(model => model.model_type !== '3d_model'),
      ...models
    ]);
  };

  const handleModelDeleted = (modelId: string) => {
    setProject3DModels(prev => prev.filter(model => model.id !== modelId));
  };

  // Sadece 3D Model tipindeki modelleri filtrele
  const threeJSModels = project3DModels.filter(model => model.model_type === '3d_model');

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">3D Model</h2>
        <p className="text-sm text-gray-500">Projeye ait 3D modelleri buradan yükleyebilir veya harici kaynaklardan ekleyebilirsiniz.</p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="fab" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fab">Fab.com URL</TabsTrigger>
            <TabsTrigger value="sketchfab">Sketchfab Embed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fab" className="mt-4 p-4 border border-dashed rounded-lg">
            <FabUrlForm 
              projectId={projectId}
              isEditing={isEditing}
              onModelAdded={handleModelAdded}
            />
          </TabsContent>
          
          <TabsContent value="sketchfab" className="mt-4 p-4 border border-dashed rounded-lg">
            <SketchfabEmbedForm 
              projectId={projectId}
              isEditing={isEditing}
              onModelAdded={handleModelAdded}
            />
          </TabsContent>
        </Tabs>
      </div>

      <ModelUploader
        projectId={projectId}
        isEditing={isEditing}
        onModelAdded={handleModelsAdded}
      />

      <ModelList 
        models={threeJSModels}
        onModelDeleted={handleModelDeleted}
      />
    </div>
  );
};

export default ModelTab;
