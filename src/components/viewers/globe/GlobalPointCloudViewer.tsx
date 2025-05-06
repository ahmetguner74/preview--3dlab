
import React, { useEffect } from 'react';
import { Ion, Viewer, createWorldTerrainAsync, createOsmBuildingsAsync } from 'cesium';
import { Viewer as ResiumViewer, Globe, CameraFlyTo, Entity } from 'resium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Cesium ion varsayılan erişim token'ı
Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NDE0MjMsImlhdCI6MTYxMDEwNjQ3NH0.tduKTXoNW_5N9ykzUmHhLtYsqhB7xkg7OcIOxhW8tLc';

interface GlobalPointCloudViewerProps {
  pointCloudData: {
    url: string | null;
    name: string;
    type: string;
    coordinateSystem: string;
  };
}

const GlobalPointCloudViewer: React.FC<GlobalPointCloudViewerProps> = ({ pointCloudData }) => {
  const [cesiumViewer, setCesiumViewer] = React.useState<Viewer | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Cesium viewer referansını saklarız
  const viewerRef = React.useRef<Viewer | null>(null);

  useEffect(() => {
    // Komponent unmount olduğunda viewer'ı temizleriz
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
      }
    };
  }, []);

  // Viewer oluşturulduğunda çağrılacak handler
  const handleViewerMount = (viewer: Viewer) => {
    viewerRef.current = viewer;
    setCesiumViewer(viewer);
    
    // Kullanıcı deneyimi için otomatik olarak dünya yüzeyini ve binaları yükleriz
    Promise.all([
      createWorldTerrainAsync(),
      createOsmBuildingsAsync()
    ]).then(([terrain, buildings]) => {
      viewer.scene.globe.depthTestAgainstTerrain = true;
      viewer.scene.primitives.add(buildings);
      viewer.terrainProvider = terrain;
    });
  };

  // Nokta bulutu yüklendiğinde işlemleri gerçekleştir
  useEffect(() => {
    if (!cesiumViewer || !pointCloudData.url) return;

    const loadPointCloud = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Burada nokta bulutunu yüklemek için gerekli işlemler yapılacak
        // Örnek: Potree veya 3D Tiles formatında nokta bulutu yükleme
        
        // NOT: Cesium'da nokta bulutu yükleme işlemi gerçek bir
        // uygulama için karmaşık bir süreç gerektirir
        // Burada sadece temel bir şablon sunuyoruz
        
        // Örneğin bir 3D Tiles point cloud asset'i için:
        // const pointCloud = await Cesium.Cesium3DTileset.fromUrl(pointCloudData.url);
        // cesiumViewer.scene.primitives.add(pointCloud);
        
        // Örneğin nokta bulutu konumuna kamera animasyonu:
        cesiumViewer.camera.flyTo({
          destination: {
            x: 0,
            y: 0,
            z: 10000000
          }
        });

        setIsLoading(false);
      } catch (err: any) {
        setError(`Nokta bulutu yüklenirken bir hata oluştu: ${err.message || 'Bilinmeyen hata'}`);
        setIsLoading(false);
        console.error('Nokta bulutu yükleme hatası:', err);
      }
    };

    loadPointCloud();
  }, [cesiumViewer, pointCloudData.url]);

  return (
    <>
      <div className="absolute inset-0">
        <ResiumViewer
          full
          className="h-full w-full"
          onMount={handleViewerMount}
        >
          <Globe />
          <CameraFlyTo 
            duration={2} 
            destination={{x: 1216389.0, y: -4736806.0, z: 4081226.0}} 
          />
        </ResiumViewer>
      </div>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="p-4 bg-white rounded-md flex items-center space-x-2">
            <div className="animate-spin h-6 w-6 border-4 border-gray-300 border-t-black rounded-full"></div>
            <span>Nokta bulutu yükleniyor...</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="p-4 bg-white rounded-md text-red-500 max-w-md">
            <h3 className="font-bold">Hata</h3>
            <p>{error}</p>
          </div>
        </div>
      )}
      
      {!pointCloudData.url && !isLoading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="text-center max-w-md p-6">
            <h3 className="text-xl font-medium mb-2">Nokta Bulutu Yüklenmedi</h3>
            <p className="text-gray-600">
              Görüntülemek için lütfen "Yükle" sekmesinden bir nokta bulutu dosyası yükleyin.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalPointCloudViewer;
