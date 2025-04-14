
import React, { useState, useEffect } from 'react';
import PointCloudError from './point-cloud/PointCloudError';
import PointCloudLoading from './point-cloud/PointCloudLoading';
import PointCloudIframe from './point-cloud/PointCloudIframe';
import PointCloudSource from './point-cloud/PointCloudSource';

interface PointCloudViewerProps {
  pointCloudUrl: string;
}

const PointCloudViewer: React.FC<PointCloudViewerProps> = ({ pointCloudUrl }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  
  // URL doğrulama
  useEffect(() => {
    if (!pointCloudUrl) {
      setIsValidUrl(false);
      setIsLoading(false);
      return;
    }
    
    try {
      new URL(pointCloudUrl);
      setIsValidUrl(true);
    } catch (e) {
      setIsValidUrl(false);
      setError("Geçersiz URL formatı");
    } finally {
      setIsLoading(false);
    }
  }, [pointCloudUrl]);
  
  // iframe yüklendiğinde
  const handleIframeLoaded = () => {
    setIsLoading(false);
  };
  
  // iframe hata durumunda
  const handleIframeError = () => {
    setError("Nokta bulutu görüntülenirken bir hata oluştu");
    setIsLoading(false);
  };
  
  // Hata kontrolü
  if (!isValidUrl || error) {
    return <PointCloudError isValidUrl={isValidUrl} error={error} />;
  }
  
  return (
    <div className="w-full h-[500px] relative">
      <PointCloudLoading isLoading={isLoading} />
      
      <PointCloudIframe 
        url={pointCloudUrl}
        onLoad={handleIframeLoaded}
        onError={handleIframeError}
      />
      
      <PointCloudSource url={pointCloudUrl} />
    </div>
  );
};

export default PointCloudViewer;
