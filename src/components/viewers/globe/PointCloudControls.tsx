
import React from 'react';
import { Button } from '@/components/ui/button';
import { Layers, ZoomIn, ZoomOut, RotateClockwise, Globe, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PointCloudControlsProps {
  pointCloudData: {
    url: string | null;
    name: string;
    type: string;
    coordinateSystem: string;
  };
}

const PointCloudControls: React.FC<PointCloudControlsProps> = ({ pointCloudData }) => {
  const { t } = useTranslation();

  // Bu fonksiyonlar, CesiumJS viewer'a bağlanmalıdır
  const handleZoomIn = () => {
    console.log('Zoom in');
  };

  const handleZoomOut = () => {
    console.log('Zoom out');
  };

  const handleRotate = () => {
    console.log('Rotate');
  };

  const handleToggleTerrain = () => {
    console.log('Toggle terrain');
  };

  const handleToggleLayer = () => {
    console.log('Toggle layer');
  };

  const handleSettings = () => {
    console.log('Open settings');
  };

  return (
    <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={handleZoomIn} title={t('Yakınlaştır')}>
          <ZoomIn size={16} />
          <span className="ml-1 hidden sm:inline">{t('Yakınlaştır')}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleZoomOut} title={t('Uzaklaştır')}>
          <ZoomOut size={16} />
          <span className="ml-1 hidden sm:inline">{t('Uzaklaştır')}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleRotate} title={t('Döndür')}>
          <RotateClockwise size={16} />
          <span className="ml-1 hidden sm:inline">{t('Döndür')}</span>
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={handleToggleTerrain} title={t('Arazi')}>
          <Globe size={16} />
          <span className="ml-1 hidden sm:inline">{t('Arazi')}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleToggleLayer} title={t('Katmanlar')}>
          <Layers size={16} />
          <span className="ml-1 hidden sm:inline">{t('Katmanlar')}</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleSettings} title={t('Ayarlar')}>
          <Settings size={16} />
          <span className="ml-1 hidden sm:inline">{t('Ayarlar')}</span>
        </Button>
      </div>
    </div>
  );
};

export default PointCloudControls;
