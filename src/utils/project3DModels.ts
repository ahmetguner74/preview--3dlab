
import { supabase } from '@/integrations/supabase/client';
import { Project3DModel } from '@/types/project';
import { uploadFileToStorage } from './fileStorage';

// 3D model yükleme
export const upload3DModel = async (
  file: File, 
  projectId: string, 
  modelType: '3d_model' | 'point_cloud'
): Promise<string | null> => {
  try {
    // Dosyayı storage'a yükle
    const modelUrl = await uploadFileToStorage(file, 'models');
    
    if (!modelUrl) {
      throw new Error('Dosya yükleme işlemi başarısız');
    }
    
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
      throw error;
    }
    
    return modelUrl;
  } catch (error) {
    console.error('Model yükleme hatası:', error);
    return null;
  }
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
