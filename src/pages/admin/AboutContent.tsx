
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, Save, ImageIcon, Info } from 'lucide-react';
import { AboutContent, getAboutContent, updateAboutContent } from '@/utils/aboutHelpers';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { uploadFileToStorage } from '@/utils/fileStorage';
import { updateAboutContentImage } from '@/utils/aboutHelpers';

const AboutContentPage = () => {
  const [aboutSections, setAboutSections] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchAboutContent = async () => {
      setLoading(true);
      const content = await getAboutContent();
      setAboutSections(content);
      setLoading(false);
    };

    fetchAboutContent();
  }, []);

  const handleInputChange = (
    id: string,
    field: keyof AboutContent,
    value: string
  ) => {
    setAboutSections((prev) =>
      prev.map((section) =>
        section.id === id ? { ...section, [field]: value } : section
      )
    );
  };

  const handleSave = async (section: AboutContent) => {
    try {
      setSaving(section.id);
      
      // Sadece değiştirilmiş alanları gönder
      const updates: Partial<AboutContent> = {
        title_tr: section.title_tr,
        title_en: section.title_en,
        content_tr: section.content_tr,
        content_en: section.content_en
      };
      
      const success = await updateAboutContent(section.id, updates);
      
      if (success) {
        toast.success('İçerik başarıyla güncellendi');
      } else {
        toast.error('İçerik güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('İçerik güncelleme hatası:', error);
      toast.error('İçerik güncellenirken bir hata oluştu');
    } finally {
      setSaving(null);
    }
  };

  const handleImageUpload = async (id: string, file: File) => {
    try {
      setUploadingImage(id);
      
      const imageUrl = await uploadFileToStorage(file, 'about-images');
      
      if (!imageUrl) {
        throw new Error('Görsel yüklenemedi');
      }
      
      const success = await updateAboutContentImage(id, imageUrl);
      
      if (success) {
        // Yerel durumu güncelle
        setAboutSections((prev) =>
          prev.map((section) =>
            section.id === id ? { ...section, image_url: imageUrl } : section
          )
        );
        
        toast.success('Görsel başarıyla güncellendi');
      } else {
        toast.error('Görsel güncellenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenirken bir hata oluştu');
    } finally {
      setUploadingImage(null);
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
              <span className="text-sm">Dashboard</span>
            </Link>
            <h1 className="text-xl font-medium">Hakkımızda İçerikleri</h1>
          </div>
        </header>
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Hakkımızda Bölümleri</h2>
            <div className="flex items-center text-sm text-gray-500">
              <Info size={16} className="mr-1" />
              <span>Düzenleme yapmak için bölüme tıklayın ve kaydete basın</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {aboutSections.map((section) => (
                <Card key={section.id} className="shadow-sm border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-medium flex items-center">
                      <span className="capitalize">{section.section_key.replace('_', ' ')}</span>
                      <div className="ml-3 px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-normal">
                        {section.section_key}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <Tabs defaultValue="content">
                      <TabsList className="mb-4">
                        <TabsTrigger value="content">İçerik</TabsTrigger>
                        <TabsTrigger value="image">Görsel</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="content" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <h3 className="font-medium text-sm">Türkçe İçerik</h3>
                            
                            <div className="space-y-2">
                              <label htmlFor={`title-tr-${section.id}`} className="text-sm text-gray-500">
                                Başlık (TR)
                              </label>
                              <Input
                                id={`title-tr-${section.id}`}
                                value={section.title_tr}
                                onChange={(e) => handleInputChange(section.id, 'title_tr', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor={`content-tr-${section.id}`} className="text-sm text-gray-500">
                                İçerik (TR)
                              </label>
                              <Textarea
                                id={`content-tr-${section.id}`}
                                value={section.content_tr}
                                onChange={(e) => handleInputChange(section.id, 'content_tr', e.target.value)}
                                rows={6}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="font-medium text-sm">İngilizce İçerik</h3>
                            
                            <div className="space-y-2">
                              <label htmlFor={`title-en-${section.id}`} className="text-sm text-gray-500">
                                Başlık (EN)
                              </label>
                              <Input
                                id={`title-en-${section.id}`}
                                value={section.title_en}
                                onChange={(e) => handleInputChange(section.id, 'title_en', e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <label htmlFor={`content-en-${section.id}`} className="text-sm text-gray-500">
                                İçerik (EN)
                              </label>
                              <Textarea
                                id={`content-en-${section.id}`}
                                value={section.content_en}
                                onChange={(e) => handleInputChange(section.id, 'content_en', e.target.value)}
                                rows={6}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button
                            onClick={() => handleSave(section)}
                            disabled={saving === section.id}
                            className="flex items-center"
                          >
                            {saving === section.id ? (
                              <>
                                <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Kaydediliyor...
                              </>
                            ) : (
                              <>
                                <Save size={18} className="mr-2" />
                                Kaydet
                              </>
                            )}
                          </Button>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="image">
                        <div className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <FileUploadBox
                                onFileSelected={(file) => handleImageUpload(section.id, file)}
                                title="Bölüm Görseli"
                                description="PNG, JPG veya WEBP formatı, maks. 2MB"
                                icon={<ImageIcon className="mx-auto h-12 w-12 text-gray-400" />}
                                allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                                maxSizeMB={2}
                              />
                            </div>
                            
                            <div>
                              {section.image_url ? (
                                <div className="border rounded-md overflow-hidden">
                                  <div className="aspect-video bg-gray-100 relative">
                                    <img
                                      src={section.image_url}
                                      alt={section.title_tr}
                                      className="w-full h-full object-cover"
                                    />
                                    {uploadingImage === section.id && (
                                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full"></div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3 bg-white">
                                    <p className="text-sm font-medium truncate">{section.title_tr}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="border rounded-md p-12 text-center bg-gray-50 flex flex-col items-center justify-center h-full">
                                  <ImageIcon className="h-12 w-12 text-gray-300 mb-2" />
                                  <p className="text-sm text-gray-500">Bu bölüm için henüz görsel yüklenmemiş</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AboutContentPage;
