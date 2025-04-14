
import React, { useRef, useState, useEffect } from 'react';
import { Cloud, AlertTriangle } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface PointCloudViewerProps {
  pointCloudUrl: string;
}

const PointCloudViewer: React.FC<PointCloudViewerProps> = ({ pointCloudUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState<boolean>(true);
  
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

    // Değişkenler
    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    let pointcloud: any = null;
    let potree: any = null;
    
    // Potree'yi yükle
    const initScene = async () => {
      try {
        setIsLoading(true);
        
        // Potree'yi CDN üzerinden dinamik olarak yükle
        await loadPotreeScript('https://cdn.jsdelivr.net/npm/potree-core@1.8.2/build/potree.min.js');
        
        // Global potree değişkenini al
        potree = window.Potree;
        
        if (!potree) {
          throw new Error("Potree yüklenemedi");
        }
        
        if (!containerRef.current) return;
        
        // Mevcut container içeriğini temizle
        if (containerRef.current.children.length > 0) {
          containerRef.current.innerHTML = '';
        }
        
        // THREE.js sahne kurulumu
        scene = new THREE.Scene();
        
        // Kamera ayarları
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        // WebGL renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffffff);
        containerRef.current.appendChild(renderer.domElement);
        
        // Kontroller
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.target.set(0, 0, 0);
        
        // Işıklandırma
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Nokta bulutu yükleme
        console.log("Nokta bulutu yükleniyor:", pointCloudUrl);
        
        try {
          // Potree loaderı ile dosyayı yükle
          const pcoLoader = new potree.PointCloudOctreeLoader();
          pcoLoader.load(pointCloudUrl, (points: any) => {
            if (!points) {
              throw new Error("Nokta bulutu yüklenemedi");
            }
            
            pointcloud = points;
            scene?.add(pointcloud);
            
            // Nokta bulutu özelliklerini ayarla
            pointcloud.material.size = 1;
            pointcloud.material.pointSizeType = 0; // fixed
            pointcloud.material.shape = 1; // square point shape
            
            // Otomatik merkezleme
            if (pointcloud.boundingBox) {
              const box = pointcloud.boundingBox;
              const size = box.getSize(new THREE.Vector3());
              const center = box.getCenter(new THREE.Vector3());
              
              camera?.position.copy(center);
              camera?.position.z += Math.max(size.x, size.y, size.z) * 2;
              controls?.target.copy(center);
            }
            
            setIsLoading(false);
          });
        } catch (loadError) {
          console.error("Nokta bulutu yükleme hatası:", loadError);
          throw loadError;
        }
        
        // Yeniden boyutlandırma olayı
        const handleResize = () => {
          if (!containerRef.current || !camera || !renderer) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        // Animasyon döngüsü
        const animate = () => {
          if (scene && camera && renderer && controls) {
            requestAnimationFrame(animate);
            controls.update();
            
            // Nokta bulutu varsa güncelle
            if (pointcloud) {
              pointcloud.material.uniforms.uScreenHeight.value = renderer.domElement.clientHeight;
              pointcloud.material.uniforms.uScreenWidth.value = renderer.domElement.clientWidth;
              pointcloud.material.uniforms.uUseEDL.value = false;
            }
            
            renderer.render(scene, camera);
          }
        };
        
        animate();
        
        // Temizlik için işlevi kaydet
        return () => {
          window.removeEventListener('resize', handleResize);
          
          if (renderer && renderer.domElement) {
            renderer.domElement.remove();
          }
          
          if (pointcloud) {
            scene?.remove(pointcloud);
          }
          
          renderer?.dispose();
          scene = null;
          camera = null;
          renderer = null;
          controls = null;
          pointcloud = null;
        };
        
      } catch (error) {
        console.error("Potree yüklenirken hata:", error);
        setError(`Nokta bulutu görüntüleyici yüklenemedi: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
        setIsLoading(false);
        return () => {};
      }
    };
    
    const cleanup = initScene();
    
    // Komponentin umount olduğunda temizlik işlemi yap
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [pointCloudUrl]);
  
  // Potree script yükleyici yardımcı fonksiyonu
  const loadPotreeScript = (url: string) => {
    return new Promise<void>((resolve, reject) => {
      // Eğer script zaten yüklüyse tekrar yükleme
      if (document.querySelector(`script[src="${url}"]`)) {
        console.log("Potree script zaten yüklü");
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = url;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        console.log("Potree script yüklendi");
        resolve();
      };
      script.onerror = (error) => {
        console.error("Potree script yükleme hatası:", error);
        reject(new Error("Potree script yüklenemedi"));
      };
      
      document.head.appendChild(script);
    });
  };
  
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
    Potree: any;
  }
}

export default PointCloudViewer;
