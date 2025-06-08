
import React, { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer, Cartesian3, Cesium3DTileset } from 'cesium';
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

    const initViewer = async () => {
      try {
        console.log('Cesium viewer başlatılıyor...');
        
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          terrainProvider: undefined,
          homeButton: true,
          sceneModePicker: false,
          baseLayerPicker: false,
          navigationHelpButton: false,
          animation: false,
          timeline: false,
          fullscreenButton: true,
          vrButton: false,
          geocoder: false,
          infoBox: false,
          selectionIndicator: true,
          requestRenderMode: false,
          maximumRenderTimeChange: undefined
        });

        // Tüm varsayılan imagery katmanlarını güvenli şekilde kaldır
        try {
          viewer.scene.imageryLayers.removeAll();
          console.log('Varsayılan imagery katmanları kaldırıldı');
        } catch (imageryError) {
          console.warn('Imagery katmanları kaldırılırken uyarı:', imageryError);
        }

        // Globe ayarlarını güvenli hale getir
        if (viewer.scene.globe) {
          viewer.scene.globe.enableLighting = false;
          viewer.scene.globe.showWaterEffect = false;
          viewer.scene.globe.showGroundAtmosphere = false;
          viewer.scene.globe.show = true; // Globe'u göster ama efektleri kapat
        }
        
        // Sky ve atmosphere ayarları
        if (viewer.scene.skyBox) {
          viewer.scene.skyBox.show = false;
        }
        if (viewer.scene.sun) {
          viewer.scene.sun.show = false;
        }
        if (viewer.scene.moon) {
          viewer.scene.moon.show = false;
        }
        if (viewer.scene.skyAtmosphere) {
          viewer.scene.skyAtmosphere.show = false;
        }

        // Arka plan rengini ayarla
        viewer.scene.backgroundColor = new (window as any).Cesium.Color(0.0, 0.0, 0.0, 1.0);

        // Error handling'i iyileştir
        viewer.scene.renderError.addEventListener((error) => {
          console.warn('Cesium render uyarısı:', error);
          // Render hatalarını sessizce logla, UI'ı bozma
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        viewerRef.current = viewer;
        setIsLoaded(true);
        console.log('Cesium viewer başarıyla yüklendi');
        toast.success('3D Harita Yüklendi');
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('3D Harita yüklenirken hata oluştu');
        
        // Tekrar denemeyi sınırla
        setTimeout(() => {
          if (!viewerRef.current) {
            console.log('Cesium viewer basit modda tekrar deneniyor...');
            initSimpleViewer();
          }
        }, 3000);
      }
    };

    // Basit viewer alternatifi
    const initSimpleViewer = () => {
      try {
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          terrainProvider: undefined,
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
          selectionIndicator: false,
          requestRenderMode: true,
          maximumRenderTimeChange: 0.5
        });

        // Minimal ayarlar
        viewer.scene.imageryLayers.removeAll();
        viewer.scene.globe.show = false;
        viewer.scene.skyBox.show = false;
        viewer.scene.sun.show = false;
        viewer.scene.moon.show = false;
        viewer.scene.skyAtmosphere.show = false;

        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        viewerRef.current = viewer;
        setIsLoaded(true);
        console.log('Cesium viewer basit modda yüklendi');
        toast.success('3D Harita Basit Modda Yüklendi');
      } catch (simpleError) {
        console.error('Basit viewer da oluşturulamadı:', simpleError);
        toast.error('3D Harita yüklenemedi');
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        try {
          viewerRef.current.destroy();
          viewerRef.current = null;
        } catch (error) {
          console.warn('Viewer destroy hatası:', error);
        }
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
        
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const supportedFormats = ['3tz', 'json', 'b3dm', 'pnts', 'i3dm', 'cmpt'];
        
        if (!fileExt || !supportedFormats.includes(fileExt)) {
          toast.error(`Desteklenmeyen dosya türü: ${file.name}`);
          continue;
        }

        const fileUrl = URL.createObjectURL(file);
        
        try {
          console.log(`3D Tileset yükleniyor: ${file.name}`);
          
          const tileset = await Cesium3DTileset.fromUrl(fileUrl, {
            maximumScreenSpaceError: 16,
            skipLevelOfDetail: true,
            baseScreenSpaceError: 1024,
            skipScreenSpaceErrorFactor: 16,
            skipLevels: 1,
            immediatelyLoadDesiredLevelOfDetail: false,
            loadSiblings: false,
            cullWithChildrenBounds: true
          });
          
          viewerRef.current.scene.primitives.add(tileset);
          
          // Tileset yüklendikten sonra direkt zoom yap
          try {
            console.log(`${file.name} tileset yüklendi, kamera odaklanıyor...`);
            viewerRef.current?.zoomTo(tileset);
            toast.success(`${file.name} başarıyla yüklendi`);
          } catch (zoomError) {
            console.warn('Kamera odaklama hatası:', zoomError);
            toast.success(`${file.name} yüklendi (kamera odaklama uyarısı ile)`);
          }
            
        } catch (modelError) {
          console.error(`Model yükleme hatası (${file.name}):`, modelError);
          toast.error(`${file.name} yüklenemedi: Format hatası`);
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
      <div ref={cesiumContainer} className="absolute inset-0" />
      
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

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>3D Harita Yükleniyor...</p>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".3tz,.json,.b3dm,.pnts,.i3dm,.cmpt"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default CesiumViewerComponent;
