
import { supabase } from '@/integrations/supabase/client';

/**
 * Belirli bir anahtara sahip site görselini veya YouTube video linkini getiren fonksiyon
 */
export const getSiteImage = async (imageKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('image_url')
      .eq('image_key', imageKey)
      .maybeSingle();

    if (error) {
      console.error('Site görseli getirme hatası:', error);
      return null;
    }

    return data?.image_url || null;
  } catch (error) {
    console.error('Site görseli getirme hatası:', error);
    return null;
  }
};

/**
 * Tüm site görsellerini getiren fonksiyon
 */
export const getAllSiteImages = async () => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Site görselleri getirme hatası:', error);
    return [];
  }
};

/**
 * Site görselini güncelleyen fonksiyon
 */
export const updateSiteImage = async (
  imageKey: string, 
  imageUrl: string,
  title?: string,
  description?: string
): Promise<boolean> => {
  try {
    const updateData: { image_url: string; title?: string; description?: string; updated_at: string } = {
      image_url: imageUrl,
      updated_at: new Date().toISOString()
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;

    const { error } = await supabase
      .from('site_images')
      .update(updateData)
      .eq('image_key', imageKey);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Site görseli güncelleme hatası:', error);
    return false;
  }
};
