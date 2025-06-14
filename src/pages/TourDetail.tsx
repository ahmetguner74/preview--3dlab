
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const TourDetail = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Sanal Tur: {slug}</h1>
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <p className="text-gray-600">Sanal tur özelliği henüz aktif değil.</p>
        </div>
      </div>
    </Layout>
  );
};

export default TourDetail;
