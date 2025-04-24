
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage } from './fileStorage';

// Kapak görseli URL'sini getir
export const getSiteImage = async (imageKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('image_url, settings')
      .eq('image_key', imageKey)
      .single();
    
    if (error) return null;
    return data?.image_url || null;
  } catch (error) {
    console.error('Site görseli getirme hatası:', error);
    return null;
  }
};

// Site görseli yükleme
export const uploadSiteImage = async (file: File, imageKey: string): Promise<void> => {
  // Önce mevcut görselin ID'sini bulmak için sorgu yap
  const { data: existingImage } = await supabase
    .from('site_images')
    .select('id, settings')
    .eq('image_key', imageKey)
    .single();

  const imageUrl = await uploadFileToStorage(file, 'site-images');
  
  if (!imageUrl) throw new Error('Görsel yüklenemedi');

  let title = '';
  let description = '';
  
  switch (imageKey) {
    case 'hero_background':
      title = 'Ana Sayfa Arkaplan Görseli';
      description = 'Ana sayfada üst bölümde görünen arkaplan resmi';
      break;
    case 'about_team':
      title = 'Hakkımızda Ekip Görseli';
      description = 'Ana sayfada hakkımızda bölümünde görünen ekip resmi';
      break;
    case 'featured_projects_cover':
      title = 'Öne Çıkan Projeler Görseli';
      description = 'Ana sayfada öne çıkan projeler bölümünde görünen kapak resmi';
      break;
  }

  // Varsayılan ayarlar
  const defaultSettings = {
    opacity: '0.7',
    height: '100vh',
    position: 'center',
    overlay_color: 'rgba(0, 0, 0, 0.5)',
    blend_mode: 'normal'
  };

  if (existingImage?.id) {
    const { error } = await supabase
      .from('site_images')
      .update({
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
        settings: existingImage.settings || defaultSettings
      })
      .eq('id', existingImage.id);
    
    if (error) throw error;
  } else {
    const { error } = await supabase
      .from('site_images')
      .insert({
        image_key: imageKey,
        image_url: imageUrl,
        title,
        description,
        settings: defaultSettings
      });
    
    if (error) throw error;
  }
};
