
import React from 'react';
import PointCloudViewer from '@/components/viewers/PointCloudViewer';

interface ProjectPointCloudProps {
  models: {url: string, type: string}[];
  activePointCloudUrl: string;
  onPointCloudSelect: (modelUrl: string) => void;
}

const ProjectPointCloud: React.FC<ProjectPointCloudProps> = ({ 
  models, 
  activePointCloudUrl,
  onPointCloudSelect
}) => {
  return (
    <>
      <PointCloudViewer pointCloudUrl={activePointCloudUrl} />
      
      {models.length > 1 && (
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Diğer Nokta Bulutları</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {models.map((model, idx) => (
              <div 
                key={idx} 
                className="p-4 border rounded hover:bg-gray-50 cursor-pointer"
                onClick={() => onPointCloudSelect(model.url)}
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

export default ProjectPointCloud;
