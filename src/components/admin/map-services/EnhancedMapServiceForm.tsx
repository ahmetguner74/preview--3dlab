
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';
import { fetchServiceCapabilities, validateServiceUrl, LayerInfo } from '@/utils/geoServerUtils';
import LayerTagInput from './LayerTagInput';
import LayerSelector from './LayerSelector';
import LiveMapPreview from './LiveMapPreview';
import { toast } from 'sonner';
import { CheckCircle, AlertCircle, Loader2, RefreshCw, Info } from 'lucide-react';

interface EnhancedMapServiceFormProps {
  service?: MapService;
  onSubmit: (data: CreateMapServiceRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const EnhancedMapServiceForm: React.FC<EnhancedMapServiceFormProps> = ({
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

  const [urlValidation, setUrlValidation] = useState<{
    status: 'idle' | 'checking' | 'valid' | 'invalid';
    message?: string;
  }>({ status: 'idle' });

  const [availableLayers, setAvailableLayers] = useState<LayerInfo[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [layersLoading, setLayersLoading] = useState(false);

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
      setSelectedLayers(service.layer_name.split(',').map(l => l.trim()).filter(l => l));
    }
  }, [service]);

  // URL değiştiğinde katmanları otomatik kontrol et
  useEffect(() => {
    if (formData.service_url && validateServiceUrl(formData.service_url)) {
      checkServiceCapabilities();
    } else {
      setUrlValidation({ status: 'idle' });
      setAvailableLayers([]);
    }
  }, [formData.service_url, formData.service_type]);

  // Seçilen katmanları form datasına sync et
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      layer_name: selectedLayers.join(',')
    }));
  }, [selectedLayers]);

  const checkServiceCapabilities = async () => {
    if (!validateServiceUrl(formData.service_url)) {
      setUrlValidation({ status: 'invalid', message: 'Geçersiz URL formatı' });
      return;
    }

    setUrlValidation({ status: 'checking' });
    setLayersLoading(true);

    try {
      const capabilities = await fetchServiceCapabilities(formData.service_url, formData.service_type);
      
      if (capabilities.valid) {
        setUrlValidation({ 
          status: 'valid', 
          message: `✓ Servis geçerli - ${capabilities.layers.length} katman bulundu` 
        });
        setAvailableLayers(capabilities.layers);
        
        // İlk kez yükleniyorsa ve servis info varsa formu güncelle
        if (!formData.name && capabilities.serviceTitle) {
          setFormData(prev => ({
            ...prev,
            name: capabilities.serviceTitle || '',
            description: capabilities.serviceAbstract || ''
          }));
        }
      } else {
        setUrlValidation({ 
          status: 'invalid', 
          message: capabilities.error || 'Servis erişilemez' 
        });
        setAvailableLayers([]);
      }
    } catch (error) {
      setUrlValidation({ 
        status: 'invalid', 
        message: `Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
      });
      setAvailableLayers([]);
    } finally {
      setLayersLoading(false);
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
      toast.error('En az bir katman seçilmelidir');
      return;
    }

    if (urlValidation.status !== 'valid') {
      toast.error('Lütfen geçerli bir servis URL\'si girin');
      return;
    }

    onSubmit(formData);
  };

  const getServiceTypeDescription = (type: string) => {
    switch (type) {
      case 'WMS':
        return 'Web Map Service - Harita görüntü servisi';
      case 'WFS':
        return 'Web Feature Service - Özellik/veri sorgu servisi';
      case 'WMTS':
        return 'Web Map Tile Service - Tile bazlı hızlı harita görüntüsü';
      default:
        return '';
    }
  };

  const getUrlValidationIcon = () => {
    switch (urlValidation.status) {
      case 'checking':
        return <Loader2 className="animate-spin" size={16} />;
      case 'valid':
        return <CheckCircle className="text-green-600" size={16} />;
      case 'invalid':
        return <AlertCircle className="text-red-600" size={16} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Servis Bilgileri */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Servis Bilgileri</h3>
        
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
              <SelectItem value="WMS">
                <div>
                  <div className="font-medium">WMS</div>
                  <div className="text-sm text-gray-500">Harita görüntü servisi</div>
                </div>
              </SelectItem>
              <SelectItem value="WFS">
                <div>
                  <div className="font-medium">WFS</div>
                  <div className="text-sm text-gray-500">Özellik/veri sorgu servisi</div>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">
            {getServiceTypeDescription(formData.service_type)}
          </p>
        </div>

        <div>
          <Label htmlFor="service_url">Servis URL'si *</Label>
          <div className="relative">
            <Input
              id="service_url"
              value={formData.service_url}
              onChange={(e) => setFormData({ ...formData, service_url: e.target.value })}
              placeholder="http://localhost:8080/geoserver/workspace/wms"
              required
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getUrlValidationIcon()}
            </div>
          </div>
          
          {urlValidation.status !== 'idle' && (
            <Alert className={`mt-2 ${urlValidation.status === 'valid' ? 'border-green-200 bg-green-50' : 
              urlValidation.status === 'invalid' ? 'border-red-200 bg-red-50' : ''}`}>
              <AlertDescription className="text-sm">
                {urlValidation.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">
              URL girildiğinde otomatik olarak kontrol edilir
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={checkServiceCapabilities}
              disabled={!formData.service_url || urlValidation.status === 'checking'}
            >
              <RefreshCw size={14} className="mr-1" />
              Yeniden Kontrol Et
            </Button>
          </div>
        </div>
      </div>

      {/* Katman Seçimi */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Katman Seçimi</h3>
        
        {availableLayers.length > 0 && (
          <LayerSelector
            layers={availableLayers}
            selectedLayers={selectedLayers}
            onSelectionChange={setSelectedLayers}
            loading={layersLoading}
          />
        )}

        <div>
          <Label htmlFor="layer_name">Seçilen Katmanlar *</Label>
          <LayerTagInput
            layers={selectedLayers}
            onChange={setSelectedLayers}
            placeholder="Katman adı yazın veya yukarıdan seçin..."
            disabled={false}
          />
        </div>
      </div>

      {/* Harita Bilgileri */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Harita Bilgileri</h3>
        
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
      </div>

      {/* Canlı Önizleme */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Canlı Harita Önizlemesi</h3>
        <LiveMapPreview
          serviceUrl={formData.service_url}
          serviceType={formData.service_type}
          layerNames={selectedLayers}
          className="h-64 w-full"
        />
      </div>

      {/* Yayın Ayarları */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Yayın Ayarları</h3>
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="visible"
            checked={formData.visible}
            onCheckedChange={(checked) => setFormData({ ...formData, visible: !!checked })}
          />
          <div className="flex-1">
            <Label htmlFor="visible" className="cursor-pointer">
              Sitede görünür yap
            </Label>
            <p className="text-sm text-gray-600 mt-1">
              Bu seçenek aktif olduğunda harita servisi ana sitede yayınlanır ve ziyaretçiler tarafından görülebilir.
            </p>
          </div>
        </div>

        <Alert>
          <Info size={16} />
          <AlertDescription>
            <strong>Bilgi:</strong> Servis başarıyla kaydedildikten sonra kullanıcılar harita sayfasında 
            katmanları açıp kapayabilir, harita üzerinde sorgulama yapabilir.
          </AlertDescription>
        </Alert>
      </div>

      {/* Form Butonları */}
      <div className="flex gap-3 pt-6 border-t">
        <Button 
          type="submit" 
          disabled={loading || urlValidation.status !== 'valid' || selectedLayers.length === 0}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={16} />
              Kaydediliyor...
            </>
          ) : (
            service ? 'Güncelle' : 'Servis Ekle'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          İptal
        </Button>
      </div>
    </form>
  );
};

export default EnhancedMapServiceForm;
