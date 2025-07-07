import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Globe, Settings, ZoomIn, ZoomOut, RotateCcw, Home } from 'lucide-react';

const Cesium3d = () => {
  const { t } = useTranslation();
  const viewerRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');
  const [coordinateSystem, setCoordinateSystem] = useState('WGS84');

  useEffect(() => {
    const initCesium = async () => {
      if (viewerRef.current && !viewer) {
        try {
          // Cesium 1.131'i dinamik olarak yükle
          const cesium = await import('cesium');
          
          // Cesium Ion Access Token (mevcut projeden alınacak)
          cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjNzUzZTVjYS03MzAzLTQwYzYtOTUxZC0xYzY3NGZiY2Y4NGUiLCJpZCI6MjQ1NjU4LCJpYXQiOjE3MzM5NDQ5Nzh9.QPMdR28nFn3pOQBdP9HWyCH7L_4rTOEP6YnSaEy6-Zg';

          const newViewer = new cesium.Viewer(viewerRef.current, {
            terrain: cesium.Terrain.fromWorldTerrain(),
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
            selectionIndicator: true,
            shadows: true,
            terrainShadows: cesium.ShadowMode.RECEIVE_ONLY,
            // Cesium 1.131 yeni özellikleri
            requestRenderMode: true,
            maximumRenderTimeChange: Infinity,
          });

          // Cesium 1.131 yeni lighting ayarları
          newViewer.scene.globe.enableLighting = true;
          newViewer.scene.globe.dynamicAtmosphereLighting = true;
          newViewer.scene.globe.dynamicAtmosphereLightingFromSun = true;

          // İleri seviye render ayarları
          newViewer.scene.postProcessStages.fxaa.enabled = true;
          
          setViewer(newViewer);
          toast.success('Cesium 3D Globe yüklendi');
        } catch (error) {
          console.error('Cesium 3D yüklenemedi:', error);
          toast.error('3D viewer yüklenemedi');
        }
      }
    };

    initCesium();

    return () => {
      if (viewer) {
        viewer.destroy();
      }
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      // Dosyayı Supabase'e yükle
      const fileName = `cesium3d_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from('cesium-files')
        .upload(fileName, file);

      if (error) throw error;

      // Dosya bilgisini veritabanına kaydet
      const { error: dbError } = await supabase
        .from('cesium_files')
        .insert({
          file_name: file.name,
          file_path: data.path,
          file_type: file.type,
          file_size: file.size,
          upload_status: 'completed'
        });

      if (dbError) throw dbError;

      toast.success(t('uploadSuccessful'));
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      toast.error('Dosya yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const loadDataFromUrl = async () => {
    if (!fileUrl || !viewer) return;

    setLoading(true);
    try {
      // URL'den veri yükle (3D Tiles, GLTF, KML, CZML)
      const cesium = await import('cesium');
      
      let dataSource;
      const url = fileUrl.toLowerCase();
      
      if (url.includes('.czml')) {
        dataSource = await cesium.CzmlDataSource.load(fileUrl);
        viewer.dataSources.add(dataSource);
      } else if (url.includes('.kml') || url.includes('.kmz')) {
        dataSource = await cesium.KmlDataSource.load(fileUrl);
        viewer.dataSources.add(dataSource);
      } else if (url.includes('.json') || url.includes('tileset')) {
        const tileset = await cesium.Cesium3DTileset.fromUrl(fileUrl);
        viewer.scene.primitives.add(tileset);
        viewer.zoomTo(tileset);
      } else if (url.includes('.gltf') || url.includes('.glb')) {
        const entity = viewer.entities.add({
          position: cesium.Cartesian3.fromDegrees(-74.0, 40.7, 0),
          model: {
            uri: fileUrl,
            scale: 1.0,
            minimumPixelSize: 128,
            maximumScale: 20000,
          }
        });
        viewer.zoomTo(entity);
      }

      toast.success('Veri başarıyla yüklendi');
    } catch (error) {
      console.error('Veri yükleme hatası:', error);
      toast.error('Veri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const zoomIn = () => {
    if (viewer) {
      const camera = viewer.scene.camera;
      camera.zoomIn(camera.positionCartographic.height * 0.5);
    }
  };

  const zoomOut = () => {
    if (viewer) {
      const camera = viewer.scene.camera;
      camera.zoomOut(camera.positionCartographic.height * 0.5);
    }
  };

  const resetView = () => {
    if (viewer) {
      viewer.camera.setView({
        destination: viewer.camera.positionWC,
      });
    }
  };

  const flyHome = () => {
    if (viewer) {
      viewer.camera.flyHome(1.5);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
        <div className="arch-container py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-display font-light mb-4 text-primary">
              {t('Cesium 3D Globe')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('Advanced 3D visualization with Cesium 1.131 - Upload and explore LAS, LAZ, GLTF, 3D Tiles, KML, CZML data on a photorealistic 3D globe')}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sol Panel - Kontroller */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Upload size={20} />
                    {t('Upload Data')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      {t('Select or drag file')}
                    </label>
                    <Input
                      type="file"
                      accept=".las,.laz,.gltf,.glb,.json,.kml,.kmz,.czml,.3dtiles"
                      onChange={handleFileUpload}
                      disabled={loading}
                      className="border-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Supported formats')}: LAS, LAZ, GLTF, GLB, 3D Tiles, KML, CZML
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2 font-medium">
                      {t('or specify URL')}
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/data.json"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      disabled={loading}
                      className="border-primary/30"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('Public URL to 3D data or tileset')}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={loadDataFromUrl}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!fileUrl || loading}
                  >
                    {loading ? t('Loading...') : t('Load & Visualize')}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Settings size={20} />
                    {t('Globe Settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-2 font-medium">
                        {t('Coordinate System')}
                      </label>
                      <select 
                        className="w-full p-2 border rounded border-primary/30 bg-background"
                        value={coordinateSystem}
                        onChange={(e) => setCoordinateSystem(e.target.value)}
                      >
                        <option value="WGS84">WGS84 - {t('Global GPS coordinates')}</option>
                        <option value="UTM">UTM - {t('Universal Transverse Mercator')}</option>
                        <option value="LOCAL">Local - {t('Local coordinate system')}</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary">{t('Navigation')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={flyHome} variant="outline" className="w-full justify-start border-primary/30">
                    <Home size={16} className="mr-2" />
                    {t('Fly Home')}
                  </Button>
                  <Button onClick={zoomIn} variant="outline" className="w-full justify-start border-primary/30">
                    <ZoomIn size={16} className="mr-2" />
                    {t('Zoom In')}
                  </Button>
                  <Button onClick={zoomOut} variant="outline" className="w-full justify-start border-primary/30">
                    <ZoomOut size={16} className="mr-2" />
                    {t('Zoom Out')}
                  </Button>
                  <Button onClick={resetView} variant="outline" className="w-full justify-start border-primary/30">
                    <RotateCcw size={16} className="mr-2" />
                    {t('Reset View')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sağ Panel - Cesium 3D Globe */}
            <div className="lg:col-span-3">
              <Card className="h-[700px] border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <Globe size={20} />
                    {t('3D Photorealistic Globe - Cesium 1.131')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div 
                    ref={viewerRef}
                    className="w-full h-full rounded-lg border border-primary/30"
                    style={{ minHeight: '600px' }}
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                        {t('Loading 3D data...')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cesium3d;