
import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface Layer {
  id: string;
  name: string;
  type: 'pointcloud' | 'mesh' | 'ortho' | 'dem';
  visible: boolean;
  opacity: number;
  url?: string;
}

interface LayerManagerProps {
  layers: Layer[];
  onLayerToggle: (layerId: string, visible: boolean) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onLayerSettings: (layerId: string) => void;
}

const LayerManager: React.FC<LayerManagerProps> = ({
  layers,
  onLayerToggle,
  onOpacityChange,
  onLayerSettings
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getLayerIcon = (type: Layer['type']) => {
    switch (type) {
      case 'pointcloud':
        return '☁️';
      case 'mesh':
        return '🏗️';
      case 'ortho':
        return '🗺️';
      case 'dem':
        return '⛰️';
      default:
        return '📄';
    }
  };

  const getLayerTypeName = (type: Layer['type']) => {
    switch (type) {
      case 'pointcloud':
        return 'Nokta Bulutu';
      case 'mesh':
        return '3D Model';
      case 'ortho':
        return 'Ortofoto';
      case 'dem':
        return 'Yükseklik Modeli';
      default:
        return 'Katman';
    }
  };

  return (
    <Card className="absolute top-4 left-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Layers size={20} />
            Katman Yönetimi
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
          </Button>
        </CardTitle>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-2 p-3 border rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getLayerIcon(layer.type)}</span>
                  <div>
                    <div className="font-medium text-sm">{layer.name}</div>
                    <div className="text-xs text-gray-500">
                      {getLayerTypeName(layer.type)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={(checked) => onLayerToggle(layer.id, checked)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLayerSettings(layer.id)}
                  >
                    <Settings size={14} />
                  </Button>
                </div>
              </div>
              
              {layer.visible && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Şeffaflık</span>
                    <span>{Math.round(layer.opacity * 100)}%</span>
                  </div>
                  <Slider
                    value={[layer.opacity * 100]}
                    onValueChange={(value) => onOpacityChange(layer.id, value[0] / 100)}
                    max={100}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          ))}
          
          {layers.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <Layers size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Henüz katman eklenmemiş</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default LayerManager;
