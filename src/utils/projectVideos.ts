
import { supabase } from '@/integrations/supabase/client';
import { ProjectVideo } from '@/types/project';

// Proje video linki ekle
export const addProjectVideo = async (videoUrl: string, projectId: string): Promise<boolean> => {
  try {
    // Yeni sıra numarası belirle
    const { data: existingVideos } = await supabase
      .from('project_videos')
      .select('sort_order')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: false });
    
    const lastSortOrder = existingVideos && existingVideos.length > 0 
      ? existingVideos[0].sort_order 
      : 0;
    
    // Veritabanına ekle
    const { error } = await supabase
      .from('project_videos')
      .insert({
        project_id: projectId,
        video_url: videoUrl,
        sort_order: lastSortOrder + 1
      });
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Video ekleme hatası:', error);
    return false;
  }
};

// Proje videolarını getir
export const getProjectVideos = async (projectId: string): Promise<ProjectVideo[]> => {
  try {
    const { data, error } = await supabase
      .from('project_videos')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Video getirme hatası:', error);
    return [];
  }
};
