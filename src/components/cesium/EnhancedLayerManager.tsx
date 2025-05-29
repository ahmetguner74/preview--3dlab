
import React, { useState } from 'react';
import { Layers, Eye, EyeOff, Settings, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CesiumLayer } from '@/types/cesium';

interface EnhancedLayerManagerProps {
  layers: CesiumLayer[];
  onLayerToggle: (layerId: string, visible: boolean) => void;
  onOpacityChange: (layerId: string, opacity: number) => void;
  onLayerSettings?: (layerId: string) => void;
  loading?: boolean;
}

const EnhancedLayerManager: React.FC<EnhancedLayerManagerProps> = ({
  layers,
  onLayerToggle,
  onOpacityChange,
  onLayerSettings,
  loading = false
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getLayerIcon = (type: CesiumLayer['layer_type']) => {
    switch (type) {
      case 'pointcloud':
        return '☁️';
      case 'mesh':
      case 'tileset':
        return '🏗️';
      case 'ortho':
        return '🗺️';
      case 'dem':
        return '⛰️';
      case 'vector':
        return '📐';
      default:
        return '📄';
    }
  };

  const getLayerTypeName = (type: CesiumLayer['layer_type']) => {
    switch (type) {
      case 'pointcloud':
        return 'Nokta Bulutu';
      case 'mesh':
        return '3D Mesh';
      case 'tileset':
        return '3D Tiles';
      case 'ortho':
        return 'Ortofoto';
      case 'dem':
        return 'Yükseklik Modeli';
      case 'vector':
        return 'Vektör';
      default:
        return 'Katman';
    }
  };

  const getStatusBadge = (layer: CesiumLayer) => {
    if (!layer.visible) {
      return <Badge variant="secondary" className="text-xs">Gizli</Badge>;
    }
    if (layer.opacity < 1) {
      return <Badge variant="outline" className="text-xs">{Math.round(layer.opacity * 100)}%</Badge>;
    }
    return <Badge variant="default" className="text-xs">Aktif</Badge>;
  };

  return (
    <Card className="absolute top-4 left-4 w-80 z-50 bg-white/95 backdrop-blur-sm max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Layers size={20} />
            Katman Yönetimi
            {loading && <Loader2 size={16} className="animate-spin" />}
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
        <CardContent className="space-y-4 overflow-y-auto flex-grow">
          {layers.map((layer) => (
            <div key={layer.id} className="space-y-2 p-3 border rounded-md">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2 flex-grow min-w-0">
                  <span className="text-lg flex-shrink-0">{getLayerIcon(layer.layer_type)}</span>
                  <div className="min-w-0 flex-grow">
                    <div className="font-medium text-sm truncate" title={layer.name}>
                      {layer.name}
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <span>{getLayerTypeName(layer.layer_type)}</span>
                      {getStatusBadge(layer)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Switch
                    checked={layer.visible}
                    onCheckedChange={(checked) => onLayerToggle(layer.id, checked)}
                  />
                  {onLayerSettings && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onLayerSettings(layer.id)}
                    >
                      <Settings size={14} />
                    </Button>
                  )}
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
              
              {layer.data_url && (
                <div className="text-xs text-gray-400 truncate" title={layer.data_url}>
                  URL: {layer.data_url}
                </div>
              )}
            </div>
          ))}
          
          {layers.length === 0 && !loading && (
            <div className="text-center text-gray-500 py-8">
              <Layers size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Bu proje için katman bulunamadı</p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedLayerManager;
