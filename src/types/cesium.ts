
export interface CesiumProject {
  id: string;
  title: string;
  description?: string;
  slug: string;
  status: 'taslak' | 'yayinda' | 'arsiv';
  visible: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CesiumLayer {
  id: string;
  project_id?: string;
  name: string;
  layer_type: 'pointcloud' | 'mesh' | 'ortho' | 'dem' | 'vector' | 'tileset';
  data_url: string;
  metadata: Record<string, any>;
  style_config: Record<string, any>;
  visible: boolean;
  opacity: number;
  sort_order: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CesiumProjectPermission {
  id: string;
  project_id: string;
  user_id: string;
  permission_level: 'viewer' | 'editor' | 'admin';
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}
