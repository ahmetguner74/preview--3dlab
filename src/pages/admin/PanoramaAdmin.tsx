
import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/header/AdminHeader';
import AdminDashboard from "@/components/panorama/AdminDashboard";

const PanoramaAdmin = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Panorama Yönetimi" />
        <main className="flex-1 p-4">
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default PanoramaAdmin;
