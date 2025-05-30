
export interface CesiumFile {
  id: string;
  project_id?: string;
  file_name: string;
  file_path: string;
  file_type: '3tz' | 'json' | 'b3dm' | 'las' | 'laz' | 'tileset';
  file_size?: number;
  upload_status: 'uploading' | 'completed' | 'failed';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface CesiumNote {
  id: string;
  project_id?: string;
  title: string;
  description?: string;
  latitude: number;
  longitude: number;
  height?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}
