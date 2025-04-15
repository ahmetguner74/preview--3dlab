
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
                {/* iframe kodu için özel görüntüleme */}
                {model.url.includes('<iframe') ? (
                  <div className="flex items-center">
                    <img 
                      src="/cloud-agisoft-logo.png" 
                      alt="Agisoft Cloud" 
                      className="w-8 h-8 mr-2"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <p className="truncate text-sm">Agisoft iframe Projesi</p>
                  </div>
                ) : 
                /* Agisoft Cloud URL için özel görüntüleme */
                model.url.includes('cloud.agisoft.com') ? (
                  <div className="flex items-center">
                    <img 
                      src="/cloud-agisoft-logo.png" 
                      alt="Agisoft Cloud" 
                      className="w-8 h-8 mr-2"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                    <p className="truncate text-sm">Agisoft Bulut Projesi</p>
                  </div>
                ) : (
                  <p className="truncate text-sm">{model.url.split('/').pop()}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default ProjectPointCloud;
