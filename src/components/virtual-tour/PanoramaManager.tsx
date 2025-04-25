
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import FileUploadBox from '../admin/FileUploadBox';
import { Image, ArrowLeft, ArrowRight, Settings, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider
} from '@/components/ui/sidebar';
import { toast } from 'sonner';
import { uploadFileToStorage } from '@/utils/fileStorage';

interface PanoramaManagerProps {
  tourId: string;
  onPanoramaAdded?: () => void;
}

const PanoramaManager: React.FC<PanoramaManagerProps> = ({ tourId, onPanoramaAdded }) => {
  const [uploading, setUploading] = useState(false);
  const [settings, setSettings] = useState({
    autoRotate: true,
    dragToRotate: true,
    showControls: true,
    fullscreen: true
  });

  const { data: panoramas, refetch } = useQuery({
    queryKey: ['tour-panoramas', tourId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tour_panoramas')
        .select('*')
        .eq('tour_id', tourId)
        .order('sort_order');

      if (error) throw error;
      return data;
    }
  });

  const handlePanoramaUpload = async (file: File) => {
    try {
      setUploading(true);
      
      const imageUrl = await uploadFileToStorage(file, 'panoramas');
      if (!imageUrl) throw new Error('Panorama yüklenemedi');

      const { error } = await supabase
        .from('tour_panoramas')
        .insert({
          tour_id: tourId,
          title: file.name.split('.')[0],
          image_url: imageUrl,
          sort_order: (panoramas?.length || 0) + 1,
          initial_view: { yaw: 0, pitch: 0, fov: 90 }
        });

      if (error) throw error;

      await refetch();
      onPanoramaAdded?.();
      toast.success('Panorama başarıyla yüklendi');
    } catch (error) {
      console.error('Panorama yükleme hatası:', error);
      toast.error('Panorama yüklenirken bir hata oluştu');
    } finally {
      setUploading(false);
    }
  };
  
  // Sıralama güncelleme fonksiyonu
  const updatePanoramaOrder = async (id: string, newPosition: number) => {
    try {
      if (!panoramas) return;
      
      // Güncellenen panoramaların yeni sıralaması hesaplanıyor
      const updatedPanoramas = [...panoramas].sort((a, b) => 
        (a.sort_order || 0) - (b.sort_order || 0)
      );
      
      const currentIndex = updatedPanoramas.findIndex(p => p.id === id);
      const item = updatedPanoramas[currentIndex];
      
      // Yeni pozisyona taşı
      updatedPanoramas.splice(currentIndex, 1);
      updatedPanoramas.splice(newPosition - 1, 0, item);
      
      // Tüm sıra numaralarını güncelle
      const updates = updatedPanoramas.map((p, index) => ({
        id: p.id,
        sort_order: index + 1
      }));
      
      // Veritabanını güncelle
      for (const update of updates) {
        await supabase
          .from('tour_panoramas')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
      
      await refetch();
      toast.success('Panorama sıralaması güncellendi');
    } catch (error) {
      console.error('Sıralama güncellenirken hata:', error);
      toast.error('Sıralama güncellenemedi');
    }
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar side="left" className="w-64 border-r">
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Ayarlar</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Görünüm Kontrolleri</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setSettings(s => ({ ...s, autoRotate: !s.autoRotate }))}
                    isActive={settings.autoRotate}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Otomatik döndürme</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setSettings(s => ({ ...s, dragToRotate: !s.dragToRotate }))}
                    isActive={settings.dragToRotate}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Sürüklemek</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 p-6 space-y-6">
          <Card className="p-4">
            <FileUploadBox
              onFileSelected={handlePanoramaUpload}
              title="Panorama Yükle"
              description="360° panorama görseli yükleyin (JPG, PNG)"
              allowedTypes={['jpg', 'jpeg', 'png']}
              icon={<Image className="w-12 h-12 mx-auto text-gray-400" />}
            />
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {panoramas?.map((panorama, index) => (
              <Card key={panorama.id} className="p-4">
                <img
                  src={panorama.image_url}
                  alt={panorama.title}
                  className="w-full aspect-[16/9] object-cover rounded-lg mb-2"
                />
                <div className="flex items-center justify-between">
                  <span className="font-medium">{panorama.title}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => index > 0 && updatePanoramaOrder(panorama.id, index)}
                      disabled={index === 0}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => 
                        index < (panoramas.length - 1) && 
                        updatePanoramaOrder(panorama.id, index + 2)
                      }
                      disabled={index === panoramas.length - 1}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default PanoramaManager;
