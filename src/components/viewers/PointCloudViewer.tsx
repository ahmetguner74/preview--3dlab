
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
        const PotreeModule = await import('potree-core');
        const Potree = PotreeModule.default || PotreeModule;
        
        if (!containerRef.current) return;
        
        // Mevcut bir viewer varsa temizle
        if (containerRef.current.children.length > 0) {
          containerRef.current.innerHTML = '';
        }
        
        // Renderer ve sahne oluşturma
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setClearColor(0xffffff);
        containerRef.current.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);

        // Temel kontroller
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        
        // Nokta bulutu yükleme
        console.log("Nokta bulutu yükleme başlıyor: ", pointCloudUrl);
        
        try {
          const pco = await Potree.load(pointCloudUrl, renderer);
          scene.add(pco);
          
          // Otomatik merkezleme
          const box = pco.boundingBox;
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          camera.position.copy(center);
          camera.position.z += Math.max(size.x, size.y, size.z) * 2;
          controls.target.copy(center);
          
          // Animasyon döngüsü
          const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
          };
          
          animate();
          
          // Global değişkene kaydedelim (yeniden boyutlandırma için)
          window.potreeViewer = { 
            renderer, 
            scene, 
            camera, 
            controls,
            resize: () => {
              if (!containerRef.current) return;
              
              const width = containerRef.current.clientWidth;
              const height = containerRef.current.clientHeight;
              
              camera.aspect = width / height;
              camera.updateProjectionMatrix();
              renderer.setSize(width, height);
            }
          };
          
          setIsLoading(false);
        } catch (loadError) {
          console.error("Nokta bulutu yükleme hatası:", loadError);
          throw loadError;
        }
        
      } catch (err) {
        console.error("Potree yüklenirken hata:", err);
        setError("Nokta bulutu görüntüleyici yüklenemedi.");
        setIsLoading(false);
      }
    };
    
    initPotree();
    
    // Cleanup
    return () => {
      if (window.potreeViewer) {
        if (window.potreeViewer.renderer && window.potreeViewer.renderer.domElement) {
          window.potreeViewer.renderer.domElement.remove();
        }
        window.potreeViewer = undefined;
      }
    };
  }, [pointCloudUrl]);
  
  // Sayfa boyutu değişimlerinde görüntüleyiciyi yeniden boyutlandır
  useEffect(() => {
    const handleResize = () => {
      // Eğer potreeViewer varsa onun resize metodunu çağır
      if (window.potreeViewer && window.potreeViewer.resize) {
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

// Gerekli THREE.js uzantıları için global tanımlamalar
declare global {
  namespace THREE {
    class OrbitControls {
      constructor(camera: THREE.Camera, domElement: HTMLElement);
      update(): void;
      enableDamping: boolean;
      dampingFactor: number;
      target: THREE.Vector3;
    }
  }
}

export default PointCloudViewer;
