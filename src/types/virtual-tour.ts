
export interface InitialView {
  yaw: number;
  pitch: number;
  fov: number;
}

export interface Position {
  yaw: number;
  pitch: number;
}

export interface Hotspot {
  id: string;
  title: string;
  description?: string;
  position: Position;
  target_panorama_id?: string;
  hotspot_type: 'info' | 'link' | 'custom';
  custom_data?: any;
}

export interface Panorama {
  id: string;
  title: string;
  image_url: string;
  initial_view: InitialView;
  sort_order?: number;
  hotspots?: Hotspot[];
}

export type TourStatus = 'taslak' | 'yayinda' | 'arsiv';

export interface VirtualTour {
  id: string;
  title: string;
  description?: string;
  slug: string;
  status: TourStatus;
  thumbnail?: string;
  visible: boolean;
  created_at?: string;
  updated_at?: string;
}
