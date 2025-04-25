
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import TourCard from '@/components/virtual-tour/TourCard';

const VirtualTours = () => {
  const { data: tours, isLoading } = useQuery({
    queryKey: ['virtual-tours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .eq('visible', true)
        .eq('status', 'yayinda');
      
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="arch-container py-12">
        <h1 className="text-3xl font-bold mb-8">Sanal Turlar</h1>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[16/9] bg-gray-100 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours?.map((tour) => (
              <TourCard
                key={tour.id}
                id={tour.id}
                title={tour.title}
                description={tour.description}
                thumbnail={tour.thumbnail}
                slug={tour.slug}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VirtualTours;
