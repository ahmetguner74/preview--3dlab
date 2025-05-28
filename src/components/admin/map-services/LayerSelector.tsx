
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { LayerInfo } from '@/utils/geoServerUtils';
import { Badge } from '@/components/ui/badge';

interface LayerSelectorProps {
  layers: LayerInfo[];
  selectedLayers: string[];
  onSelectionChange: (selectedLayers: string[]) => void;
  loading?: boolean;
}

const LayerSelector: React.FC<LayerSelectorProps> = ({
  layers,
  selectedLayers,
  onSelectionChange,
  loading = false
}) => {
  const handleLayerToggle = (layerName: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedLayers, layerName]);
    } else {
      onSelectionChange(selectedLayers.filter(name => name !== layerName));
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600">Katmanlar yükleniyor...</div>
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center space-x-2 animate-pulse">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  if (layers.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4 border rounded-md bg-gray-50">
        Katman bulunamadı. Lütfen geçerli bir servis URL'si girin.
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-64 overflow-y-auto border rounded-md p-3 bg-gray-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Mevcut Katmanlar:</span>
        <Badge variant="outline">{layers.length} katman</Badge>
      </div>
      
      {layers.map((layer) => (
        <div key={layer.name} className="flex items-start space-x-2">
          <Checkbox
            id={`layer-${layer.name}`}
            checked={selectedLayers.includes(layer.name)}
            onCheckedChange={(checked) => handleLayerToggle(layer.name, !!checked)}
          />
          <div className="flex-1 min-w-0">
            <label 
              htmlFor={`layer-${layer.name}`}
              className="text-sm font-medium cursor-pointer block"
            >
              {layer.name}
            </label>
            {layer.title && layer.title !== layer.name && (
              <p className="text-xs text-gray-600 mt-1">{layer.title}</p>
            )}
            {layer.abstract && (
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{layer.abstract}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LayerSelector;
