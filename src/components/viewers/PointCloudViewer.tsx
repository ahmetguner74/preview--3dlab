
import React, { useState, useEffect } from 'react';
import { Cloud } from 'lucide-react';

interface PointCloudViewerProps {
  pointCloudUrl: string;
}

// Not: Nokta bulutu görüntüleyici (Potree) entegrasyonu daha karmaşık olduğu için
// şimdilik basit bir mesaj gösteriyoruz. Gerçek bir Potree entegrasyonu ileride eklenecek.
const PointCloudViewer: React.FC<PointCloudViewerProps> = ({ pointCloudUrl }) => {
  const [isValidUrl, setIsValidUrl] = useState(false);

  useEffect(() => {
    // URL'nin geçerli bir nokta bulutu dosyası olup olmadığını kontrol et
    if (!pointCloudUrl) return;
    
    const extension = pointCloudUrl.split('.').pop()?.toLowerCase();
    const validExtensions = ['las', 'laz', 'xyz', 'pts'];
    
    setIsValidUrl(extension !== undefined && validExtensions.includes(extension));
  }, [pointCloudUrl]);

  if (!isValidUrl) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <p>Geçersiz nokta bulutu URL'si.</p>
        <p className="text-sm">Desteklenen formatlar: LAS, LAZ, XYZ, PTS</p>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100">
      <Cloud className="h-12 w-12 text-gray-400 mb-2" />
      <p className="text-gray-500 text-center">
        <span className="font-medium block">Nokta Bulutu Dosyası:</span>
        <span className="block text-sm break-all mt-1">{pointCloudUrl.split('/').pop()}</span>
      </p>
      <p className="text-gray-500 mt-4 text-center max-w-md px-4">
        Potree nokta bulutu görüntüleyici entegrasyonu için ek geliştirme gerekiyor. 
        Bu özellik yakında eklenecektir.
      </p>
    </div>
  );
};

export default PointCloudViewer;
