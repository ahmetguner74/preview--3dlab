
import { supabase } from '@/integrations/supabase/client';
import { ProjectImage } from '@/types/project';
import { uploadFileToStorage } from './fileStorage';

// Proje görseli yükle
export const uploadProjectImage = async (
  file: File, 
  projectId: string, 
  imageType: 'main' | 'gallery' | 'before' | 'after' = 'gallery'
): Promise<string | null> => {
  const imageUrl = await uploadFileToStorage(file, 'projects');
  
  if (imageUrl) {
    // Yeni sıra numarası belirle
    const { data: existingImages } = await supabase
      .from('project_images')
      .select('sort_order')
      .eq('project_id', projectId)
      .eq('image_type', imageType)
      .order('sort_order', { ascending: false });
    
    const lastSortOrder = existingImages && existingImages.length > 0 
      ? existingImages[0].sort_order 
      : 0;
    
    // Veritabanına ekle
    const { error } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        image_url: imageUrl,
        image_type: imageType,
        sort_order: lastSortOrder + 1
      });
    
    if (error) {
      console.error('Görsel kaydı hatası:', error);
      return null;
    }
    
    return imageUrl;
  }
  
  return null;
};

// Proje görsellerini getir
export const getProjectImages = async (projectId: string): Promise<ProjectImage[]> => {
  try {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    // Tip güvenliğini sağlamak için explicit casting yapıyoruz
    return data?.map(item => ({
      ...item,
      image_type: item.image_type as 'main' | 'gallery' | 'before' | 'after'
    })) || [];
  } catch (error) {
    console.error('Görsel getirme hatası:', error);
    return [];
  }
};
