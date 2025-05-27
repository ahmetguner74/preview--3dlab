
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import MapCard from '@/components/maps/MapCard';
import { mapServicesApi } from '@/api/mapServicesApi';
import { MapService } from '@/types/mapService';
import { useTranslation } from 'react-i18next';

const Maps = () => {
  const [services, setServices] = useState<MapService[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchVisibleServices();
  }, []);

  const fetchVisibleServices = async () => {
    try {
      setLoading(true);
      const data = await mapServicesApi.getVisibleMapServices();
      setServices(data);
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
      <section className="py-16 md:py-24">
        <div className="arch-container">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-light mb-4">
              Harita Servisleri
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              GeoServer'dan yayınlanan WMS ve WFS servislerimizi keşfedin
            </p>
          </div>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Henüz yayınlanan harita servisi bulunmuyor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.map((service) => (
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
