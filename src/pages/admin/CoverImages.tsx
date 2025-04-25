
import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/header/AdminHeader';
import CoverImageGrid from '@/components/admin/cover-images/CoverImageGrid';
import ImagePreviewDialog from '@/components/admin/ImagePreviewDialog';
import { fetchCoverImages, uploadCoverImage, CoverImage } from '@/api/coverImagesApi';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const CoverImages = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coverImages, setCoverImages] = useState<CoverImage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadCoverImages = async () => {
    try {
      setLoading(true);
      const data = await fetchCoverImages();
      setCoverImages(data);
    } catch (error) {
      console.error('Kapak resimleri yüklenirken hata:', error);
      toast.error('Kapak resimleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoverImages();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadCoverImages();
    setRefreshing(false);
    toast.success('Kapak resimleri yenilendi');
  };

  const handleFileUpload = async (file: File, imageKey: string) => {
    try {
      await uploadCoverImage(file, imageKey);
      toast.success('Görsel başarıyla yüklendi');
      loadCoverImages();
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    }
  };

  const handleSettingsChange = async (settings: any, imageKey: string) => {
    try {
      const { data: existingImage, error: selError } = await supabase
        .from('site_images')
        .select('id')
        .eq('image_key', imageKey)
        .maybeSingle();
      
      if (selError) throw selError;
      
      if (existingImage?.id) {
        const { error } = await supabase
          .from('site_images')
          .update({ 
            settings,
            updated_at: new Date().toISOString() 
          })
          .eq('image_key', imageKey);

        if (error) throw error;

        // Arayüzde de güncelleyelim
        setCoverImages(prev => prev.map(img => 
          img.image_key === imageKey 
            ? { ...img, settings, updated_at: new Date().toISOString() } 
            : img
        ));
        
        // Bildirimi sadece kayıt zamanında gösterelim, her değişiklikte değil
        // toast.success('Ayarlar başarıyla güncellendi');
      }
    } catch (err) {
      console.error('Ayarlar güncellenirken hata:', err);
      toast.error('Ayarlar güncellenemedi');
    }
  };

  const handleYoutubeLinkChange = async (link: string, imageKey: string) => {
    if (!link || !link.startsWith("https://")) {
      toast.error("Lütfen geçerli bir YouTube linki girin.");
      return;
    }
    try {
      const { data: existing, error: selError } = await supabase
        .from('site_images')
        .select('id')
        .eq('image_key', imageKey)
        .maybeSingle();
      
      if (selError) throw selError;
      
      if (existing?.id) {
        const { error } = await supabase
          .from('site_images')
          .update({ image_url: link, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_images')
          .insert({ 
            image_key: imageKey, 
            image_url: link,
            settings: {
              opacity: '1',
              height: '100vh',
              position: 'center',
              overlay_color: 'rgba(0, 0, 0, 0)',
              blend_mode: 'normal'
            }
          });
          
        if (error) throw error;
      }
      
      toast.success("YouTube video linki kaydedildi");
      loadCoverImages();
    } catch (err) {
      console.error('YouTube bağlantısı kaydedilemedi:', err);
      toast.error("YouTube video linki kaydedilemedi");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          title="Kapak Görselleri"
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <CoverImageGrid
            loading={loading}
            coverImages={coverImages}
            onImageClick={(url) => {
              setSelectedImage(url);
              setDialogOpen(true);
            }}
            onFileSelected={handleFileUpload}
            onYoutubeLinkChange={handleYoutubeLinkChange}
            onSettingsChange={handleSettingsChange}
          />
        </main>
      </div>
      
      <ImagePreviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        imageUrl={selectedImage}
      />
    </div>
  );
};

export default CoverImages;
