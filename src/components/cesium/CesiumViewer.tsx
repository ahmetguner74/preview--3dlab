
import React, { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer, createWorldTerrainAsync, Ion, Cartesian3, Cesium3DTileset } from 'cesium';
import { Button } from '@/components/ui/button';
import { Upload, FileCheck, AlertCircle, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumViewerProps {
  className?: string;
}

interface LoadedModel {
  id: string;
  name: string;
  tileset: Cesium3DTileset;
}

const CesiumViewerComponent: React.FC<CesiumViewerProps> = ({ className = "h-screen w-full" }) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadedModels, setLoadedModels] = useState<LoadedModel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Yeni Cesium Ion token
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
        toast.success('Cesium haritası başarıyla yüklendi');
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
    const files = event.target.files;
    if (!files || files.length === 0 || !viewerRef.current) return;

    setLoading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Dosya türü kontrolü
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const supportedFormats = ['3tz', 'json', 'b3dm', 'pnts', 'i3dm', 'cmpt', 'glb', 'gltf', 'las', 'laz', 'zip'];
        
        if (!fileExt || !supportedFormats.includes(fileExt)) {
          toast.error(`Desteklenmeyen dosya türü: ${file.name}`);
          continue;
        }

        // Dosyayı okuma
        const fileUrl = URL.createObjectURL(file);
        
        // 3D Tileset oluşturma
        try {
          const tileset = await Cesium3DTileset.fromUrl(fileUrl);
          
          // Sahneye ekleme
          viewerRef.current.scene.primitives.add(tileset);
          
          // Model listesine ekleme
          const modelId = `model_${Date.now()}_${i}`;
          setLoadedModels(prev => [...prev, {
            id: modelId,
            name: file.name,
            tileset: tileset
          }]);
          
          // Kamerayı modele yönlendirme
          viewerRef.current.zoomTo(tileset);
          
          toast.success(`${file.name} başarıyla yüklendi ve görüntülendi`);
        } catch (modelError) {
          console.error(`Model yükleme hatası (${file.name}):`, modelError);
          toast.error(`${file.name} yüklenemedi. Dosya formatını kontrol edin.`);
        }
      }
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      toast.error('Dosyalar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
      // Input değerini temizle
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeModel = (modelId: string) => {
    if (!viewerRef.current) return;
    
    const model = loadedModels.find(m => m.id === modelId);
    if (model) {
      viewerRef.current.scene.primitives.remove(model.tileset);
      setLoadedModels(prev => prev.filter(m => m.id !== modelId));
      toast.success(`${model.name} kaldırıldı`);
    }
  };

  const focusOnModel = (modelId: string) => {
    if (!viewerRef.current) return;
    
    const model = loadedModels.find(m => m.id === modelId);
    if (model) {
      viewerRef.current.zoomTo(model.tileset);
      toast.info(`${model.name} modeline odaklanıldı`);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const getSupportedFormatsText = () => {
    return "3D Tiles (.3tz, tileset.json, .b3dm, .pnts, .i3dm, .cmpt), 3D Modeller (.glb, .gltf), Nokta Bulutu (.las, .laz), ZIP Arşivleri";
  };

  return (
    <div className={`relative ${className} bg-black overflow-hidden`}>
      {/* Cesium Container */}
      <div ref={cesiumContainer} className="absolute inset-0" />
      
      {/* Dosya Yükleme UI */}
      {isLoaded && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-lg">3D Model Yükleme</h3>
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
            
            <div className="text-xs text-gray-600 mb-3">
              <strong>Desteklenen formatlar:</strong><br />
              {getSupportedFormatsText()}
            </div>

            {loadedModels.length > 0 && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">
                  Yüklenen Modeller ({loadedModels.length}):
                </div>
                {loadedModels.map((model) => (
                  <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                    <span 
                      className="truncate cursor-pointer hover:text-blue-600 flex-1 mr-2"
                      onClick={() => focusOnModel(model.id)}
                      title={`${model.name} - Odaklanmak için tıklayın`}
                    >
                      {model.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModel(model.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Welcome Message */}
      {isLoaded && loadedModels.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 text-center shadow-xl max-w-md">
            <Upload size={48} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-medium text-gray-800 mb-3">
              3D Modellerinizi Yükleyin
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Desteklenen formatlar:</strong>
            </p>
            <p className="text-xs text-gray-500">
              {getSupportedFormatsText()}
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
        accept=".3tz,.json,.b3dm,.pnts,.i3dm,.cmpt,.glb,.gltf,.las,.laz,.zip"
        onChange={handleFileUpload}
        className="hidden"
        multiple
      />
    </div>
  );
};

export default CesiumViewerComponent;
