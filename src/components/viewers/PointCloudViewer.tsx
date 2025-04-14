
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface PointCloudViewerProps {
  pointCloudUrl: string;
}

const PointCloudViewer: React.FC<PointCloudViewerProps> = ({ pointCloudUrl }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  
  // URL doğrulama
  React.useEffect(() => {
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
  
  if (!isValidUrl) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <AlertTriangle className="h-12 w-12 text-gray-400 mb-2" />
        <p>Geçersiz nokta bulutu URL'si.</p>
        <p className="text-sm">Lütfen geçerli bir Potree URL'si girin</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <AlertTriangle className="h-12 w-12 text-gray-400 mb-2" />
        <p>{error}</p>
        <p className="text-sm">Potree nokta bulutu görüntüleyici yüklenirken bir hata oluştu.</p>
      </div>
    );
  }
  
  return (
    <div className="w-full h-[500px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2 text-sm">Nokta bulutu yükleniyor...</p>
        </div>
      )}
      
      <iframe 
        src={pointCloudUrl}
        className="w-full h-full border-0"
        onLoad={handleIframeLoaded}
        onError={handleIframeError}
        title="Potree Nokta Bulutu Görüntüleyici"
        sandbox="allow-scripts allow-same-origin"
        allow="fullscreen; autoplay"
      />
      
      <div className="absolute bottom-4 left-4 z-20 bg-white/80 p-2 rounded text-xs">
        <strong>Kaynak:</strong> <a href={pointCloudUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{new URL(pointCloudUrl).hostname}</a>
      </div>
    </div>
  );
};

export default PointCloudViewer;
