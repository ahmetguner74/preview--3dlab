
import React, { useState, useCallback } from 'react';
import Layout from '@/components/layout/Layout';
import EnhancedCesiumViewer from '@/components/cesium/EnhancedCesiumViewer';
import EnhancedLayerManager from '@/components/cesium/EnhancedLayerManager';
import CesiumProjectSelector from '@/components/cesium/CesiumProjectSelector';
import MeasurementTools from '@/components/cesium/MeasurementTools';
import { useCesiumProjects, useCesiumLayers } from '@/hooks/useCesiumData';
import { toast } from 'sonner';

interface MeasurementResult {
  id: string;
  type: 'coordinate' | 'distance' | 'area';
  value: string;
  coordinates?: string;
}

type MeasurementMode = 'none' | 'coordinate' | 'distance' | 'area';

const CesiumApp: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('none');
  const [measurementResults, setMeasurementResults] = useState<MeasurementResult[]>([]);

  const { projects, loading: projectsLoading } = useCesiumProjects();
  const { layers, loading: layersLoading, toggleLayerVisibility, updateLayerOpacity } = useCesiumLayers(selectedProjectId);

  const handleProjectSelect = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    console.log('Seçilen proje:', projectId);
  }, []);

  const handleLayerToggle = useCallback((layerId: string, visible: boolean) => {
    toggleLayerVisibility(layerId, visible);
  }, [toggleLayerVisibility]);

  const handleOpacityChange = useCallback((layerId: string, opacity: number) => {
    updateLayerOpacity(layerId, opacity);
  }, [updateLayerOpacity]);

  const handleLayerSettings = useCallback((layerId: string) => {
    console.log('Katman ayarları:', layerId);
    toast.info(`${layerId} katmanı için ayarlar yakında gelecek`);
  }, []);

  const handleLayerLoad = useCallback((layerId: string, success: boolean) => {
    const layer = layers.find(l => l.id === layerId);
    if (layer) {
      if (success) {
        toast.success(`${layer.name} katmanı başarıyla yüklendi`);
      } else {
        toast.error(`${layer.name} katmanı yüklenemedi`);
      }
    }
  }, [layers]);

  const handleMeasurementModeChange = useCallback((mode: MeasurementMode) => {
    setMeasurementMode(mode);
  }, []);

  const handleClearMeasurements = useCallback(() => {
    setMeasurementResults([]);
  }, []);

  return (
    <Layout>
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <EnhancedCesiumViewer 
          className="absolute inset-0" 
          layers={layers}
          onLayerLoad={handleLayerLoad}
        />
        
        <CesiumProjectSelector
          projects={projects}
          selectedProjectId={selectedProjectId}
          onProjectSelect={handleProjectSelect}
          loading={projectsLoading}
        />
        
        <EnhancedLayerManager
          layers={layers}
          onLayerToggle={handleLayerToggle}
          onOpacityChange={handleOpacityChange}
          onLayerSettings={handleLayerSettings}
          loading={layersLoading}
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
