
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminDashboard } from '../components/admin/AdminDashboard';

const Admin = () => {
  const [projectCount, setProjectCount] = useState(0);
  const [featuredCount, setFeaturedCount] = useState(0);
  const [visitorCount, setVisitorCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Proje sayısını çek
        const { data: projectsData, error: projectError } = await supabase
          .from('projects')
          .select('id');
        
        if (projectError) throw projectError;
        setProjectCount(projectsData ? projectsData.length : 0);

        // Öne çıkan projeleri çek
        const { data: featuredData, error: featuredError } = await supabase
          .from('projects')
          .select('id')
          .eq('status', 'yayinda')
          .eq('visible', true);
        
        if (featuredError) throw featuredError;
        setFeaturedCount(featuredData ? featuredData.length : 0);

        // Son projeleri çek
        const { data: recentData, error: recentError } = await supabase
          .from('projects')
          .select('id, title, created_at, status')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (recentError) throw recentError;
        setRecentProjects(recentData || []);

        // Şimdilik ziyaretçi ve mesaj sayısı için örnek değerler
        setVisitorCount(0);
        setMessageCount(0);
      } catch (error) {
        console.error("Dashboard veri yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Üst Menü */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Siteye Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Dashboard</h1>
          </div>
          
          <div>
            <button className="flex items-center text-gray-600 hover:text-arch-black">
              <span className="text-sm mr-2">Çıkış Yap</span>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          <AdminDashboard 
            projectCount={projectCount}
            featuredCount={featuredCount}
            visitorCount={visitorCount}
            messageCount={messageCount}
            recentProjects={recentProjects}
            loading={loading}
          />
        </main>
      </div>
    </div>
  );
};

export default Admin;
