
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
  const [isAgisoftCloud, setIsAgisoftCloud] = useState<boolean>(false);

  // URL doğrulama ve işleme
  useEffect(() => {
    if (!pointCloudUrl) {
      setIsValidUrl(false);
      setIsLoading(false);
      return;
    }

    try {
      // Doğrudan iframe URL'si olduğunda
      if (pointCloudUrl.includes('<iframe')) {
        // iframe src değerini çıkaralım
        const srcMatch = pointCloudUrl.match(/src="([^"]+)"/);
        if (srcMatch && srcMatch[1]) {
          setProcessedUrl(srcMatch[1]);
          setIsAgisoftCloud(srcMatch[1].includes('cloud.agisoft.com'));
          setIsValidUrl(true);
        } else {
          throw new Error("Geçersiz iframe kodu");
        }
      } else {
        // Normal URL
        const url = new URL(pointCloudUrl);
        
        // Eğer Agisoft Cloud URL'si ise
        if (url.hostname === 'cloud.agisoft.com') {
          setIsAgisoftCloud(true);
          
          // Eğer zaten embed URL'si değilse
          if (pointCloudUrl.includes('/embedded/')) {
            setProcessedUrl(pointCloudUrl);
          } else {
            // /project/ ile başlayan URL'leri /embedded/ formatına çevirelim
            const embeddedUrl = pointCloudUrl.replace('/project/', '/embedded/');
            setProcessedUrl(embeddedUrl);
          }
        } else {
          setProcessedUrl(pointCloudUrl);
          setIsAgisoftCloud(false);
        }
        
        setIsValidUrl(true);
      }
    } catch (e) {
      console.error("URL işlenirken hata:", e);
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
        isAgisoftCloud={isAgisoftCloud}
      />
      
      <PointCloudSource url={pointCloudUrl} />
    </div>
  );
};

export default PointCloudViewer;
