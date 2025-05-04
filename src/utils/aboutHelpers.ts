
import { supabase } from '@/integrations/supabase/client';

export interface AboutContent {
  id: string;
  section_key: string;
  title_tr: string;
  title_en: string;
  content_tr: string;
  content_en: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export const getAboutContent = async (): Promise<AboutContent[]> => {
  try {
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      console.error('Hakkımızda içeriği getirilemedi:', error);
      return [];
    }
    
    return data as AboutContent[] || [];
  } catch (error) {
    console.error('Hakkımızda içeriği getirme hatası:', error);
    return [];
  }
};

export const updateAboutContent = async (
  id: string, 
  updates: Partial<AboutContent>
): Promise<boolean> => {
  try {
    updates.updated_at = new Date().toISOString();
    
    const { error } = await supabase
      .from('about_content')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Hakkımızda içeriği güncelleme hatası:', error);
    return false;
  }
};

export const updateAboutContentImage = async (
  id: string,
  imageUrl: string
): Promise<boolean> => {
  return await updateAboutContent(id, { image_url: imageUrl });
};
