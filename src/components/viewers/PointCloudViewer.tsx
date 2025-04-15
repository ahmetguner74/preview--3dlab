
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
  const [processedUrl, setProcessedUrl] = useState<string>(pointCloudUrl);

  // URL doğrulama ve işleme
  useEffect(() => {
    if (!pointCloudUrl) {
      setIsValidUrl(false);
      setIsLoading(false);
      return;
    }

    try {
      const url = new URL(pointCloudUrl);
      
      // Eğer Agisoft Cloud URL'si ise
      if (url.hostname === 'cloud.agisoft.com') {
        // Burada Agisoft Cloud için özel URL işleme yapılabilir
        // Örneğin: Embed linki oluşturma, iframe boyutlandırma vb.
        const embeddedUrl = pointCloudUrl.replace('/project/', '/embed/');
        setProcessedUrl(embeddedUrl);
      }

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
        url={processedUrl}
        onLoad={handleIframeLoaded}
        onError={handleIframeError}
      />
      
      <PointCloudSource url={pointCloudUrl} />
    </div>
  );
};

export default PointCloudViewer;
