
import React, { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer, createWorldTerrainAsync, Ion, Cartesian3, Cesium3DTileset } from 'cesium';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck, AlertCircle } from 'lucide-react';
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
  const [hasModel, setHasModel] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Yeni Cesium Ion token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZWNmNzI1NS0wNDRjLTRjN2QtYjMyMi0zMGIxMGU3MDBmYzkiLCJpZCI6NDE3MTMsImlhdCI6MTc0ODcyNjI5Mn0.ARU7thee8WkbfLvADG4jsebahgLZNWEoFoT2Ya42DiE';

    const initViewer = async () => {
      try {
        const terrainProvider = await createWorldTerrainAsync();
        
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          terrainProvider,
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: true,
          animation: false,
          timeline: false,
          fullscreenButton: true,
          vrButton: false,
          geocoder: true,
          infoBox: true,
          selectionIndicator: true
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        viewerRef.current = viewer;
        setIsLoaded(true);
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('Cesium viewer yüklenirken hata oluştu');
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
    const file = event.target.files?.[0];
    if (!file || !viewerRef.current) return;

    // Dosya türü kontrolü
    if (!file.name.endsWith('.json') && !file.name.endsWith('.3tz')) {
      toast.error('Lütfen geçerli bir tileset.json veya .3tz dosyası seçin');
      return;
    }

    setLoading(true);

    try {
      // Dosyayı okuma
      const fileUrl = URL.createObjectURL(file);
      
      // 3D Tileset oluşturma
      const tileset = await Cesium3DTileset.fromUrl(fileUrl);
      
      // Sahneye ekleme
      viewerRef.current.scene.primitives.add(tileset);
      
      // Kamerayı modele yönlendirme
      viewerRef.current.zoomTo(tileset);
      
      setHasModel(true);
      toast.success(`${file.name} başarıyla yüklendi`);
      
    } catch (error) {
      console.error('Model yükleme hatası:', error);
      toast.error('Model yüklenirken hata oluştu. Dosya formatını kontrol edin.');
    } finally {
      setLoading(false);
      // Input değerini temizle
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
      
      {/* Overlay UI */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                {hasModel ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FileCheck size={16} />
                    <span>Model yüklendi</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-gray-600">
                    <AlertCircle size={16} />
                    <span>3D Tiles dosyası yükleyin</span>
                  </div>
                )}
              </div>
              <Button
                onClick={triggerFileUpload}
                disabled={loading}
                size="sm"
                className="flex items-center gap-2"
              >
                <Upload size={14} />
                {loading ? 'Yükleniyor...' : 'Dosya Seç'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {isLoaded && !hasModel && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-xl">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium text-gray-800 mb-2">
              Lütfen bir 3D Tiles dosyası yükleyin
            </h2>
            <p className="text-sm text-gray-600">
              Desteklenen formatlar: tileset.json, .3tz
            </p>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Cesium Viewer yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.3tz"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default CesiumViewerComponent;
