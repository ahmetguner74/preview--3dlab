
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';
import { uploadFileToStorage } from '@/utils/fileStorage';
import { toast } from 'sonner';
import { Upload, X } from 'lucide-react';

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
    visible: true,
    thumbnail_url: ''
  });
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        description: service.description || '',
        service_type: service.service_type,
        service_url: service.service_url,
        layer_name: service.layer_name,
        visible: service.visible,
        thumbnail_url: service.thumbnail_url || ''
      });
    }
  }, [service]);

  const handleThumbnailUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadFileToStorage(file, 'thumbnails');
      if (url) {
        setFormData({ ...formData, thumbnail_url: url });
        toast.success('Thumbnail başarıyla yüklendi');
      }
    } catch (error) {
      toast.error('Thumbnail yüklenemedi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    // Thumbnail yükleme işlemi
    if (thumbnailFile) {
      setUploading(true);
      const thumbnailUrl = await uploadFileToStorage(thumbnailFile, 'thumbnails');
      if (thumbnailUrl) {
        formData.thumbnail_url = thumbnailUrl;
      }
      setUploading(false);
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
        <Label htmlFor="layer_name">Katman Adları *</Label>
        <Input
          id="layer_name"
          value={formData.layer_name}
          onChange={(e) => setFormData({ ...formData, layer_name: e.target.value })}
          placeholder="ORTOFOTO:buyukorhan_2025_ortofoto,BUILDINGS:bina_katmani"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Birden fazla katman için virgülle ayırın (örn: katman1,katman2,katman3)
        </p>
      </div>

      <div>
        <Label htmlFor="thumbnail">Mini Harita Önizlemesi</Label>
        <div className="mt-2 space-y-2">
          {formData.thumbnail_url && (
            <div className="relative inline-block">
              <img 
                src={formData.thumbnail_url} 
                alt="Thumbnail" 
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, thumbnail_url: '' })}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={12} />
              </button>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setThumbnailFile(file);
                  handleThumbnailUpload(file);
                }
              }}
              className="hidden"
              id="thumbnail-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('thumbnail-upload')?.click()}
              disabled={uploading}
            >
              <Upload size={16} className="mr-2" />
              {uploading ? 'Yükleniyor...' : 'Resim Seç'}
            </Button>
          </div>
        </div>
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
        <Button type="submit" disabled={loading || uploading}>
          {loading || uploading ? 'Kaydediliyor...' : (service ? 'Güncelle' : 'Ekle')}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </form>
  );
};

export default MapServiceForm;
