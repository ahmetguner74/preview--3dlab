
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Image, Settings, Eye, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PanoramaManagerProps {
  tourId: string;
  onPanoramaAdded?: () => void;
}

const PanoramaManager: React.FC<PanoramaManagerProps> = ({ tourId, onPanoramaAdded }) => {
  const [showSettingsSheet, setShowSettingsSheet] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
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
    <>
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Panorama Yönetimi</h2>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSettingsSheet(true)}
            >
              <Settings className="h-4 w-4 mr-2" /> Ayarlar
            </Button>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Image className="h-4 w-4 mr-2" /> Panorama Ekle
            </Button>
          </div>
        </div>

        {!panoramas?.length ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed">
            <Image className="w-12 h-12 mx-auto text-gray-300" />
            <h3 className="mt-2 text-sm font-semibold">Henüz panorama bulunmuyor</h3>
            <p className="mt-1 text-sm text-gray-500">Sanal tur oluşturmaya başlamak için panorama yükleyin</p>
            <div className="mt-6">
              <Button onClick={() => setShowUploadDialog(true)}>
                Panorama Yükle
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {panoramas.map((panorama, index) => (
              <div key={panorama.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={panorama.image_url}
                    alt={panorama.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium truncate">{panorama.title}</span>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ayarlar Sheet */}
      <Sheet open={showSettingsSheet} onOpenChange={setShowSettingsSheet}>
        <SheetContent side="left" className="w-80">
          <SheetHeader className="mb-5">
            <SheetTitle>Tur Ayarları</SheetTitle>
          </SheetHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Otomatik Döndürme</span>
              <Button 
                variant={settings.autoRotate ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, autoRotate: !s.autoRotate }))}
              >
                <Eye className="h-4 w-4 mr-2" />
                {settings.autoRotate ? 'Açık' : 'Kapalı'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sürükleme ile Döndürme</span>
              <Button
                variant={settings.dragToRotate ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, dragToRotate: !s.dragToRotate }))}
              >
                {settings.dragToRotate ? 'Açık' : 'Kapalı'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Kontrol Butonları</span>
              <Button
                variant={settings.showControls ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, showControls: !s.showControls }))}
              >
                {settings.showControls ? 'Göster' : 'Gizle'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tam Ekran</span>
              <Button
                variant={settings.fullscreen ? "default" : "outline"}
                size="sm"
                onClick={() => setSettings(s => ({ ...s, fullscreen: !s.fullscreen }))}
              >
                {settings.fullscreen ? 'Açık' : 'Kapalı'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Panorama Yükleme Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Panorama Yükle</DialogTitle>
          </DialogHeader>
          {/* Burada Panorama yükleme bileşeni olacak */}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PanoramaManager;
