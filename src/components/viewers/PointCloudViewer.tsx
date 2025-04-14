
import React, { useRef, useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
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

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;
    let pointcloud: any = null;
    
    const initScene = async () => {
      try {
        setIsLoading(true);
        
        // Scripts'i yükleme fonksiyonu
        const loadScript = (url: string): Promise<void> => {
          return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${url}"]`)) {
              console.log("Script zaten yüklü:", url);
              resolve();
              return;
            }
            
            const script = document.createElement('script');
            script.src = url;
            script.crossOrigin = 'anonymous';
            script.onload = () => {
              console.log("Script yüklendi:", url);
              resolve();
            };
            script.onerror = (error) => {
              console.error("Script yükleme hatası:", url, error);
              reject(new Error(`Script yüklenemedi: ${url}`));
            };
            
            document.head.appendChild(script);
          });
        };
        
        // Potree scriptlerini sırayla yükle
        try {
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/build/potree/potree.min.js');
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/other/BinaryHeap.js');
        } catch (err) {
          console.error("Potree scriptleri yüklenemedi:", err);
          throw new Error("Potree yüklenemedi: " + (err instanceof Error ? err.message : String(err)));
        }
        
        const potree = (window as any).Potree;
        
        if (!potree) {
          throw new Error("Potree yüklenemedi");
        }
        
        if (!containerRef.current) return;
        
        if (containerRef.current.children.length > 0) {
          containerRef.current.innerHTML = '';
        }
        
        scene = new THREE.Scene();
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);
        
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(0xffffff);
        containerRef.current.appendChild(renderer.domElement);
        
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.25;
        controls.screenSpacePanning = false;
        controls.maxPolarAngle = Math.PI / 1.8;
        controls.target.set(0, 0, 0);
        
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        console.log("Nokta bulutu yükleniyor:", pointCloudUrl);
        
        try {
          if (potree.PointCloudOctreeLoader) {
            const pcoLoader = new potree.PointCloudOctreeLoader();
            
            // Promise ile load metodu
            new Promise<any>((resolve, reject) => {
              try {
                pcoLoader.load(pointCloudUrl)
                  .then((points: any) => {
                    resolve(points);
                  })
                  .catch((err: any) => {
                    reject(err);
                  });
              } catch (loadError) {
                reject(loadError);
              }
            })
            .then((points) => {
              if (!points) {
                throw new Error("Nokta bulutu yüklenemedi");
              }
              
              pointcloud = points;
              if (scene) scene.add(pointcloud);
              
              if (pointcloud.material) {
                pointcloud.material.size = 1;
                pointcloud.material.pointSizeType = 0; // fixed
                pointcloud.material.shape = 1; // square point shape
              }
              
              if (pointcloud.boundingBox) {
                const box = pointcloud.boundingBox;
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                if (camera) {
                  camera.position.copy(center);
                  camera.position.z += Math.max(size.x, size.y, size.z) * 2;
                }
                
                if (controls) {
                  controls.target.copy(center);
                }
              }
              
              setIsLoading(false);
            })
            .catch((err) => {
              console.error("Nokta bulutu yükleme hatası:", err);
              setError(`Nokta bulutu yüklenirken hata: ${err instanceof Error ? err.message : String(err)}`);
              setIsLoading(false);
            });
          } else {
            throw new Error("Potree PointCloudOctreeLoader bulunamadı");
          }
        } catch (loadError) {
          console.error("Nokta bulutu yükleme hatası:", loadError);
          throw loadError;
        }
        
        const handleResize = () => {
          if (!containerRef.current || !camera || !renderer) return;
          
          const width = containerRef.current.clientWidth;
          const height = containerRef.current.clientHeight;
          
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };
        
        window.addEventListener('resize', handleResize);
        
        const animate = () => {
          if (scene && camera && renderer && controls) {
            requestAnimationFrame(animate);
            controls.update();
            
            if (pointcloud && pointcloud.material && pointcloud.material.uniforms) {
              pointcloud.material.uniforms.uScreenHeight.value = renderer.domElement.clientHeight;
              pointcloud.material.uniforms.uScreenWidth.value = renderer.domElement.clientWidth;
              pointcloud.material.uniforms.uUseEDL.value = false;
            }
            
            renderer.render(scene, camera);
          }
        };
        
        animate();
        
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
    
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup();
      }
    };
  }, [pointCloudUrl]);
  
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
      
      <div className="absolute bottom-4 left-4 z-20 bg-white/80 p-2 rounded text-xs">
        <strong>Dosya:</strong> {pointCloudUrl.split('/').pop()}
      </div>
      
      <div className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded text-xs">
        <p>Fare ile çevir, yaklaşma-uzaklaşma için kaydırın</p>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    Potree: any;
  }
}

export default PointCloudViewer;
