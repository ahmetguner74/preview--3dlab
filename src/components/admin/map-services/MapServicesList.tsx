
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapService } from '@/types/mapService';
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MapServicesListProps {
  services: MapService[];
  onEdit: (service: MapService) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
  loading?: boolean;
}

const MapServicesList: React.FC<MapServicesListProps> = ({
  services,
  onEdit,
  onDelete,
  onToggleVisibility,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-500">Henüz harita servisi eklenmemiş.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg">{service.name}</CardTitle>
                {service.description && (
                  <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge variant={service.service_type === 'WMS' ? 'default' : 'secondary'}>
                  {service.service_type}
                </Badge>
                <Badge variant={service.visible ? 'default' : 'secondary'}>
                  {service.visible ? 'Görünür' : 'Gizli'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div>
                <strong>URL:</strong> {service.service_url}
              </div>
              <div>
                <strong>Katman:</strong> {service.layer_name}
              </div>
              <div>
                <strong>Oluşturulma:</strong> {new Date(service.created_at).toLocaleDateString('tr-TR')}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(service)}
              >
                <Edit size={16} className="mr-1" />
                Düzenle
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => onToggleVisibility(service.id, !service.visible)}
              >
                {service.visible ? (
                  <>
                    <EyeOff size={16} className="mr-1" />
                    Gizle
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-1" />
                    Göster
                  </>
                )}
              </Button>
              
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  if (window.confirm('Bu harita servisini silmek istediğinizden emin misiniz?')) {
                    onDelete(service.id);
                  }
                }}
              >
                <Trash2 size={16} className="mr-1" />
                Sil
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MapServicesList;
