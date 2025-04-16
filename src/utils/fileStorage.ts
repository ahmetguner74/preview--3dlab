
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
