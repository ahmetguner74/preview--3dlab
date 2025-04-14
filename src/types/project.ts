export type ProjectStatus = 'taslak' | 'yayinda' | 'arsiv';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location: string | null;
  category: string | null;
  year: string | null;
  client: string | null;
  area: string | null;
  architect: string | null;
  status: ProjectStatus;
  visible: boolean;
  created_at: string;
  updated_at: string;
  thumbnail?: string; // Önizleme görselinin URL'si
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  image_type: 'main' | 'gallery' | 'before' | 'after';
  sort_order: number;
  created_at: string;
}

export interface ProjectVideo {
  id: string;
  project_id: string;
  video_url: string;
  thumbnail_url?: string;
  sort_order: number;
  created_at: string;
}

export interface Project3DModel {
  id: string;
  project_id: string;
  model_url: string;
  model_type: '3d_model' | 'point_cloud';
  created_at: string;
}
