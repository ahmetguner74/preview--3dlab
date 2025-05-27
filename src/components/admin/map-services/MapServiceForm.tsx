
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';
import { toast } from 'sonner';

interface MapServiceFormProps {
  service?: MapService;
  onSubmit: (data: CreateMapServiceRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MapServiceForm: React.FC<MapServiceFormProps> = ({
  service,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateMapServiceRequest>({
    name: '',
    description: '',
    service_type: 'WMS',
    service_url: '',
    layer_name: '',
    visible: true
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        service_type: service.service_type,
        service_url: service.service_url,
        layer_name: service.layer_name,
        visible: service.visible
      });
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Harita adı gereklidir');
      return;
    }
    
    if (!formData.service_url.trim()) {
      toast.error('Servis URL\'si gereklidir');
      return;
    }
    
    if (!formData.layer_name.trim()) {
      toast.error('Katman adı gereklidir');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Harita Adı *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Örnek: Büyükorhan 2025 Ortofoto"
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Açıklama</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Harita hakkında kısa açıklama..."
          rows={3}
        />
      </div>

      <div>
        <Label htmlFor="service_type">Servis Türü *</Label>
        <Select 
          value={formData.service_type} 
          onValueChange={(value: 'WMS' | 'WFS') => 
            setFormData({ ...formData, service_type: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="WMS">WMS (Web Map Service)</SelectItem>
            <SelectItem value="WFS">WFS (Web Feature Service)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="service_url">Servis URL'si *</Label>
        <Input
          id="service_url"
          value={formData.service_url}
          onChange={(e) => setFormData({ ...formData, service_url: e.target.value })}
          placeholder="http://localhost:8080/geoserver/ORTOFOTO/wms"
          required
        />
      </div>

      <div>
        <Label htmlFor="layer_name">Katman Adı *</Label>
        <Input
          id="layer_name"
          value={formData.layer_name}
          onChange={(e) => setFormData({ ...formData, layer_name: e.target.value })}
          placeholder="ORTOFOTO:buyukorhan_2025_ortofoto"
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="visible"
          checked={formData.visible}
          onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
          className="rounded"
        />
        <Label htmlFor="visible">Sitede görünür yap</Label>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading}>
          {loading ? 'Kaydediliyor...' : (service ? 'Güncelle' : 'Ekle')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </form>
  );
};

export default MapServiceForm;
