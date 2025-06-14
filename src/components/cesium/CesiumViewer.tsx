import React, { useEffect, useRef, useState } from 'react';
import { Viewer as CesiumViewer, Cartesian3, Cesium3DTileset, Color } from 'cesium';
import { Button } from '@/components/ui/button';
import { Upload, Eye, Layers } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumViewerProps {
  className?: string;
  projectId?: string;
  autoLoadProject?: boolean;
}

const CesiumViewerComponent: React.FC<CesiumViewerProps> = ({ 
  className = "h-screen w-full", 
  projectId,
  autoLoadProject = false 
}) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<CesiumViewer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadedLayers, setLoadedLayers] = useState<string[]>([]);

  // Test nokta bulutu için projeler listesi
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

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
        viewer.scene.backgroundColor = new Color(0.0, 0.0, 0.0, 1.0);

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

        // Eğer projectId belirtilmişse otomatik yükle
        if (autoLoadProject && projectId) {
          await loadProjectLayers(projectId);
        }
      } catch (error) {
        console.error('Cesium viewer oluşturulamadı:', error);
        toast.error('3D Harita yüklenirken hata oluştu');
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
  }, [projectId, autoLoadProject]);

  // Cesium projelerini yükle
  useEffect(() => {
    fetchCesiumProjects();
  }, []);

  const fetchCesiumProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('cesium_projects')
        .select('id, title, description')
        .eq('visible', true)
        .eq('status', 'yayinda');

      if (error) throw error;
      setAvailableProjects(data || []);
      
      // Test projesi varsa otomatik seç
      const testProject = data?.find(p => p.title.toLowerCase().includes('test'));
      if (testProject) {
        setSelectedProject(testProject.id);
        console.log('Test projesi bulundu:', testProject.title);
      }
    } catch (error) {
      console.error('Cesium projeleri yüklenirken hata:', error);
    }
  };

  const loadProjectLayers = async (projectIdToLoad: string) => {
    if (!viewerRef.current) return;

    setLoading(true);
    try {
      const { data: layers, error } = await supabase
        .from('cesium_layers')
        .select('*')
        .eq('project_id', projectIdToLoad)
        .eq('visible', true)
        .order('sort_order');

      if (error) throw error;

      for (const layer of layers || []) {
        try {
          console.log(`Katman yükleniyor: ${layer.name} (${layer.layer_type})`);
          
          if (layer.layer_type === 'pointcloud' || layer.layer_type === 'tileset') {
            const tileset = await Cesium3DTileset.fromUrl(layer.data_url, {
              maximumScreenSpaceError: 16,
              skipLevelOfDetail: true,
              baseScreenSpaceError: 1024
            });
            
            viewerRef.current.scene.primitives.add(tileset);
            
            // İlk katman yüklendiğinde kamerayı odakla
            if (loadedLayers.length === 0) {
              viewerRef.current.zoomTo(tileset);
            }
            
            setLoadedLayers(prev => [...prev, layer.name]);
            toast.success(`${layer.name} katmanı yüklendi`);
          }
        } catch (layerError) {
          console.error(`Katman yükleme hatası (${layer.name}):`, layerError);
          toast.error(`${layer.name} katmanı yüklenemedi`);
        }
      }
    } catch (error) {
      console.error('Proje katmanları yüklenirken hata:', error);
      toast.error('Proje katmanları yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectSelect = async (projectIdToSelect: string) => {
    setSelectedProject(projectIdToSelect);
    
    // Mevcut katmanları temizle
    if (viewerRef.current) {
      viewerRef.current.scene.primitives.removeAll();
      setLoadedLayers([]);
    }
    
    await loadProjectLayers(projectIdToSelect);
  };

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
          
          try {
            console.log(`${file.name} tileset yüklendi, kamera odaklanıyor...`);
            viewerRef.current?.zoomTo(tileset);
            toast.success(`${file.name} başarıyla yüklendi`);
            setLoadedLayers(prev => [...prev, file.name]);
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
        <div className="absolute top-4 left-4 z-10 space-y-2">
          {/* Proje Seçici */}
          {availableProjects.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded p-3 space-y-2">
              <label className="text-white text-sm font-medium block">Cesium Projesi:</label>
              <select 
                value={selectedProject || ''} 
                onChange={(e) => handleProjectSelect(e.target.value)}
                className="w-full p-2 rounded text-black text-sm"
              >
                <option value="">Proje Seçin</option>
                {availableProjects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {/* Dosya Yükleme Butonu */}
          <Button
            onClick={triggerFileUpload}
            disabled={loading}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30"
          >
            <Upload size={16} className="mr-2" />
            {loading ? 'Yükleniyor...' : '3D Model Yükle'}
          </Button>
          
          {/* Yüklenen Katmanlar */}
          {loadedLayers.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm rounded p-3">
              <div className="flex items-center text-white text-sm font-medium mb-2">
                <Layers size={14} className="mr-1" />
                Yüklenen Katmanlar ({loadedLayers.length})
              </div>
              <div className="space-y-1">
                {loadedLayers.map((layerName, index) => (
                  <div key={index} className="text-white text-xs flex items-center">
                    <Eye size={12} className="mr-1" />
                    {layerName}
                  </div>
                ))}
              </div>
            </div>
          )}
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
