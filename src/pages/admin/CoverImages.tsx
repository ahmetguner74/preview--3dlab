
import React, { useState, useEffect } from 'react';
import { ArrowLeftCircle, LogOut, Loader2, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { uploadFileToStorage } from '@/utils/mediaHelpers';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CoverImage {
  id: string;
  image_key: string;
  image_url: string;
  title: string;
  description: string;
}

const CoverImages = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [coverImages, setCoverImages] = useState<CoverImage[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fetchCoverImages = async () => {
    try {
      setLoading(true);
      
      // Kapak resimlerini getir
      const { data, error } = await supabase
        .from('site_images')
        .select('*')
        .in('image_key', ['hero_background', 'about_team', 'featured_projects_cover']);
      
      if (error) throw error;
      setCoverImages(data || []);
    } catch (error) {
      console.error('Kapak resimleri yüklenirken hata:', error);
      toast.error('Kapak resimleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoverImages();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchCoverImages();
    setRefreshing(false);
    toast.success('Kapak resimleri yenilendi');
  };

  const handleFileUpload = async (file: File, imageKey: string) => {
    try {
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
      
      // Her resim için özel başlık ve açıklama
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
        // Varsa güncelle
        const { error } = await supabase
          .from('site_images')
          .update({
            image_url: imageUrl,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingImage.id);
        
        if (error) throw error;
        toast.success('Görsel güncellendi');
      } else {
        // Yoksa yeni kayıt oluştur
        const { error } = await supabase
          .from('site_images')
          .insert({
            image_key: imageKey,
            image_url: imageUrl,
            title,
            description,
          });
        
        if (error) throw error;
        toast.success('Görsel eklendi');
      }
      
      // Resimleri yeniden yükle
      fetchCoverImages();
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    }
  };

  const getCoverImageByKey = (key: string): CoverImage | undefined => {
    return coverImages.find(image => image.image_key === key);
  };

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
    setDialogOpen(true);
  };

  // Kapak görsellerini görüntüleme ve yükleme bileşeni
  const CoverImageSection = ({ 
    imageKey, 
    title, 
    description 
  }: { 
    imageKey: string, 
    title: string, 
    description: string 
  }) => {
    const image = getCoverImageByKey(imageKey);
    
    return (
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        
        {image?.image_url ? (
          <div className="mb-4">
            <div 
              className="aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden mb-2"
              onClick={() => handleImageClick(image.image_url)}
            >
              <img 
                src={image.image_url} 
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-xs text-gray-500">
              Son güncelleme: {new Date(image.updated_at || '').toLocaleDateString('tr-TR')}
            </div>
          </div>
        ) : (
          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-4">
            <p className="text-gray-500">Görsel henüz yüklenmemiş</p>
          </div>
        )}
        
        <FileUploadBox
          onFileSelected={(file) => handleFileUpload(file, imageKey)}
          title="Yeni görsel yükle"
          description="JPG, PNG veya WebP formatında görsel yükleyebilirsiniz"
          allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
        />
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Üst Menü */}
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
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 size={36} className="animate-spin text-arch-black" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CoverImageSection 
                imageKey="hero_background"
                title="Ana Sayfa Arkaplan Görseli"
                description="Ana sayfada üst bölümde görünen arkaplan resmi"
              />
              
              <CoverImageSection 
                imageKey="about_team"
                title="Hakkımızda Ekip Görseli"
                description="Ana sayfada hakkımızda bölümünde görünen ekip resmi"
              />
              
              <CoverImageSection 
                imageKey="featured_projects_cover"
                title="Öne Çıkan Projeler Görseli"
                description="Ana sayfada öne çıkan projeler bölümünde görünen kapak resmi"
              />
            </div>
          )}
        </main>
      </div>
      
      {/* Görsel Önizleme Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Görsel Önizleme</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="w-full">
              <img 
                src={selectedImage} 
                alt="Görsel önizleme" 
                className="w-full h-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoverImages;
