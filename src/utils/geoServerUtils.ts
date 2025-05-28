
export interface LayerInfo {
  name: string;
  title?: string;
  abstract?: string;
}

export interface ServiceCapabilities {
  valid: boolean;
  layers: LayerInfo[];
  error?: string;
  serviceTitle?: string;
  serviceAbstract?: string;
}

// WMS GetCapabilities XML parser
export const parseWMSCapabilities = (xmlText: string): ServiceCapabilities => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // XML hatası kontrolü
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return { valid: false, layers: [], error: 'XML parse hatası: Geçersiz XML yanıtı' };
    }

    const layers: LayerInfo[] = [];
    
    // WMS Layer elementlerini bul
    const layerElements = xmlDoc.querySelectorAll('Layer[queryable="1"], Layer > Layer');
    
    layerElements.forEach(layer => {
      const nameElement = layer.querySelector('Name');
      const titleElement = layer.querySelector('Title');
      const abstractElement = layer.querySelector('Abstract');
      
      if (nameElement?.textContent) {
        layers.push({
          name: nameElement.textContent,
          title: titleElement?.textContent || '',
          abstract: abstractElement?.textContent || ''
        });
      }
    });

    // Servis bilgileri
    const serviceTitle = xmlDoc.querySelector('Service > Title')?.textContent || '';
    const serviceAbstract = xmlDoc.querySelector('Service > Abstract')?.textContent || '';

    return {
      valid: true,
      layers,
      serviceTitle,
      serviceAbstract
    };
  } catch (error) {
    return { 
      valid: false, 
      layers: [], 
      error: `WMS Capabilities parse hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
    };
  }
};

// WFS GetCapabilities XML parser
export const parseWFSCapabilities = (xmlText: string): ServiceCapabilities => {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return { valid: false, layers: [], error: 'XML parse hatası: Geçersiz XML yanıtı' };
    }

    const layers: LayerInfo[] = [];
    
    // WFS FeatureType elementlerini bul
    const featureTypes = xmlDoc.querySelectorAll('FeatureType');
    
    featureTypes.forEach(featureType => {
      const nameElement = featureType.querySelector('Name');
      const titleElement = featureType.querySelector('Title');
      const abstractElement = featureType.querySelector('Abstract');
      
      if (nameElement?.textContent) {
        layers.push({
          name: nameElement.textContent,
          title: titleElement?.textContent || '',
          abstract: abstractElement?.textContent || ''
        });
      }
    });

    const serviceTitle = xmlDoc.querySelector('ServiceIdentification > Title')?.textContent || '';
    const serviceAbstract = xmlDoc.querySelector('ServiceIdentification > Abstract')?.textContent || '';

    return {
      valid: true,
      layers,
      serviceTitle,
      serviceAbstract
    };
  } catch (error) {
    return { 
      valid: false, 
      layers: [], 
      error: `WFS Capabilities parse hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}` 
    };
  }
};

// GetCapabilities isteği gönder
export const fetchServiceCapabilities = async (serviceUrl: string, serviceType: 'WMS' | 'WFS'): Promise<ServiceCapabilities> => {
  try {
    // URL'yi temizle ve GetCapabilities parametrelerini ekle
    const url = new URL(serviceUrl);
    url.searchParams.set('service', serviceType);
    url.searchParams.set('request', 'GetCapabilities');
    url.searchParams.set('version', serviceType === 'WMS' ? '1.3.0' : '2.0.0');

    const response = await fetch(url.toString());
    
    if (!response.ok) {
      return {
        valid: false,
        layers: [],
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }

    const xmlText = await response.text();
    
    return serviceType === 'WMS' 
      ? parseWMSCapabilities(xmlText)
      : parseWFSCapabilities(xmlText);
      
  } catch (error) {
    return {
      valid: false,
      layers: [],
      error: `Bağlantı hatası: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`
    };
  }
};

// URL doğrulama
export const validateServiceUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
