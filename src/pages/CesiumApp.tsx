
import React, { useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import CesiumViewer from '@/components/cesium/CesiumViewer';
import LayerManager from '@/components/cesium/LayerManager';
import MeasurementTools from '@/components/cesium/MeasurementTools';

interface Layer {
  id: string;
  name: string;
  type: 'pointcloud' | 'mesh' | 'ortho' | 'dem';
  visible: boolean;
  opacity: number;
  url?: string;
}

interface MeasurementResult {
  id: string;
  type: 'coordinate' | 'distance' | 'area';
  value: string;
  coordinates?: string;
}

type MeasurementMode = 'none' | 'coordinate' | 'distance' | 'area';

const CesiumApp: React.FC = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: '1',
      name: 'Örnek Nokta Bulutu',
      type: 'pointcloud',
      visible: true,
      opacity: 1.0,
      url: 'https://example.com/pointcloud.3dtiles'
    },
    {
      id: '2',
      name: 'Ortofoto Katmanı',
      type: 'ortho',
      visible: false,
      opacity: 0.8,
      url: 'https://example.com/ortho/wms'
    }
  ]);

  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('none');
  const [measurementResults, setMeasurementResults] = useState<MeasurementResult[]>([]);

  const handleLayerToggle = useCallback((layerId: string, visible: boolean) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible } : layer
    ));
  }, []);

  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, opacity } : layer
    ));
  }, []);

  const handleLayerSettings = useCallback((layerId: string) => {
    console.log('Layer settings for:', layerId);
    // TODO: Katman ayarları modalını aç
  }, []);

  const handleMeasurementModeChange = useCallback((mode: MeasurementMode) => {
    setMeasurementMode(mode);
  }, []);

  const handleClearMeasurements = useCallback(() => {
    setMeasurementResults([]);
  }, []);

  return (
    <Layout>
      <div className="relative h-screen w-full bg-black">
        <CesiumViewer className="absolute inset-0" />
        
        <LayerManager
          layers={layers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
          onLayerSettings={handleLayerSettings}
        />
        
        <MeasurementTools
          currentMode={measurementMode}
          onModeChange={handleMeasurementModeChange}
          results={measurementResults}
          onClearResults={handleClearMeasurements}
        />
      </div>
    </Layout>
  );
};

export default CesiumApp;
