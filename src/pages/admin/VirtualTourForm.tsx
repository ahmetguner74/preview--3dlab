
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { TourStatus } from '@/types/virtual-tour';

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      status: 'taslak',
      slug: '',
      visible: false,
    },
  });

  useEffect(() => {
    if (id) {
      fetchTourData();
    }
  }, [id]);

  const fetchTourData = async () => {
    try {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        // Veriyi form değerlerine dönüştür
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

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      if (id) {
        // Güncelleme
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
        // Yeni tur oluşturma
        const { error } = await supabase
          .from('virtual_tours')
          .insert({
            title: values.title,
            description: values.description,
            status: values.status,
            slug: values.slug,
            visible: values.visible
          });

        if (error) throw error;
        toast.success('Tur başarıyla oluşturuldu');
      }

      navigate('/admin/virtual-tours');
    } catch (error) {
      console.error('Tur kaydedilirken hata:', error);
      toast.error('Tur kaydedilemedi');
    } finally {
      setLoading(false);
    }
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
          <div className="max-w-3xl mx-auto">
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default VirtualTourForm;
