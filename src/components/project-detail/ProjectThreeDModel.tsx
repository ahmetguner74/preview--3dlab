
import React from 'react';
import ThreeModelViewer from '@/components/viewers/ThreeModelViewer';

interface ProjectThreeDModelProps {
  models: {url: string, type: string}[];
  activeModelUrl: string | null;
  onModelSelect: (modelUrl: string) => void;
}

const ProjectThreeDModel: React.FC<ProjectThreeDModelProps> = ({ 
  models, 
  activeModelUrl,
  onModelSelect
}) => {
  return (
    <>
      <div className="h-[500px] bg-arch-light-gray">
        {activeModelUrl ? (
          <ThreeModelViewer modelUrl={activeModelUrl} backgroundColor="#f5f5f5" />
        ) : (
          <div className="flex items-center justify-center h-full text-arch-gray">
            3D model bulunamadı
          </div>
        )}
      </div>
      
      {models.length > 1 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Diğer 3D Modeller</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {models.map((model, idx) => (
              <div 
                key={idx} 
                className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onModelSelect(model.url)}
              >
                <p className="truncate text-sm">{model.url.split('/').pop()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectThreeDModel;
