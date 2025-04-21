
import { uploadSiteImage, getSiteImage } from '@/utils/siteImages';

export interface CoverImage {
  id: string;
  image_key: string;
  image_url: string;
  title: string;
  description: string;
  updated_at: string;
}

export const fetchCoverImages = async (): Promise<CoverImage[]> => {
  try {
    const imageKeys = ['hero_background', 'about_team', 'featured_projects_cover', 'hero_youtube_video'];
    const images: CoverImage[] = [];

    for (const key of imageKeys) {
      const url = await getSiteImage(key);
      if (url) {
        images.push({
          id: key,
          image_key: key,
          image_url: url,
          title: getTitleForKey(key),
          description: getDescriptionForKey(key),
          updated_at: new Date().toISOString(),
        });
      }
    }

    return images;
  } catch (error) {
    console.error('Kapak görselleri getirilemedi:', error);
    return [];
  }
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
