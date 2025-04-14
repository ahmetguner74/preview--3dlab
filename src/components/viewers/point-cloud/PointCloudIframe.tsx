
import React from 'react';

interface PointCloudIframeProps {
  url: string;
  onLoad: () => void;
  onError: () => void;
}

const PointCloudIframe: React.FC<PointCloudIframeProps> = ({ url, onLoad, onError }) => {
  return (
    <iframe 
      src={url}
      className="w-full h-full border-0"
      onLoad={onLoad}
      onError={onError}
      title="Potree Nokta Bulutu Görüntüleyici"
      sandbox="allow-scripts allow-same-origin"
      allow="fullscreen; autoplay"
    />
  );
};

export default PointCloudIframe;
