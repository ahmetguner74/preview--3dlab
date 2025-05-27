
export interface MapService {
  id: string;
  name: string;
  description?: string;
  service_type: 'WMS' | 'WFS';
  service_url: string;
  layer_name: string;
  visible: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateMapServiceRequest {
  name: string;
  description?: string;
  service_type: 'WMS' | 'WFS';
  service_url: string;
  layer_name: string;
  visible?: boolean;
  thumbnail_url?: string;
}
