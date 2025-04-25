
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TourStatus } from '@/types/virtual-tour';
import PanoramaEditor from '@/components/virtual-tour/PanoramaEditor';
import PanoramaUploader from '@/components/virtual-tour/PanoramaUploader';

const formSchema = z.object({
  title: z.string().min(1, 'Başlık zorunludur'),
  description: z.string().optional(),
  status: z.enum(['taslak', 'yayinda', 'arsiv'] as const),
  slug: z.string().min(1, 'URL zorunludur'),
  visible: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const VirtualTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPanoramaEditor, setShowPanoramaEditor] = useState(false);
  const [refreshPanoramas, setRefreshPanoramas] = useState(0);
  const [panoramas, setPanoramas] = useState<any[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'taslak' as TourStatus,
      slug: '',
      visible: false,
    },
  });

  useEffect(() => {
    if (id) {
      fetchTourData();
      fetchPanoramas();
    }
  }, [id, refreshPanoramas]);

  const fetchTourData = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        const formData: FormValues = {
          title: data.title,
          description: data.description || '',
          status: data.status as TourStatus,
          slug: data.slug,
          visible: data.visible
        };
        form.reset(formData);
      }
    } catch (error) {
      console.error('Tur verisi yüklenirken hata:', error);
      toast.error('Tur verisi yüklenemedi');
    }
  };

  const fetchPanoramas = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('tour_panoramas')
        .select('*')
        .eq('tour_id', id)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      setPanoramas(data || []);
    } catch (error) {
      console.error('Panoramalar yüklenirken hata:', error);
      toast.error('Panoramalar yüklenemedi');
    }
  };

  const onSubmit = async (values: FormValues) => {
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
        // Yeni tur oluşturma işlemi sırasında title ve slug alanlarının zorunlu olduğunu kontrol ederiz
        if (!values.title || !values.slug) {
          toast.error('Başlık ve URL alanları zorunludur');
          setLoading(false);
          return;
        }

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
        
        // Yeni oluşturulan turun düzenleme sayfasına yönlendirme
        if (data && data.length > 0) {
          navigate(`/admin/virtual-tours/${data[0].id}/edit`);
        } else {
          navigate('/admin/virtual-tours');
        }
      }
    } catch (error) {
      console.error('Tur kaydedilirken hata:', error);
      toast.error('Tur kaydedilemedi');
    } finally {
      setLoading(false);
    }
  };

  const handlePanoramaUploadComplete = () => {
    setRefreshPanoramas(prev => prev + 1);
    toast.success('Panoramalar başarıyla yüklendi');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <h1 className="text-2xl font-semibold">
            {id ? 'Turu Düzenle' : 'Yeni Tur'}
          </h1>
        </header>

        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Başlık</FormLabel>
                        <FormControl>
                          <Input placeholder="Tur başlığı" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Açıklama</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tur açıklaması"
                            className="resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input placeholder="tur-basligi" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL'de kullanılacak kısa isim (örn: tur-basligi)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </form>
              </Form>
            </div>

            {id && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Panoramalar</h2>
                  <Button onClick={() => setShowPanoramaEditor(true)}>
                    Panorama Ekle
                  </Button>
                </div>

                {/* Mevcut panoramaların listesi */}
                {panoramas.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {panoramas.map((panorama) => (
                      <div key={panorama.id} className="border rounded-md p-3">
                        <p className="font-medium">{panorama.title}</p>
                        <div className="aspect-square bg-gray-100 mt-2 overflow-hidden rounded">
                          <img 
                            src={panorama.image_url} 
                            alt={panorama.title} 
                            className="object-cover w-full h-full" 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 my-4">Henüz panorama eklenmemiş.</p>
                )}

                {/* Panorama yükleyici */}
                <div className="mb-6">
                  <h3 className="text-md font-medium mb-3">Panorama Yükle</h3>
                  <PanoramaUploader 
                    tourId={id} 
                    onComplete={handlePanoramaUploadComplete}
                  />
                </div>

                {showPanoramaEditor && (
                  <PanoramaEditor
                    tourId={id}
                    onSave={async (data) => {
                      try {
                        const { error } = await supabase
                          .from('tour_panoramas')
                          .insert({
                            tour_id: id,
                            title: data.title,
                            image_url: data.image_url,
                            initial_view: data.initial_view as any,
                            sort_order: panoramas.length
                          });

                        if (error) throw error;
                        toast.success('Panorama başarıyla eklendi');
                        setShowPanoramaEditor(false);
                        setRefreshPanoramas(prev => prev + 1);
                      } catch (error) {
                        console.error('Panorama eklenirken hata:', error);
                        toast.error('Panorama eklenemedi');
                      }
                    }}
                  />
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VirtualTourForm;
