
import { useState } from 'react';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/utils/fileStorage';
import { supabase } from '@/integrations/supabase/client';

interface PanoramaUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export const usePanoramaUploads = (tourId: string) => {
  const [uploads, setUploads] = useState<Map<string, PanoramaUpload>>(new Map());

  const addFiles = (files: FileList) => {
    const newUploads = new Map(uploads);
    Array.from(files).forEach(file => {
      newUploads.set(file.name, {
        file,
        progress: 0,
        status: 'pending'
      });
    });
    setUploads(newUploads);
  };

  const uploadPanorama = async (file: File) => {
    try {
      // Dosyayı storage'a yükle
      const imageUrl = await uploadFileToStorage(file, 'panoramas');
      if (!imageUrl) throw new Error('Panorama yüklenemedi');

      // Veritabanına kaydet
      const { error } = await supabase
        .from('tour_panoramas')
        .insert({
          tour_id: tourId,
          title: file.name.split('.')[0],
          image_url: imageUrl,
          initial_view: { yaw: 0, pitch: 0, fov: 90 }
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Panorama yükleme hatası:', error);
      throw error;
    }
  };

  const startUploads = async () => {
    const uploadPromises = Array.from(uploads.entries()).map(async ([name, upload]) => {
      try {
        setUploads(prev => {
          const updated = new Map(prev);
          updated.set(name, { ...upload, status: 'uploading' });
          return updated;
        });

        await uploadPanorama(upload.file);

        setUploads(prev => {
          const updated = new Map(prev);
          updated.set(name, { ...upload, status: 'success', progress: 100 });
          return updated;
        });
      } catch (error) {
        setUploads(prev => {
          const updated = new Map(prev);
          updated.set(name, {
            ...upload,
            status: 'error',
            error: error instanceof Error ? error.message : 'Bilinmeyen hata'
          });
          return updated;
        });
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success('Tüm panoramalar başarıyla yüklendi');
      setUploads(new Map());
    } catch (error) {
      toast.error('Bazı panoramalar yüklenemedi');
    }
  };

  const removeUpload = (fileName: string) => {
    setUploads(prev => {
      const updated = new Map(prev);
      updated.delete(fileName);
      return updated;
    });
  };

  const clearUploads = () => {
    setUploads(new Map());
  };

  return {
    uploads,
    addFiles,
    startUploads,
    removeUpload,
    clearUploads
  };
};
