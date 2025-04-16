
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage } from '@/utils/mediaHelpers';

export interface CoverImage {
  id: string;
  image_key: string;
  image_url: string;
  title: string;
  description: string;
  updated_at: string;
}

export const fetchCoverImages = async (): Promise<CoverImage[]> => {
  const { data, error } = await supabase
    .from('site_images')
    .select('*')
    .in('image_key', ['hero_background', 'about_team', 'featured_projects_cover']);
  
  if (error) throw error;
  return data || [];
};

export const uploadCoverImage = async (file: File, imageKey: string): Promise<void> => {
  // Önce mevcut görselin ID'sini bulmak için sorgu yap
  const { data: existingImage } = await supabase
    .from('site_images')
    .select('id')
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

  if (existingImage?.id) {
    const { error } = await supabase
      .from('site_images')
      .update({
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
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
      });
    
    if (error) throw error;
  }
};

export const getCoverImageByKey = (images: CoverImage[], key: string): CoverImage | undefined => {
  return images.find(image => image.image_key === key);
};
