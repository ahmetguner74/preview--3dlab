
import React, { useEffect, useRef } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import TileWMS from 'ol/source/TileWMS';
import ImageWMS from 'ol/source/ImageWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import { BaseLayer } from 'ol/layer/Base';
import 'ol/ol.css';

interface MapViewerProps {
  serviceUrl: string;
  layerName: string;
  serviceType: 'WMS' | 'WFS';
  className?: string;
}

const MapViewer: React.FC<MapViewerProps> = ({ 
  serviceUrl, 
  layerName, 
  serviceType,
  className = "h-64 w-full" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Harita instance'ını temizle
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(undefined);
    }

    // Base layer (OpenStreetMap)
    const baseLayer = new TileLayer({
      source: new OSM()
    });

    const layers: BaseLayer[] = [baseLayer];

    // Servis tipine göre layer ekle
    if (serviceType === 'WMS') {
      const wmsLayer = new ImageLayer({
        source: new ImageWMS({
          url: serviceUrl,
          params: {
            'LAYERS': layerName,
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous'
        })
      });
      layers.push(wmsLayer);
    } else if (serviceType === 'WFS') {
      const vectorSource = new VectorSource({
        format: new GeoJSON(),
        url: `${serviceUrl}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json`,
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      });
      layers.push(vectorLayer);
    }

    // Haritayı oluştur
    const map = new Map({
      target: mapRef.current,
      layers: layers,
      view: new View({
        center: fromLonLat([32.8597, 39.9334]), // Ankara koordinatları
        zoom: 6
      })
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [serviceUrl, layerName, serviceType]);

  return (
    <div 
      ref={mapRef} 
      className={`${className} border border-gray-200 rounded-lg overflow-hidden`}
    />
  );
};

export default MapViewer;
