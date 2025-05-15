
import React from 'react';
import { Box } from 'lucide-react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Project3DModel } from '@/types/project';
import { useModelUpload } from '@/hooks/useModelUpload';

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
  const { isUploading, handle3DModelUpload } = useModelUpload({
    projectId,
    isEditing,
    onModelsAdded: onModelAdded
  });

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Model Dosyası Yükle</h3>
      <FileUploadBox 
        onFileSelected={handle3DModelUpload}
        title="3D Model Yükle"
        description="OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir."
        icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['obj', 'gltf', 'glb']}
        isUploading={isUploading}
      />
    </div>
  );
};

export default ModelUploader;
