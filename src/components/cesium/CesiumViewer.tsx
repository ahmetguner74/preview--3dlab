
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
        
        // Token kullanmadan basit bir viewer oluştur
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          // Terrain sağlayıcısını devre dışı bırak
          terrainProvider: undefined,
          // UI kontrollerini minimal tutma
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
          // Hata yönetimi
          requestRenderMode: false,
          maximumRenderTimeChange: undefined
        });

        // Hata durumlarını yakalama
        viewer.scene.renderError.addEventListener((error) => {
          console.warn('Cesium render uyarısı:', error);
          // Hata durumunda viewer'ı yeniden başlatma
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        // Temel ayarlar
        viewer.scene.globe.enableLighting = false;
        viewer.scene.skyBox.show = true;
        viewer.scene.sun.show = true;
        viewer.scene.moon.show = false;

        viewerRef.current = viewer;
        setIsLoaded(true);
        console.log('Cesium viewer başarıyla yüklendi');
        toast.success('3D Harita Yüklendi');
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('3D Harita yüklenirken hata oluştu');
        
        // Hata durumunda tekrar deneme
        setTimeout(() => {
          console.log('Cesium viewer tekrar deneniliyor...');
          if (!viewerRef.current) {
            initViewer();
          }
        }, 2000);
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
        
        // Dosya türü kontrolü
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const supportedFormats = ['3tz', 'json', 'b3dm', 'pnts', 'i3dm', 'cmpt'];
        
        if (!fileExt || !supportedFormats.includes(fileExt)) {
          toast.error(`Desteklenmeyen dosya türü: ${file.name}`);
          continue;
        }

        // Dosyayı okuma
        const fileUrl = URL.createObjectURL(file);
        
        try {
          console.log(`3D Tileset yükleniyor: ${file.name}`);
          
          // 3D Tiles dosyası yükleme
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
          
          // Sahneye ekleme
          viewerRef.current.scene.primitives.add(tileset);
          
          // Model yüklendiğinde kamerayı odakla
          tileset.readyPromise.then(() => {
            console.log(`${file.name} tileset hazır, kamera odaklanıyor...`);
            viewerRef.current?.zoomTo(tileset);
            toast.success(`${file.name} başarıyla yüklendi`);
          }).catch((readyError: any) => {
            console.warn('Tileset ready promise uyarısı:', readyError);
            toast.success(`${file.name} yüklendi (bazı detaylar eksik olabilir)`);
          });
            
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
      {/* Cesium Container */}
      <div ref={cesiumContainer} className="absolute inset-0" />
      
      {/* Upload Button */}
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
            <p>3D Harita Yükleniyor...</p>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
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
