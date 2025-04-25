
import React, { useEffect, useRef, useState } from 'react';
import Marzipano from 'marzipano';

interface Position {
  yaw: number;
  pitch: number;
}

interface Panorama {
  id: string;
  image_url: string;
  title: string;
  initial_view?: {
    yaw: number;
    pitch: number;
    fov: number;
  };
  hotspots?: Array<{
    id: string;
    title: string;
    description?: string;
    position: Position;
    target_panorama_id?: string;
    hotspot_type: 'info' | 'link' | 'custom';
    custom_data?: any;
  }>;
}

interface VirtualTourViewerProps {
  panoramas: Panorama[];
  initialPanorama: Panorama;
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({
  panoramas,
  initialPanorama
}) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [currentScene, setCurrentScene] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!viewerRef.current || !initialPanorama) return;

    // Marzipano görüntüleyici ayarları
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag'
      }
    };

    // Görüntüleyiciyi oluştur
    const viewer = new Marzipano.Viewer(viewerRef.current, viewerOpts);
    viewerInstanceRef.current = viewer;

    // İlk panoramayı yükle
    loadPanorama(initialPanorama);

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
      }
    };
  }, [initialPanorama]);

  const loadPanorama = async (panorama: Panorama) => {
    if (!viewerInstanceRef.current) return;

    setIsLoading(true);

    try {
      const source = Marzipano.ImageUrlSource.fromUrl(panorama.image_url);
      const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
      
      const limiter = Marzipano.RectilinearView.limit.traditional(
        4000,
        100 * Math.PI / 180
      );
      
      const view = new Marzipano.RectilinearView({
        yaw: panorama.initial_view?.yaw || 0,
        pitch: panorama.initial_view?.pitch || 0,
        fov: panorama.initial_view?.fov || Math.PI/2
      }, limiter);

      // Sahneyi oluştur
      const scene = viewerInstanceRef.current.createScene({
        source: source,
        geometry: geometry,
        view: view,
        pinFirstLevel: true
      });

      // Hotspotları ekle
      if (panorama.hotspots) {
        panorama.hotspots.forEach(hotspot => {
          const element = document.createElement('div');
          element.className = 'hotspot';
          
          const button = document.createElement('button');
          button.className = 'bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors';
          
          if (hotspot.hotspot_type === 'link') {
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
            button.onclick = () => {
              const targetPanorama = panoramas.find(p => p.id === hotspot.target_panorama_id);
              if (targetPanorama) {
                loadPanorama(targetPanorama);
              }
            };
          } else {
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`;
          }
          
          element.appendChild(button);
          
          scene.hotspotContainer().createHotspot(element, { 
            yaw: hotspot.position.yaw,
            pitch: hotspot.position.pitch
          });
        });
      }

      // Önceki sahneyi kaldır ve yenisine geç
      if (currentScene) {
        currentScene.destroy();
      }
      
      scene.switchTo();
      setCurrentScene(scene);
    } catch (error) {
      console.error('Panorama yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <div 
        ref={viewerRef} 
        className="w-full aspect-[16/9] bg-black"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white">Yükleniyor...</div>
        </div>
      )}
    </div>
  );
};

export default VirtualTourViewer;
