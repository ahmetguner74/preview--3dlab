
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import VirtualTourViewer from '@/components/virtual-tour/VirtualTourViewer';
import { Panorama, InitialView, Position } from '@/types/virtual-tour';

const VirtualTourDetail = () => {
  const { slug } = useParams();

  const { data: tourData, isLoading } = useQuery({
    queryKey: ['virtual-tour', slug],
    queryFn: async () => {
      const { data: tour, error: tourError } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'yayinda')
        .eq('visible', true)
        .single();

      if (tourError) throw tourError;
      if (!tour) throw new Error('Tur bulunamadı');

      const { data: panoramas, error: panoramaError } = await supabase
        .from('tour_panoramas')
        .select(`
          *,
          hotspots:tour_hotspots(*)
        `)
        .eq('tour_id', tour.id)
        .order('sort_order');

      if (panoramaError) throw panoramaError;

      // Veriyi doğru formata dönüştür
      const formattedPanoramas: Panorama[] = panoramas?.map(p => {
        // JSON verisini düzgün şekilde parse et
        let initialViewData = typeof p.initial_view === 'string' 
          ? JSON.parse(p.initial_view)
          : p.initial_view;

        const initialView: InitialView = {
          yaw: initialViewData?.yaw || 0,
          pitch: initialViewData?.pitch || 0,
          fov: initialViewData?.fov || 90
        };

        return {
          id: p.id,
          title: p.title,
          image_url: p.image_url,
          initial_view: initialView,
          sort_order: p.sort_order,
          hotspots: p.hotspots?.map(h => {
            // JSON verisini düzgün şekilde parse et
            let positionData = typeof h.position === 'string'
              ? JSON.parse(h.position)
              : h.position;

            const position: Position = {
              yaw: positionData?.yaw || 0,
              pitch: positionData?.pitch || 0
            };

            return {
              id: h.id,
              title: h.title,
              description: h.description,
              position: position,
              target_panorama_id: h.target_panorama_id,
              hotspot_type: h.hotspot_type as 'info' | 'link' | 'custom',
              custom_data: h.custom_data
            };
          }) || []
        };
      }) || [];

      return {
        ...tour,
        panoramas: formattedPanoramas
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
        <h1 className="text-3xl font-bold mb-6">{tourData?.title}</h1>
        {tourData?.description && (
          <p className="text-gray-600 mb-6">{tourData.description}</p>
        )}
      </div>

      <div className="w-full max-w-[1920px] mx-auto px-4">
        {tourData?.panoramas?.length ? (
          <VirtualTourViewer 
            panoramas={tourData.panoramas}
            initialPanorama={tourData.panoramas[0]}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Bu turda henüz panorama bulunmuyor.</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VirtualTourDetail;
