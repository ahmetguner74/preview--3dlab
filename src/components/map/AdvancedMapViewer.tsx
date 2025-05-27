
import React, { useEffect, useRef, useState } from 'react';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import ImageLayer from 'ol/layer/Image';
import { OSM } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import ImageWMS from 'ol/source/ImageWMS';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { GeoJSON } from 'ol/format';
import BaseLayer from 'ol/layer/Base';
import { MapService } from '@/types/mapService';
import { parseLayerNames } from '@/api/mapServicesApi';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, X } from 'lucide-react';
import 'ol/ol.css';

interface AdvancedMapViewerProps {
  service: MapService;
  className?: string;
}

interface LayerControl {
  name: string;
  visible: boolean;
  layer: BaseLayer;
}

const AdvancedMapViewer: React.FC<AdvancedMapViewerProps> = ({ 
  service, 
  className = "h-80 w-full" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<Map | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
  
  const [layerControls, setLayerControls] = useState<LayerControl[]>([]);
  const [popupContent, setPopupContent] = useState<string>('');
  const [showPopup, setShowPopup] = useState(false);

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
    const controls: LayerControl[] = [];

    // Katman adlarını parse et
    const layerNames = parseLayerNames(service.layer_name);

    // Her katman için ayrı layer oluştur
    layerNames.forEach((layerName, index) => {
      if (service.service_type === 'WMS') {
        const wmsLayer = new ImageLayer({
          source: new ImageWMS({
            url: service.service_url,
            params: {
              'LAYERS': layerName,
            },
            serverType: 'geoserver',
            crossOrigin: 'anonymous'
          }),
          visible: true
        });
        
        layers.push(wmsLayer);
        controls.push({
          name: layerName,
          visible: true,
          layer: wmsLayer
        });
      } else if (service.service_type === 'WFS') {
        const vectorSource = new VectorSource({
          format: new GeoJSON(),
          url: `${service.service_url}?service=WFS&version=1.1.0&request=GetFeature&typename=${layerName}&outputFormat=application/json`,
        });

        const vectorLayer = new VectorLayer({
          source: vectorSource,
          visible: true
        });
        
        layers.push(vectorLayer);
        controls.push({
          name: layerName,
          visible: true,
          layer: vectorLayer
        });
      }
    });

    // Popup overlay oluştur
    const overlay = new Overlay({
      element: popupRef.current!,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });
    overlayRef.current = overlay;

    // Haritayı oluştur
    const map = new Map({
      target: mapRef.current,
      layers: layers,
      overlays: [overlay],
      view: new View({
        center: fromLonLat([32.8597, 39.9334]), // Ankara koordinatları
        zoom: 6
      })
    });

    // Tıklama olayları ekle
    map.on('singleclick', async (evt) => {
      const coordinate = evt.coordinate;
      
      if (service.service_type === 'WMS') {
        // WMS GetFeatureInfo sorgusu
        try {
          const viewResolution = map.getView().getResolution()!;
          const url = (layers[1] as ImageLayer<ImageWMS>).getSource()!.getFeatureInfoUrl(
            coordinate,
            viewResolution,
            'EPSG:3857',
            { 'INFO_FORMAT': 'text/html' }
          );
          
          if (url) {
            const response = await fetch(url);
            const content = await response.text();
            setPopupContent(content);
            setShowPopup(true);
            overlay.setPosition(coordinate);
          }
        } catch (error) {
          console.error('GetFeatureInfo hatası:', error);
        }
      } else if (service.service_type === 'WFS') {
        // WFS feature bilgilerini göster
        const features = map.getFeaturesAtPixel(evt.pixel);
        if (features.length > 0) {
          const feature = features[0];
          const properties = feature.getProperties();
          
          let content = '<div class="p-2"><h4 class="font-bold mb-2">Öznitelik Bilgileri</h4>';
          Object.keys(properties).forEach(key => {
            if (key !== 'geometry') {
              content += `<p><strong>${key}:</strong> ${properties[key]}</p>`;
            }
          });
          content += '</div>';
          
          setPopupContent(content);
          setShowPopup(true);
          overlay.setPosition(coordinate);
        }
      }
    });

    mapInstanceRef.current = map;
    setLayerControls(controls);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [service]);

  const toggleLayer = (index: number) => {
    const newControls = [...layerControls];
    newControls[index].visible = !newControls[index].visible;
    newControls[index].layer.setVisible(newControls[index].visible);
    setLayerControls(newControls);
  };

  const closePopup = () => {
    setShowPopup(false);
    if (overlayRef.current) {
      overlayRef.current.setPosition(undefined);
    }
  };

  return (
    <div className="relative">
      {/* Thumbnail önizlemesi */}
      {service.thumbnail_url && (
        <div className="absolute top-2 left-2 z-10">
          <img 
            src={service.thumbnail_url} 
            alt={`${service.name} önizleme`}
            className="w-16 h-16 rounded border border-white shadow-lg object-cover"
          />
        </div>
      )}

      {/* Katman kontrolleri */}
      {layerControls.length > 1 && (
        <div className="absolute top-2 right-2 z-10 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h4 className="text-sm font-semibold mb-2">Katmanlar</h4>
          <div className="space-y-2">
            {layerControls.map((control, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={control.visible}
                  onCheckedChange={() => toggleLayer(index)}
                  id={`layer-${index}`}
                />
                <label 
                  htmlFor={`layer-${index}`}
                  className="text-xs text-gray-700 cursor-pointer truncate"
                  title={control.name}
                >
                  {control.name}
                </label>
                {control.visible ? (
                  <Eye size={12} className="text-green-500" />
                ) : (
                  <EyeOff size={12} className="text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Harita container */}
      <div 
        ref={mapRef} 
        className={`${className} border border-gray-200 rounded-lg overflow-hidden`}
      />

      {/* Popup */}
      <div
        ref={popupRef}
        className={`absolute bg-white rounded-lg shadow-lg border max-w-sm ${showPopup ? 'block' : 'hidden'}`}
        style={{ transform: 'translate(-50%, -100%)', marginTop: '-10px' }}
      >
        <div className="flex justify-between items-center p-2 border-b">
          <h4 className="text-sm font-semibold">Detay Bilgiler</h4>
          <button 
            onClick={closePopup}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>
        <div 
          className="max-h-64 overflow-y-auto text-sm"
          dangerouslySetInnerHTML={{ __html: popupContent }}
        />
      </div>
    </div>
  );
};

export default AdvancedMapViewer;
