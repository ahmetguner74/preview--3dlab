
import { uploadSiteImage } from '@/utils/siteImages';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export interface CoverImage {
  id: string;
  image_key: string;
  image_url: string;
  title: string;
  description: string;
  updated_at: string;
  settings: {
    opacity: string;
    height: string;
    position: string;
    overlay_color: string;
    blend_mode: string;
  };
}

export const fetchCoverImages = async (): Promise<CoverImage[]> => {
  try {
    // Doğrudan Supabase'den tam verileri çekerek sorunu çözelim
    const { data, error } = await supabase
      .from('site_images')
      .select('*')
      .in('image_key', ['hero_background', 'about_team', 'featured_projects_cover', 'hero_youtube_video']);
    
    if (error) throw error;

    // Veri yoksa veya boş bir array dönerse
    if (!data || data.length === 0) {
      return createDefaultCoverImages();
    }

    // Tip dönüşümü yaparak, settings JSON verisini doğru formata dönüştürüyoruz
    return data.map(item => {
      // Varsayılan ayarlar
      const defaultSettings = {
        opacity: '0.7',
        height: '100vh',
        position: 'center',
        overlay_color: 'rgba(0, 0, 0, 0.5)',
        blend_mode: 'normal'
      };
      
      // JSON tipindeki settings verisini işliyoruz
      let processedSettings = defaultSettings;
      
      if (item.settings && typeof item.settings === 'object') {
        const jsonSettings = item.settings as Record<string, any>;
        processedSettings = {
          opacity: jsonSettings.opacity?.toString() || defaultSettings.opacity,
          height: jsonSettings.height?.toString() || defaultSettings.height,
          position: jsonSettings.position?.toString() || defaultSettings.position,
          overlay_color: jsonSettings.overlay_color?.toString() || defaultSettings.overlay_color,
          blend_mode: jsonSettings.blend_mode?.toString() || defaultSettings.blend_mode
        };
      }

      return {
        id: item.id,
        image_key: item.image_key,
        image_url: item.image_url,
        title: item.title || '',
        description: item.description || '',
        updated_at: item.updated_at,
        settings: processedSettings
      } as CoverImage;
    });
  } catch (error) {
    console.error('Kapak görselleri getirilemedi:', error);
    // Hata durumunda yine varsayılan verileri döndür
    return createDefaultCoverImages();
  }
};

// Varsayılan kapak görselleri oluşturan yardımcı fonksiyon
const createDefaultCoverImages = (): CoverImage[] => {
  const imageKeys = ['hero_background', 'about_team', 'featured_projects_cover', 'hero_youtube_video'];
  return imageKeys.map(key => ({
    id: key,
    image_key: key,
    image_url: '',
    title: getTitleForKey(key),
    description: getDescriptionForKey(key),
    updated_at: new Date().toISOString(),
    settings: {
      opacity: '0.7',
      height: '100vh',
      position: 'center',
      overlay_color: 'rgba(0, 0, 0, 0.5)',
      blend_mode: 'normal'
    }
  }));
};

export const uploadCoverImage = async (file: File, imageKey: string): Promise<void> => {
  await uploadSiteImage(file, imageKey);
};

export const getCoverImageByKey = (images: CoverImage[], key: string): CoverImage | undefined => {
  return images.find(image => image.image_key === key);
};

function getTitleForKey(key: string): string {
  switch (key) {
    case 'hero_background':
      return 'Ana Sayfa Arkaplan Görseli';
    case 'about_team':
      return 'Hakkımızda Ekip Görseli';
    case 'featured_projects_cover':
      return 'Öne Çıkan Projeler Görseli';
    case 'hero_youtube_video':
      return 'Ana Sayfa YouTube Video Linki';
    default:
      return 'Site Görseli';
  }
}

function getDescriptionForKey(key: string): string {
  switch (key) {
    case 'hero_background':
      return 'Ana sayfada üst bölümde görünen arkaplan resmi';
    case 'about_team':
      return 'Ana sayfada hakkımızda bölümünde görünen ekip resmi';
    case 'featured_projects_cover':
      return 'Ana sayfada öne çıkan projeler bölümünde görünen kapak resmi';
    case 'hero_youtube_video':
      return 'Ana sayfanın üstündeki YouTube videosunun embed kodu veya linki (iframe src değeri)';
    default:
      return 'Site görseli';
  }
}
