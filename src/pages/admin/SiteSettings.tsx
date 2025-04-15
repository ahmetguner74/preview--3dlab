
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, Save } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getAllSiteImages, updateSiteImage } from '@/utils/siteHelpers';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { uploadFileToStorage } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SiteImage {
  id: string;
  image_key: string;
  image_url: string;
  title: string | null;
  description: string | null;
}

const SiteSettings = () => {
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSiteImages();
  }, []);

  const fetchSiteImages = async () => {
    setLoading(true);
    const images = await getAllSiteImages();
    setSiteImages(images as SiteImage[]);
    setLoading(false);
  };

  const handleImageUpload = async (imageKey: string, file: File) => {
    try {
      setSaving(prev => ({ ...prev, [imageKey]: true }));
      const imageUrl = await uploadFileToStorage(file, 'site-images', 'site/');
      
      if (!imageUrl) {
        toast.error('Görsel yüklenirken bir hata oluştu');
        return;
      }
      
      const updated = await updateSiteImage(imageKey, imageUrl);
      
      if (updated) {
        toast.success('Görsel başarıyla güncellendi');
        await fetchSiteImages();
      } else {
        toast.error('Görsel güncellenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
      console.error('Upload error:', error);
    } finally {
      setSaving(prev => ({ ...prev, [imageKey]: false }));
    }
  };

  const handleTitleUpdate = async (imageKey: string, newTitle: string, imageUrl: string) => {
    try {
      setSaving(prev => ({ ...prev, [imageKey + '_title']: true }));
      const updated = await updateSiteImage(imageKey, imageUrl, newTitle);
      
      if (updated) {
        toast.success('Başlık başarıyla güncellendi');
        await fetchSiteImages();
      } else {
        toast.error('Başlık güncellenirken bir hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(prev => ({ ...prev, [imageKey + '_title']: false }));
    }
  };

  const getImageDescription = (key: string) => {
    switch (key) {
      case 'hero_background':
        return 'Ana sayfadaki hero bölümünün arka plan görseli. Önerilen boyut: En az 1920x1080px.';
      case 'about_team':
        return 'Hakkımızda önizleme bölümündeki ekip görseli. Önerilen boyut: Kare veya dikey format.';
      default:
        return 'Site görseli';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Üst Menü */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Gösterge Paneline Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Site Görselleri</h1>
          </div>
        </header>
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Site Görsellerini Yönet</h2>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <p className="mt-2 text-gray-600">Görseller yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {siteImages.map((image) => (
                  <div key={image.id} className="border rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-1 capitalize">
                          {image.image_key.replace(/_/g, ' ')}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          {getImageDescription(image.image_key)}
                        </p>
                        
                        <div className="mb-4">
                          <Label htmlFor={`title-${image.id}`}>Görsel Başlığı</Label>
                          <div className="flex gap-2">
                            <Input 
                              id={`title-${image.id}`} 
                              defaultValue={image.title || ''} 
                              className="flex-1"
                            />
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={(e) => {
                                const input = document.getElementById(`title-${image.id}`) as HTMLInputElement;
                                handleTitleUpdate(image.image_key, input.value, image.image_url);
                              }}
                              disabled={saving[image.image_key + '_title']}
                            >
                              {saving[image.image_key + '_title'] ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></span>
                                  Kaydediliyor
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Save size={16} className="mr-1" />
                                  Kaydet
                                </span>
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <FileUploadBox
                          title="Görseli Değiştir"
                          description="Yeni görsel yüklemek için tıklayın veya sürükleyip bırakın"
                          onFileSelected={(file) => handleImageUpload(image.image_key, file)}
                          allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                        />
                      </div>
                      
                      <div className="h-64 overflow-hidden border rounded">
                        <img 
                          src={image.image_url} 
                          alt={image.title || image.image_key}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SiteSettings;
