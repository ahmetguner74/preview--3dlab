
import React, { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer, createWorldTerrainAsync, Ion, Cartesian3, Cesium3DTileset } from 'cesium';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumViewerProps {
  className?: string;
}

const CesiumViewerComponent: React.FC<CesiumViewerProps> = ({ className = "h-screen w-full" }) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Cesium Ion token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZWNmNzI1NS0wNDRjLTRjN2QtYjMyMi0zMGIxMGU3MDBmYzkiLCJpZCI6NDE3MTMsImlhdCI6MTc0ODcyNjI5Mn0.ARU7thee8WkbfLvADG4jsebahgLZNWEoFoT2Ya42DiE';

    const initViewer = async () => {
      try {
        let terrainProvider;
        try {
          terrainProvider = await createWorldTerrainAsync();
        } catch (terrainError) {
          console.warn('World Terrain yüklenemedi, varsayılan terrain kullanılıyor');
          terrainProvider = undefined;
        }
        
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          terrainProvider,
          homeButton: false,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: false,
          vrButton: false,
          geocoder: false,
          infoBox: false,
          selectionIndicator: false
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        viewerRef.current = viewer;
        setIsLoaded(true);
        toast.success('3D Dünya Haritası Yüklendi');
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('3D Harita yüklenirken hata oluştu');
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !viewerRef.current) return;

    setLoading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Dosya türü kontrolü
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const supportedFormats = ['3tz', 'json', 'b3dm', 'pnts', 'i3dm', 'cmpt', 'glb', 'gltf'];
        
        if (!fileExt || !supportedFormats.includes(fileExt)) {
          toast.error(`Desteklenmeyen dosya türü: ${file.name}`);
          continue;
        }

        // Dosyayı okuma
        const fileUrl = URL.createObjectURL(file);
        
        try {
          if (fileExt === 'glb' || fileExt === 'gltf') {
            toast.info(`${file.name}: GLB/GLTF desteği sınırlı`);
            continue;
          } else {
            // 3D Tiles dosyaları
            const tileset = await Cesium3DTileset.fromUrl(fileUrl, {
              maximumScreenSpaceError: 16
            });
            
            // Sahneye ekleme
            viewerRef.current.scene.primitives.add(tileset);
            
            // Kamerayı modele yönlendirme
            viewerRef.current.zoomTo(tileset);
            
            toast.success(`${file.name} yüklendi`);
          }
        } catch (modelError) {
          console.error(`Model yükleme hatası (${file.name}):`, modelError);
          toast.error(`${file.name} yüklenemedi`);
        }
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      toast.error('Dosyalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className} bg-black overflow-hidden`}>
      {/* Cesium Container */}
      <div ref={cesiumContainer} className="absolute inset-0" />
      
      {/* Minimalist Upload Button */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-10">
          <Button
            onClick={triggerFileUpload}
            disabled={loading}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
          >
            <Upload size={16} className="mr-2" />
            {loading ? 'Yükleniyor...' : '3D Model Yükle'}
          </Button>
        </div>
      )}

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>3D Dünya Haritası Yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".3tz,.json,.b3dm,.pnts,.i3dm,.cmpt,.glb,.gltf"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default CesiumViewerComponent;
