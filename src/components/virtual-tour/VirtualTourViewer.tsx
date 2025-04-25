
import React, { useEffect, useRef } from 'react';
import Marzipano from 'marzipano';

interface VirtualTourViewerProps {
  imageUrl: string;
  initialView?: {
    yaw: number;
    pitch: number;
    fov: number;
  };
}

const VirtualTourViewer: React.FC<VirtualTourViewerProps> = ({ imageUrl, initialView }) => {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!viewerRef.current || !imageUrl) return;

    // Marzipano görüntüleyici ayarları
    const viewerOpts = {
      controls: {
        mouseViewMode: 'drag' // Fare ile sürükleme modu
      }
    };

    // Görüntüleyici oluştur
    const viewer = new Marzipano.Viewer(viewerRef.current, viewerOpts);
    viewerInstanceRef.current = viewer;

    // Kaynak görüntü ayarları
    const source = Marzipano.ImageUrlSource.fromUrl(imageUrl);
    const geometry = new Marzipano.EquirectGeometry([{ width: 4000 }]);
    const limiter = Marzipano.RectilinearView.limit.traditional(
      4000,
      100 * Math.PI / 180
    );
    const view = new Marzipano.RectilinearView({
      yaw: initialView?.yaw || 0,
      pitch: initialView?.pitch || 0,
      fov: initialView?.fov || Math.PI/2
    }, limiter);

    // Sahneyi oluştur ve göster
    const scene = viewer.createScene({
      source: source,
      geometry: geometry,
      view: view,
      pinFirstLevel: true
    });

    scene.switchTo();

    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.destroy();
      }
    };
  }, [imageUrl, initialView]);

  return (
    <div 
      ref={viewerRef} 
      className="w-full aspect-[16/9] bg-black relative"
    />
  );
};

export default VirtualTourViewer;
