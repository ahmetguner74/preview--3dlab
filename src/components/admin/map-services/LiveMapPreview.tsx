
import React, { useEffect, useRef, useState } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import OSM from 'ol/source/OSM';
import ImageWMS from 'ol/source/ImageWMS';
import { fromLonLat } from 'ol/proj';
import 'ol/ol.css';

interface LiveMapPreviewProps {
  serviceUrl: string;
  serviceType: 'WMS' | 'WFS';
  layerNames: string[];
  className?: string;
}

const LiveMapPreview: React.FC<LiveMapPreviewProps> = ({
  serviceUrl,
  serviceType,
  layerNames,
  className = "h-64 w-full"
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapRef.current || !serviceUrl || layerNames.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Mevcut haritayı temizle
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }

      // Base layer (OSM)
      const baseLayer = new TileLayer({
        source: new OSM()
      });

      const layers = [baseLayer];

      // WMS katmanları ekle
      if (serviceType === 'WMS') {
        const wmsLayer = new ImageLayer({
          source: new ImageWMS({
            url: serviceUrl,
            params: {
              'LAYERS': layerNames.join(','),
              'VERSION': '1.3.0',
              'FORMAT': 'image/png',
              'TRANSPARENT': true
            },
            ratio: 1,
            serverType: 'geoserver'
          })
        });

        // Katman yükleme olaylarını dinle
        const source = wmsLayer.getSource() as ImageWMS;
        source.on('imageloadstart', () => setLoading(true));
        source.on('imageloadend', () => setLoading(false));
        source.on('imageloaderror', () => {
          setError('Katman yüklenemedi');
          setLoading(false);
        });

        layers.push(wmsLayer);
      }

      // Harita oluştur
      const map = new Map({
        target: mapRef.current,
        layers,
        view: new View({
          center: fromLonLat([35.2433, 38.9637]), // Türkiye merkezi
          zoom: 6
        }),
        controls: [] // Kontrolleri gizle
      });

      mapInstanceRef.current = map;

      // İlk yükleme sonrası loading'i kapat
      setTimeout(() => setLoading(false), 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Harita yüklenirken hata oluştu');
      setLoading(false);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
        mapInstanceRef.current = null;
      }
    };
  }, [serviceUrl, serviceType, layerNames]);

  if (!serviceUrl || layerNames.length === 0) {
    return (
      <div className={`${className} border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50`}>
        <div className="text-center text-gray-500">
          <p className="text-sm">Canlı Harita Önizlemesi</p>
          <p className="text-xs mt-1">Servis URL'si ve katman seçin</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative border rounded-lg overflow-hidden`}>
      <div ref={mapRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Yükleniyor...</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-center">
          <div className="text-center text-red-600">
            <p className="text-sm font-medium">Önizleme Hatası</p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveMapPreview;
