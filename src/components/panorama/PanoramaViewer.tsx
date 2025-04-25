
import { useEffect, useRef, useState } from "react";
import { fetchHotspotsForPanorama } from "./SupabaseService";
import { toast } from "sonner";

// Marzipano türlerini tanımlama
declare global {
  interface Window {
    Marzipano: any;
  }
}

interface PanoramaViewerProps {
  sceneData: {
    id: string;
    image_url: string;
    title: string;
    initial_view?: {
      yaw: number;
      pitch: number;
      fov: number;
    };
  } | null;
}

const PanoramaViewer = ({ sceneData }: PanoramaViewerProps) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    if (!window.Marzipano) {
      toast.error("Marzipano kütüphanesi yüklenemedi");
      return;
    }
    
    // Eğer sahne varsa, hotspotları getir
    if (sceneData?.id) {
      fetchHotspotsForPanorama(sceneData.id)
        .then(data => {
          setHotspots(data);
        })
        .catch(error => {
          console.error("Hotspot verileri alınamadı:", error);
        });
    }
  }, [sceneData]);

  useEffect(() => {
    // Eğer yeni bir sahne yükleniyorsa
    if (viewerRef.current && sceneData) {
      // Önceki viewer'ı temizle
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }

      try {
        // Marzipano Viewer oluşturma
        const viewer = new window.Marzipano.Viewer(viewerRef.current);
        
        // 360° görsel için kaynak oluşturma
        const source = window.Marzipano.ImageUrlSource.fromUrl(sceneData.image_url);
        
        // Panorama geometrisi tanımla (ekvirect - equirectangular)
        const geometry = new window.Marzipano.EquirectGeometry([{ width: 4000 }]);
        
        // Görüntüleme seçenekleri
        const limiter = window.Marzipano.RectilinearView.limit.traditional(
          1024, // max pixel width
          100 * Math.PI / 180 // max yaw/pitch angle in radians (100 degrees)
        );
        
        const initialView = sceneData.initial_view || { yaw: 0, pitch: 0, fov: 1.5708 };
        
        const view = new window.Marzipano.RectilinearView({
          yaw: (initialView.yaw || 0) * Math.PI / 180,
          pitch: (initialView.pitch || 0) * Math.PI / 180,
          fov: initialView.fov || 1.5708 // yaklaşık 90 derece
        }, limiter);
        
        // Sahneyi oluştur ve ekle
        const scene = viewer.createScene({
          source: source,
          geometry: geometry,
          view: view,
          pinFirstLevel: true
        });
        
        // Sahneyi etkinleştir
        scene.switchTo();
        
        // Viewer referansını kaydet
        viewerInstanceRef.current = viewer;

        // Hotspot'ları ekle (eğer varsa)
        if (hotspots && hotspots.length > 0) {
          hotspots.forEach(hotspot => {
            const element = document.createElement('div');
            element.className = 'hotspot';
            element.style.width = '30px';
            element.style.height = '30px';
            element.style.borderRadius = '50%';
            element.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
            element.style.border = '2px solid white';
            element.style.cursor = 'pointer';
            element.title = hotspot.title || '';
            
            scene.hotspotContainer().createHotspot(element, {
              yaw: hotspot.position?.yaw * Math.PI / 180,
              pitch: hotspot.position?.pitch * Math.PI / 180
            });
          });
        }
      } catch (error) {
        console.error("Panorama yüklenirken hata:", error);
        toast.error("Panorama görüntülenirken bir hata oluştu");
      }
    }
    
    return () => {
      // Component unmount olduğunda viewer'ı temizle
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
        viewerInstanceRef.current = null;
      }
    };
  }, [sceneData, hotspots]);

  if (!sceneData) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-gray-100 text-gray-500">
        Görüntülenecek panorama seçilmedi
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={viewerRef} 
        className="w-full aspect-[16/9] bg-black"
      >
        {/* Marzipano viewer buraya eklenecek */}
      </div>
      <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
        {sceneData.title}
      </div>
    </div>
  );
};

export default PanoramaViewer;
