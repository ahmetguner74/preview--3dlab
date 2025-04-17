
import { supabase } from '@/integrations/supabase/client';
import { ProjectVideo } from '@/types/project';

// YouTube ve Vimeo URL'lerini standart hale getir
const normalizeVideoUrl = (url: string): string => {
  // YouTube URL'lerini işle
  if (url.includes('youtube.com/watch')) {
    // youtube.com/watch?v=VIDEO_ID formatını al
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const videoId = urlParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId}`;
    }
  } else if (url.includes('youtu.be/')) {
    // youtu.be/VIDEO_ID formatını watch?v= formatına çevir
    const videoId = url.split('youtu.be/')[1];
    if (videoId) {
      return `https://www.youtube.com/watch?v=${videoId.split('?')[0]}`;
    }
  }
  
  // Vimeo URL'lerini işle
  if (url.includes('vimeo.com/') && !url.includes('player.vimeo.com')) {
    // vimeo.com/VIDEO_ID formatını standartlaştır
    const vimeoId = url.split('vimeo.com/')[1];
    if (vimeoId) {
      return `https://vimeo.com/${vimeoId.split('?')[0]}`;
    }
  }
  
  return url;
};

// Proje video linki ekle
export const addProjectVideo = async (videoUrl: string, projectId: string): Promise<boolean> => {
  try {
    console.log('Video URL ekleniyor:', videoUrl);
    
    // URL'yi standartlaştır
    const normalizedUrl = normalizeVideoUrl(videoUrl);
    
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
        video_url: normalizedUrl,
        sort_order: lastSortOrder + 1
      });
    
    if (error) throw error;
    console.log('Video başarıyla eklendi');
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
    console.log('Videolar getirildi:', data);
    return data || [];
  } catch (error) {
    console.error('Video getirme hatası:', error);
    return [];
  }
};
