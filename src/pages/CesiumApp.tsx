
import React from 'react';
import Layout from '@/components/layout/Layout';
import CesiumViewer from '@/components/cesium/CesiumViewer';

const CesiumApp: React.FC = () => {
  return (
    <Layout>
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <CesiumViewer className="w-full h-full" />
      </div>
    </Layout>
  );
};

export default CesiumApp;
