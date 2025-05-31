
import React, { useEffect, useRef, useCallback } from 'react';
import { Viewer as CesiumViewer, createWorldTerrainAsync, Ion, Cartesian3, Cesium3DTileset, ImageryLayer, WebMapServiceImageryProvider } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { CesiumLayer } from '@/types/cesium';
import { toast } from 'sonner';

interface EnhancedCesiumViewerProps {
  className?: string;
  layers: CesiumLayer[];
  onLayerLoad?: (layerId: string, success: boolean) => void;
}

const EnhancedCesiumViewer: React.FC<EnhancedCesiumViewerProps> = ({ 
  className = "h-full w-full", 
  layers,
  onLayerLoad 
}) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const loadedLayersRef = useRef<Map<string, any>>(new Map());

  // Container boyutlarını kontrol et
  const checkContainerSize = useCallback(() => {
    if (cesiumContainer.current) {
      const rect = cesiumContainer.current.getBoundingClientRect();
      console.log('Cesium Container Boyutları:', {
        width: rect.width,
        height: rect.height,
        display: window.getComputedStyle(cesiumContainer.current).display,
        visibility: window.getComputedStyle(cesiumContainer.current).visibility
      });
      
      if (rect.width === 0 || rect.height === 0) {
        console.warn('Cesium container boyutları sıfır! CSS kontrol edilmeli.');
        toast.error('Cesium container boyut sorunu tespit edildi');
      }
    }
  }, []);

  // Katman yükleme fonksiyonu
  const loadLayer = useCallback(async (layer: CesiumLayer) => {
    if (!viewerRef.current) {
      console.error('Cesium viewer henüz hazır değil');
      toast.error('Cesium viewer henüz hazır değil');
      return;
    }

    try {
      console.log(`${layer.name} katmanı yükleniyor...`, layer);
      toast.info(`${layer.name} katmanı yükleniyor...`);
      
      let loadedResource;

      switch (layer.layer_type) {
        case 'pointcloud':
        case 'mesh':
        case 'tileset':
          try {
            // URL'nin geçerli olup olmadığını kontrol et
            if (!layer.data_url || !layer.data_url.trim()) {
              throw new Error('Katman URL\'si boş veya geçersiz');
            }

            console.log(`3D Tileset yükleniyor: ${layer.data_url}`);
            loadedResource = await Cesium3DTileset.fromUrl(layer.data_url);
            
            if (!loadedResource) {
              throw new Error('3D Tileset oluşturulamadı');
            }

            viewerRef.current.scene.primitives.add(loadedResource);
            
            // Model yüklendikten sonra kamerayı modele odakla
            try {
              await viewerRef.current.zoomTo(loadedResource);
              console.log(`Kamera ${layer.name} modeline odaklandı`);
            } catch (zoomError) {
              console.warn('Kamera odaklama hatası:', zoomError);
              // Zoom hatası kritik değil, sadece uyar
            }
            
            break;
          } catch (tilesetError) {
            console.error('3D Tileset yükleme hatası:', tilesetError);
            throw new Error(`3D Tileset yüklenemedi: ${tilesetError.message}`);
          }
          
        case 'ortho':
          try {
            if (!layer.data_url || !layer.data_url.trim()) {
              throw new Error('Ortofoto URL\'si boş veya geçersiz');
            }

            const imageryProvider = new WebMapServiceImageryProvider({
              url: layer.data_url,
              layers: layer.metadata?.layers || 'default',
              parameters: {
                format: 'image/png',
                transparent: true,
                ...layer.metadata?.parameters
              }
            });
            loadedResource = new ImageryLayer(imageryProvider);
            viewerRef.current.imageryLayers.add(loadedResource);
            break;
          } catch (orthoError) {
            console.error('Ortofoto yükleme hatası:', orthoError);
            throw new Error(`Ortofoto yüklenemedi: ${orthoError.message}`);
          }
          
        default:
          throw new Error(`Desteklenmeyen katman türü: ${layer.layer_type}`);
      }

      if (loadedResource) {
        // Görünürlük ve şeffaflık ayarlarını uygula
        if ('show' in loadedResource) {
          loadedResource.show = layer.visible;
        }
        
        if ('alpha' in loadedResource) {
          loadedResource.alpha = layer.opacity;
        }

        loadedLayersRef.current.set(layer.id, loadedResource);
        onLayerLoad?.(layer.id, true);
        
        toast.success(`${layer.name} başarıyla yüklendi ve görüntülendi`);
        console.log(`${layer.name} katmanı başarıyla yüklendi`);
      }
    } catch (error: any) {
      console.error(`${layer.name} katmanı yüklenirken hata:`, error);
      const errorMessage = error.message || 'Bilinmeyen hata oluştu';
      toast.error(`${layer.name} yüklenemedi: ${errorMessage}`);
      onLayerLoad?.(layer.id, false);
    }
  }, [onLayerLoad]);

  // Katman kaldırma fonksiyonu
  const removeLayer = useCallback((layerId: string) => {
    if (!viewerRef.current) return;
    
    const loadedResource = loadedLayersRef.current.get(layerId);
    if (loadedResource) {
      try {
        if (viewerRef.current.scene.primitives.contains(loadedResource)) {
          viewerRef.current.scene.primitives.remove(loadedResource);
        } else if (viewerRef.current.imageryLayers.contains(loadedResource)) {
          viewerRef.current.imageryLayers.remove(loadedResource);
        }
        loadedLayersRef.current.delete(layerId);
        console.log(`Katman kaldırıldı: ${layerId}`);
      } catch (error) {
        console.error('Katman kaldırma hatası:', error);
      }
    }
  }, []);

  // Viewer'ı initialize et
  useEffect(() => {
    if (!cesiumContainer.current) return;

    checkContainerSize();

    // Güncellenmiş Cesium Ion token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZWNmNzI1NS0wNDRjLTRjN2QtYjMyMi0zMGIxMGU3MDBmYzkiLCJpZCI6NDE3MTMsImlhdCI6MTc0ODcyNjI5Mn0.ARU7thee8WkbfLvADG4jsebahgLZNWEoFoT2Ya42DiE';

    const initViewer = async () => {
      try {
        console.log('Cesium viewer oluşturuluyor...');
        toast.info('Cesium haritası yükleniyor...');

        const terrainProvider = await createWorldTerrainAsync();
        console.log('Terrain provider hazırlandı');
        
        const viewer = new CesiumViewer(cesiumContainer.current!, {
          terrainProvider,
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: false,
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
        console.log('Cesium viewer başarıyla oluşturuldu');
        toast.success('Cesium haritası başarıyla yüklendi');
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('Cesium haritası yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current && !viewerRef.current.isDestroyed()) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        loadedLayersRef.current.clear();
      }
    };
  }, [checkContainerSize]);

  // Katmanları güncelle
  useEffect(() => {
    if (!viewerRef.current) return;

    const currentLayerIds = new Set(loadedLayersRef.current.keys());
    const newLayerIds = new Set(layers.map(layer => layer.id));

    // Kaldırılacak katmanları belirle
    currentLayerIds.forEach(layerId => {
      if (!newLayerIds.has(layerId)) {
        removeLayer(layerId);
      }
    });

    // Yeni katmanları yükle veya mevcut katmanları güncelle
    layers.forEach(layer => {
      const existingResource = loadedLayersRef.current.get(layer.id);
      
      if (existingResource) {
        // Mevcut katmanın görünürlük ve şeffaflığını güncelle
        if ('show' in existingResource) {
          existingResource.show = layer.visible;
        }
        if ('alpha' in existingResource) {
          existingResource.alpha = layer.opacity;
        }
      } else {
        // Yeni katman yükle
        loadLayer(layer);
      }
    });
  }, [layers, loadLayer, removeLayer]);

  return (
    <div 
      ref={cesiumContainer} 
      className={className}
      style={{ minHeight: '400px' }}
    />
  );
};

export default EnhancedCesiumViewer;
