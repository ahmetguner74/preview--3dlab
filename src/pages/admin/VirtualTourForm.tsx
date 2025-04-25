
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import TourBasicForm, { TourFormValues } from '@/components/virtual-tour/form/TourBasicForm';
import PanoramaManager from '@/components/virtual-tour/PanoramaManager';
import { TourStatus } from '@/types/virtual-tour';

const VirtualTourForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshPanoramas, setRefreshPanoramas] = useState(0);
  const [formData, setFormData] = useState<TourFormValues | null>(null);

  useEffect(() => {
    if (id) fetchTourData();
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

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1">
        {id ? (
          <PanoramaManager
            tourId={id}
            onPanoramaAdded={() => setRefreshPanoramas(prev => prev + 1)}
          />
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-semibold mb-6">Yeni Tur</h1>
            <TourBasicForm
              initialValues={formData}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualTourForm;
