
import React, { useState, useEffect } from 'react';
import { ArrowLeftCircle, LogOut, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import CoverImageSection from '@/components/admin/CoverImageSection';
import ImagePreviewDialog from '@/components/admin/ImagePreviewDialog';
import { fetchCoverImages, uploadCoverImage, getCoverImageByKey, CoverImage } from '@/api/coverImagesApi';
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

  // hero_youtube_video için embed linkini direkt güncelle
  const handleYoutubeLinkChange = async (link: string, imageKey: string) => {
    if (!link || !link.startsWith("https://")) {
      toast.error("Lütfen geçerli bir YouTube linki girin.");
      return;
    }
    try {
      // Mevcut kayıt var mı kontrol et
      const { data: existing, error: selError } = await supabase
        .from('site_images')
        .select('id')
        .eq('image_key', imageKey)
        .maybeSingle();
      if (selError) throw selError;
      if (existing?.id) {
        // Güncelle
        const { error } = await supabase
          .from('site_images')
          .update({ image_url: link, updated_at: new Date().toISOString() })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        // Ekle
        const { error } = await supabase
          .from('site_images')
          .insert({ image_key: imageKey, image_url: link });
        if (error) throw error;
      }
      toast.success("YouTube video linki kaydedildi");
      loadCoverImages();
    } catch (err) {
      toast.error("YouTube video linki kaydedilemedi");
    }
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Siteye Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Kapak Görselleri</h1>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh} 
              disabled={refreshing}
              className="mr-4"
            >
              {refreshing ? (
                <Loader2 size={16} className="animate-spin mr-2" />
              ) : (
                <RefreshCw size={16} className="mr-2" />
              )}
              Yenile
            </Button>
            <button className="flex items-center text-gray-600 hover:text-arch-black">
              <span className="text-sm mr-2">Çıkış Yap</span>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 size={36} className="animate-spin text-arch-black" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <CoverImageSection 
                imageKey="hero_background"
                title="Ana Sayfa Arkaplan Görseli"
                description="Ana sayfada üst bölümde görünen arkaplan resmi"
                imageUrl={getCoverImageByKey(coverImages, 'hero_background')?.image_url}
                updatedAt={getCoverImageByKey(coverImages, 'hero_background')?.updated_at}
                onImageClick={handleImageClick}
                onFileSelected={handleFileUpload}
              />
              
              <CoverImageSection 
                imageKey="about_team"
                title="Hakkımızda Ekip Görseli"
                description="Ana sayfada hakkımızda bölümünde görünen ekip resmi"
                imageUrl={getCoverImageByKey(coverImages, 'about_team')?.image_url}
                updatedAt={getCoverImageByKey(coverImages, 'about_team')?.updated_at}
                onImageClick={handleImageClick}
                onFileSelected={handleFileUpload}
              />
              
              <CoverImageSection 
                imageKey="featured_projects_cover"
                title="Öne Çıkan Projeler Görseli"
                description="Ana sayfada öne çıkan projeler bölümünde görünen kapak resmi"
                imageUrl={getCoverImageByKey(coverImages, 'featured_projects_cover')?.image_url}
                updatedAt={getCoverImageByKey(coverImages, 'featured_projects_cover')?.updated_at}
                onImageClick={handleImageClick}
                onFileSelected={handleFileUpload}
              />

              <CoverImageSection
                imageKey="hero_youtube_video"
                title="Ana Sayfa YouTube Video Linki"
                description="Ana sayfanın üstündeki YouTube videosu için YouTube linki veya iframe kodu"
                imageUrl={getCoverImageByKey(coverImages, 'hero_youtube_video')?.image_url}
                updatedAt={getCoverImageByKey(coverImages, 'hero_youtube_video')?.updated_at}
                onImageClick={handleImageClick}
                onFileSelected={handleFileUpload}
                onYoutubeLinkChange={handleYoutubeLinkChange}
              />
            </div>
          )}
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
