
import React from 'react';

interface PointCloudIframeProps {
  url: string;
  onLoad: () => void;
  onError: () => void;
  isAgisoftCloud?: boolean;
}

const PointCloudIframe: React.FC<PointCloudIframeProps> = ({ 
  url, 
  onLoad, 
  onError, 
  isAgisoftCloud = false 
}) => {
  return (
    <iframe 
      src={url}
      className="w-full h-full border-0"
      onLoad={onLoad}
      onError={onError}
      title="Nokta Bulutu Görüntüleyici"
      sandbox={isAgisoftCloud ? "allow-scripts allow-same-origin allow-popups allow-forms" : "allow-scripts allow-same-origin"}
      allow={isAgisoftCloud ? "fullscreen; autoplay; clipboard-write" : "fullscreen; autoplay"}
      allowFullScreen={true}
    />
  );
};

export default PointCloudIframe;
