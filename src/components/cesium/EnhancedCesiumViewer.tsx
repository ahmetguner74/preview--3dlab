
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
        return false;
      }
      return true;
    }
    return false;
  }, []);

  // URL doğrulama ve düzeltme fonksiyonu
  const validateAndFixUrl = useCallback(async (url: string): Promise<string> => {
    console.log('URL doğrulanıyor:', url);
    
    // Eğer URL zaten tam bir URL ise, doğruluğunu kontrol et
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        // HEAD request yerine basit URL formatı kontrolü yap
        new URL(url); // URL formatını kontrol et
        console.log('URL geçerli:', url);
        return url;
      } catch (error) {
        console.error('URL format hatası:', error);
        throw new Error(`Geçersiz URL formatı: ${url}`);
      }
    }
    
    // Supabase storage URL'lerini kontrol et
    if (url.includes('supabase.co/storage/')) {
      return url;
    }
    
    // Eğer göreli bir path ise, mutlak URL'ye çevir
    const baseUrl = window.location.origin;
    const fullUrl = url.startsWith('/') ? baseUrl + url : baseUrl + '/' + url;
    
    console.log('Göreli yol mutlak URL\'ye çevrildi:', fullUrl);
    return fullUrl;
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
            // URL'nin geçerli olup olmadığını kontrol et ve düzelt
            if (!layer.data_url || !layer.data_url.trim()) {
              throw new Error('Katman URL\'si boş veya geçersiz');
            }

            const validatedUrl = await validateAndFixUrl(layer.data_url);
            console.log(`3D Tileset yükleniyor: ${validatedUrl}`);

            // Basit 3D Tileset seçenekleri
            loadedResource = await Cesium3DTileset.fromUrl(validatedUrl, {
              maximumScreenSpaceError: 16
            });
            
            if (!loadedResource) {
              throw new Error('3D Tileset oluşturulamadı');
            }

            viewerRef.current.scene.primitives.add(loadedResource);
            
            // Model yükleme tamamlandığında kamerayı odakla
            loadedResource.readyPromise.then(() => {
              try {
                console.log(`${layer.name} tileset hazır, kamera odaklanıyor...`);
                viewerRef.current?.zoomTo(loadedResource);
                toast.success(`${layer.name} başarıyla yüklendi ve görüntülendi`);
              } catch (zoomError) {
                console.warn('Kamera odaklama hatası:', zoomError);
                toast.success(`${layer.name} başarıyla yüklendi (kamera odaklama uyarısı ile)`);
              }
            }).catch((readyError: any) => {
              console.error('Tileset ready promise hatası:', readyError);
              
              // Daha detaylı hata mesajları
              let userMessage = 'Model yüklendi ancak bazı detaylar eksik olabilir';
              if (readyError.message && readyError.message.includes('404')) {
                userMessage = 'Model yüklendi ancak bazı texture veya detay dosyaları bulunamadı';
              } else if (readyError.message && readyError.message.includes('tileset.json')) {
                userMessage = 'tileset.json dosyasında hata var, dosya yolları kontrol edilmeli';
              }
              
              toast.warning(`${layer.name}: ${userMessage}`);
            });
            
            break;
          } catch (tilesetError) {
            console.error('3D Tileset yükleme hatası:', tilesetError);
            
            // Daha spesifik hata mesajları
            let errorMessage = tilesetError.message;
            if (errorMessage.includes('404')) {
              errorMessage = `tileset.json veya referans dosyalar bulunamadı. Dosya yollarını kontrol edin.`;
            } else if (errorMessage.includes('JSON')) {
              errorMessage = `tileset.json formatı geçersiz veya bozuk.`;
            } else if (errorMessage.includes('network')) {
              errorMessage = `Ağ hatası: Model dosyalarına erişilemedi.`;
            }
            
            throw new Error(`3D Tileset yüklenemedi: ${errorMessage}`);
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
            toast.success(`${layer.name} ortofoto katmanı başarıyla yüklendi`);
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
        
        console.log(`${layer.name} katmanı başarıyla yüklendi`);
      }
    } catch (error: any) {
      console.error(`${layer.name} katmanı yüklenirken hata:`, error);
      const errorMessage = error.message || 'Bilinmeyen hata oluştu';
      
      toast.error(`${layer.name} yüklenemedi: ${errorMessage}`);
      onLayerLoad?.(layer.id, false);
    }
  }, [onLayerLoad, validateAndFixUrl]);

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

    // Container boyutunu kontrol et
    const containerValid = checkContainerSize();
    if (!containerValid) {
      console.error('Container boyutları geçersiz, Cesium viewer oluşturulamıyor');
      return;
    }

    // Yeni Cesium Ion token
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiZWNmNzI1NS0wNDRjLTRjN2QtYjMyMi0zMGIxMGU3MDBmYzkiLCJpZCI6NDE3MTMsImlhdCI6MTc0ODcyNjI5Mn0.ARU7thee8WkbfLvADG4jsebahgLZNWEoFoT2Ya42DiE';

    const initViewer = async () => {
      try {
        console.log('Cesium viewer oluşturuluyor...');
        toast.info('Cesium haritası yükleniyor...');

        // Temel terrain sağlayıcı kullan
        let terrainProvider;
        try {
          terrainProvider = await createWorldTerrainAsync();
          console.log('World Terrain başarıyla yüklendi');
        } catch (terrainError) {
          console.warn('World Terrain yüklenemedi, varsayılan terrain kullanılıyor:', terrainError);
          terrainProvider = undefined; // Varsayılan düz terrain
        }
        
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
          selectionIndicator: true,
          shadows: false, // Performans için shadows kapalı
          shouldAnimate: true
        });

        // Başlangıç konumu (Türkiye)
        viewer.camera.setView({
          destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
        });

        // Viewer ayarları
        viewer.scene.globe.enableLighting = false;
        viewer.scene.requestRenderMode = true;
        viewer.scene.maximumRenderTimeChange = Infinity;

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
      style={{ 
        minHeight: '400px',
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'block'
      }}
    />
  );
};

export default EnhancedCesiumViewer;
