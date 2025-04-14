
import React from 'react';
import Layout from '../components/layout/Layout';
import { Settings } from 'lucide-react';

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
            <h2 className="text-xl font-medium mb-4">Proje Yönetimi</h2>
            <p className="text-arch-gray mb-4">Mevcut projeleri görüntüleyin, düzenleyin veya silin.</p>
            <button className="w-full bg-arch-black text-white py-2 rounded-md hover:bg-arch-gray transition-colors">
              Projeleri Yönet
            </button>
          </div>

          {/* Dosya Yönetimi */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Dosya Yönetimi</h2>
            <p className="text-arch-gray mb-4">Proje dosyalarını yükleyin ve organize edin.</p>
            <button className="w-full bg-arch-black text-white py-2 rounded-md hover:bg-arch-gray transition-colors">
              Dosyaları Yönet
            </button>
          </div>

          {/* Kullanıcı Yönetimi */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4">Kullanıcı Yönetimi</h2>
            <p className="text-arch-gray mb-4">Kullanıcı hesaplarını ve izinlerini kontrol edin.</p>
            <button className="w-full bg-arch-black text-white py-2 rounded-md hover:bg-arch-gray transition-colors">
              Kullanıcıları Yönet
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Admin;
