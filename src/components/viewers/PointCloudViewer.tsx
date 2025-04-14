
import React, { useRef, useState, useEffect } from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';

interface PointCloudViewerProps {
  pointCloudUrl: string;
}

const PointCloudViewer: React.FC<PointCloudViewerProps> = ({ pointCloudUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  
  // Global olarak THREE'yi tanımla (Potree'nin ihtiyacı var)
  useEffect(() => {
    // THREE'yi global scope'a at - Potree buna ihtiyaç duyuyor
    window.THREE = THREE;
  }, []);
  
  // Potree yükleme ve kurulumu
  useEffect(() => {
    // URL'nin geçerli bir nokta bulutu dosyası olup olmadığını kontrol et
    if (!pointCloudUrl) {
      setIsValidUrl(false);
      setIsLoading(false);
      return;
    }
    
    const extension = pointCloudUrl.split('.').pop()?.toLowerCase();
    const validExtensions = ['las', 'laz', 'xyz', 'pts'];
    
    if (!extension || !validExtensions.includes(extension)) {
      setIsValidUrl(false);
      setIsLoading(false);
      return;
    }

    let potreeViewer: any = null;
    
    const initPotree = async () => {
      try {
        setIsLoading(true);

        // Potree'yi dinamik olarak import et
        const Potree = await import('potree-core');
        
        if (!containerRef.current) return;
        
        // Mevcut bir viewer varsa temizle
        if (containerRef.current.children.length > 0) {
          containerRef.current.innerHTML = '';
        }
        
        // Yeni bir Potree viewer oluştur
        potreeViewer = new Potree.Viewer(containerRef.current);
        potreeViewer.setEDLEnabled(true);
        potreeViewer.setFOV(60);
        potreeViewer.setPointBudget(1_000_000);
        potreeViewer.loadSettingsFromURL();
        
        // Potree viewer'ı global değişkene kaydet (yeniden boyutlandırma için)
        window.potreeViewer = potreeViewer;
        
        // Nokta bulutu yükleme
        Potree.loadPointCloud(pointCloudUrl, "pointcloud", (e: any) => {
          potreeViewer.scene.addPointCloud(e.pointcloud);
          
          // Kamera ayarlarını yap
          const camera = potreeViewer.scene.getActiveCamera();
          camera.near = 0.01;
          camera.far = 1000;
          
          // Nokta bulutunu görüntü merkezine yerleştir
          potreeViewer.fitToScreen();
          
          setIsLoading(false);
        });
        
      } catch (err) {
        console.error("Potree yüklenirken hata:", err);
        setError("Nokta bulutu görüntüleyici yüklenemedi.");
        setIsLoading(false);
      }
    };
    
    initPotree();
    
    // Cleanup
    return () => {
      if (potreeViewer) {
        potreeViewer.dispose();
      }
    };
  }, [pointCloudUrl]);
  
  // Sayfa boyutu değişimlerinde görüntüleyiciyi yeniden boyutlandır
  useEffect(() => {
    const handleResize = () => {
      // Eğer potreeViewer varsa onun resize metodunu çağır
      if (window.potreeViewer) {
        window.potreeViewer.resize();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  if (!isValidUrl) {
    return (
      <div className="w-full h-[500px] flex flex-col items-center justify-center bg-gray-100 text-gray-500">
        <AlertTriangle className="h-12 w-12 text-gray-400 mb-2" />
        <p>Geçersiz nokta bulutu URL'si.</p>
        <p className="text-sm">Desteklenen formatlar: LAS, LAZ, XYZ, PTS</p>
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
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ visibility: isLoading ? 'hidden' : 'visible' }}
      />
      
      {/* Nokta bulutu bilgisi */}
      <div className="absolute bottom-4 left-4 z-20 bg-white/80 p-2 rounded text-xs">
        <strong>Dosya:</strong> {pointCloudUrl.split('/').pop()}
      </div>
      
      {/* Yardım bilgisi */}
      <div className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded text-xs">
        <p>Fare ile çevir, yaklaşma-uzaklaşma için kaydırın</p>
      </div>
    </div>
  );
};

// TypeScript için global tanımlamalar
declare global {
  interface Window {
    potreeViewer: any;
    THREE: typeof THREE;
  }
}

export default PointCloudViewer;
