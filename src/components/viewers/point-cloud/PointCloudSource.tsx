
import React from 'react';

interface PointCloudSourceProps {
  url: string;
}

const PointCloudSource: React.FC<PointCloudSourceProps> = ({ url }) => {
  try {
    const hostname = new URL(url).hostname;
    
    return (
      <div className="absolute bottom-4 left-4 z-20 bg-white/80 p-2 rounded text-xs">
        <strong>Kaynak:</strong> <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{hostname}</a>
      </div>
    );
  } catch (e) {
    return null;
  }
};

export default PointCloudSource;
