
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import VirtualTourViewer from '@/components/virtual-tour/VirtualTourViewer';

const VirtualTourDetail = () => {
  const { slug } = useParams();

  const { data: tourData, isLoading } = useQuery({
    queryKey: ['virtual-tour', slug],
    queryFn: async () => {
      // Tur bilgilerini çek
      const { data: tour, error: tourError } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'yayinda')
        .eq('visible', true)
        .single();

      if (tourError) throw tourError;
      if (!tour) throw new Error('Tur bulunamadı');

      // Panorama görsellerini çek
      const { data: panoramas, error: panoramaError } = await supabase
        .from('tour_panoramas')
        .select(`
          *,
          hotspots:tour_hotspots(*)
        `)
        .eq('tour_id', tour.id)
        .order('sort_order');

      if (panoramaError) throw panoramaError;

      return {
        ...tour,
        panoramas: panoramas || []
      };
    }
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="arch-container py-12">
          <div className="w-full aspect-[16/9] bg-gray-100 animate-pulse rounded-lg" />
        </div>
      </Layout>
    );
  }

  if (!tourData || !tourData.panoramas?.length) {
    return (
      <Layout>
        <div className="arch-container py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Tur Bulunamadı</h1>
            <p className="text-gray-600">Bu sanal tur mevcut değil veya kaldırılmış olabilir.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="arch-container py-6">
        <h1 className="text-3xl font-bold mb-6">{tourData.title}</h1>
        {tourData.description && (
          <p className="text-gray-600 mb-6">{tourData.description}</p>
        )}
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4">
        <VirtualTourViewer 
          panoramas={tourData.panoramas}
          initialPanorama={tourData.panoramas[0]}
        />
      </div>
    </Layout>
  );
};

export default VirtualTourDetail;
