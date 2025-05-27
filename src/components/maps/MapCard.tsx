
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import MapViewer from '@/components/map/MapViewer';
import { MapService } from '@/types/mapService';

interface MapCardProps {
  service: MapService;
}

const MapCard: React.FC<MapCardProps> = ({ service }) => {
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
          <Badge variant={service.service_type === 'WMS' ? 'default' : 'secondary'}>
            {service.service_type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <MapViewer
          serviceUrl={service.service_url}
          layerName={service.layer_name}
          serviceType={service.service_type}
          className="h-80 w-full"
        />
        <div className="p-4 bg-gray-50 text-sm text-gray-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <strong>Katman:</strong> {service.layer_name}
            </div>
            <div>
              <strong>Servis:</strong> {service.service_type}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapCard;
