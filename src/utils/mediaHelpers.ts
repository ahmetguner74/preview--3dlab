
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

/**
 * Dosyayı Supabase Storage'a yükleyen fonksiyon
 */
export const uploadFileToStorage = async (
  file: File,
  bucketName: string = 'project-files',
  folderPath: string = ''
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${folderPath}${uuidv4()}.${fileExt}`;
    
    // Büyük dosya kontrolü
    const MAX_SIZE = 50 * 1024 * 1024; // 50MB limit
    if (file.size > MAX_SIZE) {
      throw new Error(`Dosya boyutu 50MB'ı aşamaz (Mevcut boyut: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
    }
    
    // Dosyayı doğrudan yükle, bucket kontrolü kaldırıldı
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });
    
    if (error) {
      console.error('Dosya yükleme hatası:', error);
      throw error;
    }
    
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    console.log('Dosya başarıyla yüklendi:', publicUrlData.publicUrl);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return null;
  }
};

/**
 * Proje görseli yükleyen fonksiyon
 */
export const uploadProjectImage = async (
  file: File,
  projectId: string,
  imageType: 'main' | 'gallery' | 'before' | 'after' = 'gallery',
  sortOrder: number = 0
): Promise<string | null> => {
  try {
    const imageUrl = await uploadFileToStorage(file, 'project-images', `${projectId}/`);
    
    if (!imageUrl) return null;
    
    // Veritabanına resim bilgisini kaydet
    const { error } = await supabase
      .from('project_images')
      .insert({
        project_id: projectId,
        image_url: imageUrl,
        image_type: imageType,
        sort_order: sortOrder
      });
    
    if (error) throw error;
    
    return imageUrl;
  } catch (error) {
    console.error('Görsel yükleme hatası:', error);
    return null;
  }
};

/**
 * Proje videosu ekleyen fonksiyon
 */
export const addProjectVideo = async (
  videoUrl: string,
  projectId: string,
  thumbnailUrl?: string,
  sortOrder: number = 0
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('project_videos')
      .insert({
        project_id: projectId,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        sort_order: sortOrder
      });
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error('Video ekleme hatası:', error);
    return false;
  }
};

/**
 * 3D model dosyası yükleyen fonksiyon
 */
export const upload3DModel = async (
  file: File,
  projectId: string,
  modelType: '3d_model' | 'point_cloud' = '3d_model'
): Promise<string | null> => {
  try {
    const modelUrl = await uploadFileToStorage(file, '3d-models', `${projectId}/`);
    
    if (!modelUrl) return null;
    
    // Veritabanına model bilgisini kaydet
    const { error } = await supabase
      .from('project_3d_models')
      .insert({
        project_id: projectId,
        model_url: modelUrl,
        model_type: modelType
      });
    
    if (error) throw error;
    
    return modelUrl;
  } catch (error) {
    console.error('3D model yükleme hatası:', error);
    return null;
  }
};

/**
 * Dosya türünü kontrol eden yardımcı fonksiyon
 */
export const checkFileType = (file: File, allowedTypes: string[]): boolean => {
  const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
  return allowedTypes.includes(fileExt);
};

/**
 * Projeye ait görselleri getiren fonksiyon
 */
export const getProjectImages = async (projectId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('project_images')
      .select('*')
      .eq('project_id', projectId)
      .order('sort_order', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Görsel getirme hatası:', error);
    return [];
  }
};

/**
 * Projeye ait videoları getiren fonksiyon
 */
export const getProjectVideos = async (projectId: string): Promise<any[]> => {
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

/**
 * Projeye ait 3D modelleri getiren fonksiyon
 */
export const getProject3DModels = async (projectId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('project_3d_models')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('3D model getirme hatası:', error);
    return [];
  }
};
