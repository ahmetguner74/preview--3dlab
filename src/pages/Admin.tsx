
import React from 'react';
import Layout from '../components/layout/Layout';
import { Link } from 'react-router-dom';
import { Settings, Layers, FileImage, Video, Package, Box3D } from 'lucide-react';

const Admin = () => {
  return (
    <Layout>
      <div className="arch-container py-24">
        <div className="flex items-center mb-12">
          <Settings size={40} className="mr-4 text-arch-black" />
          <h1 className="text-4xl font-display">Admin Paneli</h1>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Proje Yönetimi */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Layers size={24} className="text-arch-black mr-3" />
              <h2 className="text-xl font-medium">Proje Yönetimi</h2>
            </div>
            <p className="text-arch-gray mb-4">Mevcut projeleri görüntüleyin, düzenleyin veya silin.</p>
            <Link to="/admin/projects" className="w-full bg-arch-black text-white py-2 px-4 rounded-md hover:bg-arch-gray transition-colors flex items-center justify-center">
              <span>Projeleri Yönet</span>
            </Link>
          </div>

          {/* Dosya Yönetimi */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <FileImage size={24} className="text-arch-black mr-3" />
              <h2 className="text-xl font-medium">Görsel Yönetimi</h2>
            </div>
            <p className="text-arch-gray mb-4">Proje görsellerini yükleyin, düzenleyin ve organize edin.</p>
            <Link to="/admin/images" className="w-full bg-arch-black text-white py-2 px-4 rounded-md hover:bg-arch-gray transition-colors flex items-center justify-center">
              <span>Görselleri Yönet</span>
            </Link>
          </div>

          {/* Video Yönetimi */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Video size={24} className="text-arch-black mr-3" />
              <h2 className="text-xl font-medium">Video Yönetimi</h2>
            </div>
            <p className="text-arch-gray mb-4">Proje videolarını yükleyin ve düzenleyin.</p>
            <Link to="/admin/videos" className="w-full bg-arch-black text-white py-2 px-4 rounded-md hover:bg-arch-gray transition-colors flex items-center justify-center">
              <span>Videoları Yönet</span>
            </Link>
          </div>

          {/* Nokta Bulutu */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Package size={24} className="text-arch-black mr-3" />
              <h2 className="text-xl font-medium">Nokta Bulutu</h2>
            </div>
            <p className="text-arch-gray mb-4">Nokta bulutu verilerini yönetin ve projeye ekleyin.</p>
            <Link to="/admin/pointcloud" className="w-full bg-arch-black text-white py-2 px-4 rounded-md hover:bg-arch-gray transition-colors flex items-center justify-center">
              <span>Nokta Bulutu Yönet</span>
            </Link>
          </div>

          {/* 3D Model */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
              <Box3D size={24} className="text-arch-black mr-3" />
              <h2 className="text-xl font-medium">3D Model</h2>
            </div>
            <p className="text-arch-gray mb-4">3D modelleri yükleyin ve projelere ekleyin.</p>
            <Link to="/admin/3d-models" className="w-full bg-arch-black text-white py-2 px-4 rounded-md hover:bg-arch-gray transition-colors flex items-center justify-center">
              <span>3D Modelleri Yönet</span>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
