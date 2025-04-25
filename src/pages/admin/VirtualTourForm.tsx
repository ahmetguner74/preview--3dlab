import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import TourBasicForm, { TourFormValues } from '@/components/virtual-tour/form/TourBasicForm';
import PanoramaManagement from '@/components/virtual-tour/form/PanoramaManagement';

const VirtualTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshPanoramas, setRefreshPanoramas] = useState(0);
  const [panoramas, setPanoramas] = useState<any[]>([]);
  const [formData, setFormData] = useState<TourFormValues | null>(null);

  useEffect(() => {
    if (id) {
      fetchTourData().then(data => {
        if (data) {
          setFormData(data);
        }
      });
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
        return data;
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
              <TourBasicForm
                initialValues={formData}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>

            {id && (
              <div className="bg-white rounded-lg shadow p-6">
                <PanoramaManagement
                  tourId={id}
                  panoramas={panoramas}
                  onPanoramaAdded={() => setRefreshPanoramas(prev => prev + 1)}
                />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VirtualTourForm;
