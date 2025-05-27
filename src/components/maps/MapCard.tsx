
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdvancedMapViewer from '@/components/map/AdvancedMapViewer';
import { MapService } from '@/types/mapService';
import { parseLayerNames } from '@/api/mapServicesApi';

interface MapCardProps {
  service: MapService;
}

const MapCard: React.FC<MapCardProps> = ({ service }) => {
  const layerNames = parseLayerNames(service.layer_name);

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{service.name}</CardTitle>
            {service.description && (
              <p className="text-gray-600 mt-2">{service.description}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <Badge variant={service.service_type === 'WMS' ? 'default' : 'secondary'}>
              {service.service_type}
            </Badge>
            {layerNames.length > 1 && (
              <Badge variant="outline">
                {layerNames.length} Katman
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <AdvancedMapViewer
          service={service}
          className="h-80 w-full"
        />
        <div className="p-4 bg-gray-50 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <strong>Katmanlar:</strong> 
              <div className="mt-1">
                {layerNames.map((layer, index) => (
                  <span 
                    key={index} 
                    className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1"
                  >
                    {layer}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <strong>Servis Türü:</strong> {service.service_type}
              <br />
              <strong>Özellikler:</strong> 
              <span className="text-green-600 ml-1">
                {service.service_type === 'WMS' ? 'Görüntü Sorgulama' : 'Öznitelik Sorgulama'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;
