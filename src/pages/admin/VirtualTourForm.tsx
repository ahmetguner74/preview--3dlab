
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import TourBasicForm, { TourFormValues } from '@/components/virtual-tour/form/TourBasicForm';
import { TourStatus } from '@/types/virtual-tour';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';
import { Panorama } from '@/types/virtual-tour';
import { Image, Pencil, Plus, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import PanoramaUploader from '@/components/virtual-tour/PanoramaUploader';

const VirtualTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TourFormValues | null>(null);
  const [panoramas, setPanoramas] = useState<Panorama[]>([]);
  const [openPanoramaSheet, setOpenPanoramaSheet] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [sortingPanorama, setSortingPanorama] = useState<{id: string, direction: 'up' | 'down'} | null>(null);

  useEffect(() => {
    if (id) {
      fetchTourData();
      fetchPanoramas();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          title: data.title,
          description: data.description || '',
          slug: data.slug,
          status: data.status as TourStatus,
          visible: data.visible
        });
      }
    } catch (error) {
      console.error('Tur verisi yüklenirken hata:', error);
      toast.error('Tur verisi yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchPanoramas = async () => {
    try {
      const { data, error } = await supabase
        .from('tour_panoramas')
        .select('*')
        .eq('tour_id', id)
        .order('sort_order');
        
      if (error) throw error;
      
      // Panoramaları formatlayarak state'e kaydet
      const formattedPanoramas = data?.map(p => {
        let initialViewData = { yaw: 0, pitch: 0, fov: 90 };
        
        if (typeof p.initial_view === 'string') {
          try {
            initialViewData = JSON.parse(p.initial_view);
          } catch (e) {
            console.error('Initial view parsing error:', e);
          }
        } else if (p.initial_view && typeof p.initial_view === 'object') {
          initialViewData = p.initial_view as any;
        }
        
        return {
          id: p.id,
          title: p.title,
          image_url: p.image_url,
          initial_view: initialViewData,
          sort_order: p.sort_order || 0
        };
      }) || [];
      
      setPanoramas(formattedPanoramas);
    } catch (error) {
      console.error('Panoramalar yüklenirken hata:', error);
      toast.error('Panoramalar yüklenemedi');
    }
  };

  const updatePanoramaOrder = async (id: string, direction: 'up' | 'down') => {
    try {
      setSortingPanorama({id, direction});
      
      const currentIndex = panoramas.findIndex(p => p.id === id);
      let newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      // Geçerli sınırlar içinde olduğundan emin ol
      if (newIndex < 0 || newIndex >= panoramas.length) {
        setSortingPanorama(null);
        return;
      }
      
      // Yerinde düzenleme yapalım
      const updatedPanoramas = [...panoramas];
      const panoramaToMove = updatedPanoramas[currentIndex];
      
      // Panormayı kaldır ve yeni pozisyona ekle
      updatedPanoramas.splice(currentIndex, 1);
      updatedPanoramas.splice(newIndex, 0, panoramaToMove);
      
      // Sıralamayı güncelle
      const updatedWithOrder = updatedPanoramas.map((p, index) => ({
        ...p,
        sort_order: index + 1
      }));
      
      setPanoramas(updatedWithOrder);
      
      // Veritabanını güncelle
      for (const update of updatedWithOrder) {
        await supabase
          .from('tour_panoramas')
          .update({ sort_order: update.sort_order })
          .eq('id', update.id);
      }
      
      toast.success('Panorama sıralaması güncellendi');
    } catch (error) {
      console.error('Sıralama güncellenirken hata:', error);
      toast.error('Sıralama güncellenemedi');
    } finally {
      setSortingPanorama(null);
    }
  };

  const deletePanorama = async (id: string) => {
    if (!confirm('Bu panoramayı silmek istediğinizden emin misiniz?')) return;
    
    try {
      const { error } = await supabase
        .from('tour_panoramas')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setPanoramas(prev => prev.filter(p => p.id !== id));
      toast.success('Panorama başarıyla silindi');
    } catch (error) {
      console.error('Panorama silinirken hata:', error);
      toast.error('Panorama silinemedi');
    }
  };

  const handleSubmit = async (values: TourFormValues) => {
    try {
      setLoading(true);

      if (id) {
        const { error } = await supabase
          .from('virtual_tours')
          .update({
            title: values.title,
            description: values.description,
            status: values.status,
            slug: values.slug,
            visible: values.visible
          })
          .eq('id', id);

        if (error) throw error;
        toast.success('Tur başarıyla güncellendi');
      } else {
        const { data, error } = await supabase
          .from('virtual_tours')
          .insert({
            title: values.title,
            description: values.description,
            status: values.status,
            slug: values.slug,
            visible: values.visible
          })
          .select();

        if (error) throw error;
        toast.success('Tur başarıyla oluşturuldu');
        
        if (data && data.length > 0) {
          navigate(`/admin/virtual-tours/${data[0].id}/edit`);
        }
      }
    } catch (error) {
      console.error('Tur kaydedilirken hata:', error);
      toast.error('Tur kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4">Yükleniyor...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold mb-6">
            {id ? 'Sanal Tur Düzenle' : 'Yeni Sanal Tur'}
          </h1>

          <TourBasicForm
            initialValues={formData}
            onSubmit={handleSubmit}
            loading={loading}
          />

          {id && (
            <div className="mt-10 border-t pt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Panoramalar</h2>
                <div className="flex gap-2">
                  <Button onClick={() => setShowUploadDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Panorama Ekle
                  </Button>
                  <Button variant="outline" onClick={() => setOpenPanoramaSheet(true)}>
                    <Image className="w-4 h-4 mr-2" /> Tüm Panoramaları Görüntüle
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {panoramas.slice(0, 6).map((panorama) => (
                  <div 
                    key={panorama.id}
                    className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={panorama.image_url}
                        alt={panorama.title}
                        className="object-cover w-full h-full"
                      />
                      <Badge className="absolute top-2 right-2">
                        #{panorama.sort_order}
                      </Badge>
                    </div>
                    <div className="p-3">
                      <p className="font-medium truncate">{panorama.title}</p>
                      <div className="flex gap-1 mt-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          disabled={panorama.sort_order === 1 || !!sortingPanorama}
                          onClick={() => updatePanoramaOrder(panorama.id, 'up')}
                          className="h-8 w-8"
                        >
                          <span className="sr-only">Yukarı Taşı</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          disabled={panorama.sort_order === panoramas.length || !!sortingPanorama}
                          onClick={() => updatePanoramaOrder(panorama.id, 'down')}
                          className="h-8 w-8"
                        >
                          <span className="sr-only">Aşağı Taşı</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="h-8 w-8 ml-auto"
                          onClick={() => deletePanorama(panorama.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {panoramas.length > 6 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" onClick={() => setOpenPanoramaSheet(true)}>
                    Tüm Panoramaları Görüntüle ({panoramas.length})
                  </Button>
                </div>
              )}

              {/* Panorama Listesi Popup */}
              <Sheet open={openPanoramaSheet} onOpenChange={setOpenPanoramaSheet}>
                <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
                  <SheetHeader className="mb-4">
                    <SheetTitle>Panorama Yönetimi</SheetTitle>
                  </SheetHeader>
                  
                  <div className="space-y-4">
                    <Button onClick={() => {
                      setOpenPanoramaSheet(false);
                      setTimeout(() => setShowUploadDialog(true), 300);
                    }}>
                      <Plus className="w-4 h-4 mr-2" /> Panorama Ekle
                    </Button>
                    
                    {panoramas.length === 0 ? (
                      <div className="text-center py-10">
                        <Image className="w-12 h-12 mx-auto text-gray-300" />
                        <p className="mt-2">Bu tura henüz panorama eklenmemiş.</p>
                        <Button 
                          className="mt-4" 
                          onClick={() => {
                            setOpenPanoramaSheet(false);
                            setTimeout(() => setShowUploadDialog(true), 300);
                          }}
                        >
                          İlk Panoramayı Ekle
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {panoramas.map((panorama) => (
                          <div 
                            key={panorama.id}
                            className="border rounded-md p-3 bg-white"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                                <img
                                  src={panorama.image_url}
                                  alt={panorama.title}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{panorama.title}</p>
                                <Badge className="mt-1">Sıra: {panorama.sort_order}</Badge>
                              </div>
                              <div className="flex flex-col gap-2">
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  disabled={panorama.sort_order === 1 || !!sortingPanorama}
                                  onClick={() => updatePanoramaOrder(panorama.id, 'up')}
                                  className="h-8 w-8"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up"><path d="m18 15-6-6-6 6"/></svg>
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="icon"
                                  disabled={panorama.sort_order === panoramas.length || !!sortingPanorama}
                                  onClick={() => updatePanoramaOrder(panorama.id, 'down')}
                                  className="h-8 w-8"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
                                </Button>
                              </div>
                              <Button
                                variant="ghost" 
                                size="icon"
                                onClick={() => deletePanorama(panorama.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              {/* Panorama Yükleme Dialog */}
              <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Panorama Yükle</DialogTitle>
                  </DialogHeader>
                  
                  <div className="py-4">
                    {id && (
                      <PanoramaUploader
                        tourId={id}
                        onComplete={() => {
                          fetchPanoramas();
                          setShowUploadDialog(false);
                        }}
                      />
                    )}
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                      Kapat
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualTourForm;
