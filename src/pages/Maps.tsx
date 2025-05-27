
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import MapCard from '@/components/maps/MapCard';
import { mapServicesApi } from '@/api/mapServicesApi';
import { MapService } from '@/types/mapService';
import { useTranslation } from 'react-i18next';
import { Filter, Grid, List, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const Maps = () => {
  const [services, setServices] = useState<MapService[]>([]);
  const [filteredServices, setFilteredServices] = useState<MapService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceTypeFilter, setServiceTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { t } = useTranslation();

  useEffect(() => {
    fetchVisibleServices();
  }, []);

  useEffect(() => {
    // Filtreleme işlemi
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.layer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter(service => service.service_type === serviceTypeFilter);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, serviceTypeFilter]);

  const fetchVisibleServices = async () => {
    try {
      setLoading(true);
      const data = await mapServicesApi.getVisibleMapServices();
      setServices(data);
      setFilteredServices(data);
    } catch (error) {
      console.error('Harita servisleri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="arch-container py-24">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
            <p className="mt-2">Haritalar yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-8 md:py-16">
        <div className="arch-container">
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-light mb-4">
              Harita Servisleri
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              GeoServer'dan yayınlanan WMS ve WFS servislerimizi keşfedin. 
              Katmanları kontrol edin ve detaylı bilgilere erişin.
            </p>
          </div>

          {/* Filtreler ve Kontroller */}
          {services.length > 0 && (
            <div className="mb-6 md:mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
                <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full md:w-auto">
                  <div className="relative flex-1 md:max-w-xs">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Harita ara..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={serviceTypeFilter} onValueChange={setServiceTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Servis türü" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tüm Servisler</SelectItem>
                      <SelectItem value="WMS">WMS Servisleri</SelectItem>
                      <SelectItem value="WFS">WFS Servisleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={16} />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={16} />
                  </Button>
                </div>
              </div>

              {/* Sonuç sayısı */}
              <p className="text-sm text-gray-600">
                {filteredServices.length} servis bulundu
              </p>
            </div>
          )}

          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <Filter size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                {searchTerm || serviceTypeFilter !== 'all' 
                  ? 'Arama kriterlerinize uygun harita servisi bulunamadı.'
                  : 'Henüz yayınlanan harita servisi bulunmuyor.'
                }
              </p>
              {(searchTerm || serviceTypeFilter !== 'all') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setServiceTypeFilter('all');
                  }}
                >
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8" 
                : "space-y-6"
            }>
              {filteredServices.map((service) => (
                <MapCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Maps;
