
import React, { useEffect, useRef, useState } from 'react';
import Layout from '@/components/layout/Layout';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Upload, Globe, Settings, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const CesiumMap = () => {
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
          // Cesium'u dinamik olarak yükle
          const cesium = await import('cesium');
          
          const newViewer = new cesium.Viewer(viewerRef.current, {
            terrain: cesium.Terrain.fromWorldTerrain(),
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
          });

          setViewer(newViewer);
        } catch (error) {
          console.error('Cesium yüklenemedi:', error);
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
      const fileName = `${Date.now()}_${file.name}`;
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

  const loadPointCloudFromUrl = async () => {
    if (!fileUrl || !viewer) return;

    setLoading(true);
    try {
      // URL'den nokta bulutu yükle
      const cesium = await import('cesium');
      
      const tileset = await cesium.Cesium3DTileset.fromUrl(fileUrl);
      viewer.scene.primitives.add(tileset);
      viewer.zoomTo(tileset);

      toast.success('Nokta bulutu yüklendi');
    } catch (error) {
      console.error('Nokta bulutu yükleme hatası:', error);
      toast.error('Nokta bulutu yüklenemedi');
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
      viewer.scene.camera.setView({
        destination: viewer.scene.camera.positionWC,
      });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="arch-container py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-display font-light mb-4">
              {t('Global Point Cloud Viewer')}
            </h1>
            <p className="text-lg text-arch-gray">
              {t('Upload and visualize LAS, LAZ or EPT format point cloud data on a 3D globe. Supports WGS84 and UTM coordinate systems.')}
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sol Panel - Kontroller */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload size={20} />
                    {t('Upload')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">
                      {t('Dosya seçin veya sürükleyin')}
                    </label>
                    <Input
                      type="file"
                      accept=".las,.laz,.ept"
                      onChange={handleFileUpload}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Desteklenen formatlar')}: LAS, LAZ, EPT
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">
                      {t('veya URL belirtin')}
                    </label>
                    <Input
                      type="url"
                      placeholder="https://example.com/pointcloud.json"
                      value={fileUrl}
                      onChange={(e) => setFileUrl(e.target.value)}
                      disabled={loading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {t('Publicly accessible URL to a point cloud file')}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={loadPointCloudFromUrl}
                    className="w-full"
                    disabled={!fileUrl || loading}
                  >
                    {loading ? t('Yükleniyor...') : t('Yükle ve Görüntüle')}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings size={20} />
                    {t('Settings')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm mb-2">
                        {t('Coordinate System')}
                      </label>
                      <select 
                        className="w-full p-2 border rounded"
                        value={coordinateSystem}
                        onChange={(e) => setCoordinateSystem(e.target.value)}
                      >
                        <option value="WGS84">WGS84 - {t('Global coordinate system used for GPS')}</option>
                        <option value="UTM">UTM - {t('Universal Transverse Mercator projection')}</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('View')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button onClick={zoomIn} variant="outline" className="w-full justify-start">
                    <ZoomIn size={16} className="mr-2" />
                    {t('Yakınlaştır')}
                  </Button>
                  <Button onClick={zoomOut} variant="outline" className="w-full justify-start">
                    <ZoomOut size={16} className="mr-2" />
                    {t('Uzaklaştır')}
                  </Button>
                  <Button onClick={resetView} variant="outline" className="w-full justify-start">
                    <RotateCcw size={16} className="mr-2" />
                    {t('Döndür')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sağ Panel - Cesium Viewer */}
            <div className="lg:col-span-3">
              <Card className="h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe size={20} />
                    {t('Globe Point Cloud')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[calc(100%-80px)]">
                  <div 
                    ref={viewerRef}
                    className="w-full h-full rounded border"
                    style={{ minHeight: '500px' }}
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                      <div className="text-white">
                        {t('Nokta bulutu yükleniyor...')}
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

export default CesiumMap;
