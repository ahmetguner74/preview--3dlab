
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
  // Modellerden iframe/sketchfab olanları ve olmayanları ayrı ayrı yönet
  const isSketchfabModel = activeModelUrl && activeModelUrl.includes('<iframe') && activeModelUrl.includes('sketchfab.com');
  const isFabModel = activeModelUrl && activeModelUrl.startsWith('https://fab.com/');

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
            {models.map((model, idx) => {
              // Model türünü belirle
              const isSketchfab = model.url.includes('<iframe') && model.url.includes('sketchfab.com');
              const isFab = model.url.startsWith('https://fab.com/');
              
              return (
                <div 
                  key={idx} 
                  className={`p-4 border rounded hover:bg-gray-50 cursor-pointer ${
                    activeModelUrl === model.url ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => onModelSelect(model.url)}
                >
                  <div className="flex items-center">
                    {isSketchfab ? (
                      <>
                        <span className="w-4 h-4 bg-purple-500 rounded-full mr-2"></span>
                        <p className="truncate text-sm">Sketchfab Modeli</p>
                      </>
                    ) : isFab ? (
                      <>
                        <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
                        <p className="truncate text-sm">Fab.com Modeli</p>
                      </>
                    ) : (
                      <p className="truncate text-sm">{model.url.split('/').pop()}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectThreeDModel;
