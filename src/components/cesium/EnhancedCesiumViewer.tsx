
import React, { useEffect, useRef, useCallback } from 'react';
import { Viewer as CesiumViewer, createWorldTerrainAsync, Ion, Cartesian3, Cesium3DTileset, ImageryLayer, WebMapServiceImageryProvider } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { CesiumLayer } from '@/types/cesium';

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
      }
    }
  }, []);

  // Katman yükleme fonksiyonu
  const loadLayer = useCallback(async (layer: CesiumLayer) => {
    if (!viewerRef.current) return;

    try {
      console.log(`${layer.name} katmanı yükleniyor...`, layer);
      
      let loadedResource;

      switch (layer.layer_type) {
        case 'pointcloud':
        case 'mesh':
        case 'tileset':
          loadedResource = await Cesium3DTileset.fromUrl(layer.data_url);
          viewerRef.current.scene.primitives.add(loadedResource);
          break;
          
        case 'ortho':
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
          
        default:
          console.warn(`Desteklenmeyen katman türü: ${layer.layer_type}`);
          return;
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
        console.log(`${layer.name} katmanı başarıyla yüklendi`);
      }
    } catch (error) {
      console.error(`${layer.name} katmanı yüklenirken hata:`, error);
      onLayerLoad?.(layer.id, false);
    }
  }, [onLayerLoad]);

  // Katman kaldırma fonksiyonu
  const removeLayer = useCallback((layerId: string) => {
    if (!viewerRef.current) return;
    
    const loadedResource = loadedLayersRef.current.get(layerId);
    if (loadedResource) {
      if (viewerRef.current.scene.primitives.contains(loadedResource)) {
        viewerRef.current.scene.primitives.remove(loadedResource);
      } else if (viewerRef.current.imageryLayers.contains(loadedResource)) {
        viewerRef.current.imageryLayers.remove(loadedResource);
      }
      loadedLayersRef.current.delete(layerId);
    }
  }, []);

  // Viewer'ı initialize et
  useEffect(() => {
    if (!cesiumContainer.current) return;

    checkContainerSize();

    // Cesium Ion token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUPB2qVhFUdcCRAKyzvs6IjQLJY';

    const initViewer = async () => {
      try {
        const terrainProvider = await createWorldTerrainAsync();
        
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
          infoBox: true,
          selectionIndicator: true
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        viewerRef.current = viewer;
        console.log('Cesium viewer başarıyla oluşturuldu');
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
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
