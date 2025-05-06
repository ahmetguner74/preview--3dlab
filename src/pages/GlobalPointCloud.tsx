
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GlobalPointCloudViewer from '@/components/viewers/globe/GlobalPointCloudViewer';
import PointCloudUploader from '@/components/viewers/globe/PointCloudUploader';
import PointCloudControls from '@/components/viewers/globe/PointCloudControls';
import { useTranslation } from 'react-i18next';

const GlobalPointCloud = () => {
  const [pointCloudData, setPointCloudData] = useState<{
    url: string | null;
    name: string;
    type: string;
    coordinateSystem: string;
  }>({
    url: null,
    name: '',
    type: '',
    coordinateSystem: 'WGS84'
  });
  
  const [activeTab, setActiveTab] = useState<string>('görüntüle');
  const { t } = useTranslation();

  const handlePointCloudLoaded = (data: {
    url: string;
    name: string;
    type: string;
    coordinateSystem: string;
  }) => {
    setPointCloudData(data);
    setActiveTab('görüntüle');
  };

  return (
    <Layout>
      <div className="arch-container py-12">
        <div className="flex flex-col space-y-6">
          <h1 className="text-3xl font-display">{t('Global Point Cloud Viewer')}</h1>
          <p className="text-gray-600 max-w-2xl">
            {t('Upload and visualize LAS, LAZ or EPT format point cloud data on a 3D globe. Supports WGS84 and UTM coordinate systems.')}
          </p>

          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="w-full"
          >
            <TabsList className="mb-6">
              <TabsTrigger value="yükle">{t('Upload')}</TabsTrigger>
              <TabsTrigger value="görüntüle">{t('View')}</TabsTrigger>
              <TabsTrigger value="ayarlar">{t('Settings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="yükle">
              <Card>
                <CardContent className="pt-6">
                  <PointCloudUploader onPointCloudLoaded={handlePointCloudLoaded} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="görüntüle">
              <Card>
                <CardContent className="p-0 overflow-hidden">
                  <div className="h-[600px] relative">
                    <GlobalPointCloudViewer 
                      pointCloudData={pointCloudData}
                    />
                  </div>
                  <div className="p-4">
                    <PointCloudControls pointCloudData={pointCloudData} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="ayarlar">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-medium">{t('Coordinate System')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`p-4 border rounded-md cursor-pointer ${pointCloudData.coordinateSystem === 'WGS84' ? 'bg-gray-100 border-gray-400' : 'border-gray-200'}`}
                        onClick={() => setPointCloudData({...pointCloudData, coordinateSystem: 'WGS84'})}
                      >
                        <h4 className="font-medium">WGS84 (EPSG:4326)</h4>
                        <p className="text-sm text-gray-600">{t('Global coordinate system used for GPS')}</p>
                      </div>
                      <div 
                        className={`p-4 border rounded-md cursor-pointer ${pointCloudData.coordinateSystem === 'UTM' ? 'bg-gray-100 border-gray-400' : 'border-gray-200'}`}
                        onClick={() => setPointCloudData({...pointCloudData, coordinateSystem: 'UTM'})}
                      >
                        <h4 className="font-medium">UTM</h4>
                        <p className="text-sm text-gray-600">{t('Universal Transverse Mercator projection')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {pointCloudData.url && (
            <div className="p-4 bg-gray-50 rounded-md">
              <h3 className="text-sm font-medium">{t('Current Point Cloud')}</h3>
              <p className="text-sm text-gray-600">
                {pointCloudData.name} ({pointCloudData.type}) - {pointCloudData.coordinateSystem}
              </p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default GlobalPointCloud;
