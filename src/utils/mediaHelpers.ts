
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { ProjectImage, ProjectVideo, Project3DModel } from '@/types/project';

// Dosyayı storage'a yükle ve URL döndür
export const uploadFileToStorage = async (file: File, bucket: string): Promise<string | null> => {
  try {
    console.log(`Dosya yükleme başlatılıyor: ${file.name}, bucket: ${bucket}`);
    
    // Benzersiz bir dosya adı oluştur
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Dosya boyutu 5MB\'dan küçük olmalıdır');
    }
    
    // Supabase storage'a yükle
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Storage yükleme hatası:', error);
      throw error;
    }

    // Dosya URL'sini döndür
    const { data: urlData } = supabase
      .storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log('Dosya başarıyla yüklendi:', urlData.publicUrl);
    return urlData.publicUrl;
  } catch (error) {
    console.error('Dosya yükleme hatası:', error);
    return null;
  }
};

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

// 3D model yükleme
export const upload3DModel = async (
  file: File, 
  projectId: string, 
  modelType: '3d_model' | 'point_cloud'
): Promise<string | null> => {
  const modelUrl = await uploadFileToStorage(file, 'models');
  
  if (modelUrl) {
    try {
      // Veritabanına ekle
      const { error } = await supabase
        .from('project_3d_models')
        .insert({
          project_id: projectId,
          model_url: modelUrl,
          model_type: modelType
        });
      
      if (error) {
        console.error('Model kaydı hatası:', error);
        return null;
      }
      
      return modelUrl;
    } catch (error) {
      console.error('Model yükleme hatası:', error);
      return null;
    }
  }
  
  return null;
};

// Proje 3D modellerini getir
export const getProject3DModels = async (projectId: string): Promise<Project3DModel[]> => {
  try {
    const { data, error } = await supabase
      .from('project_3d_models')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) throw error;
    
    // Tip güvenliğini sağlamak için explicit casting yapıyoruz
    return data?.map(item => ({
      ...item,
      model_type: item.model_type as '3d_model' | 'point_cloud'
    })) || [];
  } catch (error) {
    console.error('Model getirme hatası:', error);
    return [];
  }
};

// Kapak görseli URL'sini getir
export const getSiteImage = async (imageKey: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('site_images')
      .select('image_url')
      .eq('image_key', imageKey)
      .single();
    
    if (error) return null;
    return data?.image_url || null;
  } catch (error) {
    console.error('Site görseli getirme hatası:', error);
    return null;
  }
};
