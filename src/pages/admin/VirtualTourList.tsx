
import React, { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface VirtualTour {
  id: string;
  title: string;
  description: string | null;
  status: string;
  thumbnail: string | null;
  visible: boolean;
  created_at: string;
}

const VirtualTourList = () => {
  const [tours, setTours] = useState<VirtualTour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('virtual_tours')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      console.error('Turlar yüklenirken hata:', error);
      toast.error('Turlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (tour: VirtualTour) => {
    try {
      const { error } = await supabase
        .from('virtual_tours')
        .update({ visible: !tour.visible })
        .eq('id', tour.id);

      if (error) throw error;
      
      setTours(tours.map(t => 
        t.id === tour.id ? { ...t, visible: !t.visible } : t
      ));
      
      toast.success(tour.visible 
        ? 'Tur gizlendi' 
        : 'Tur görünür yapıldı');
    } catch (error) {
      console.error('Tur durumu değiştirilirken hata:', error);
      toast.error('Tur durumu değiştirilemedi');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Sanal Turlar</h1>
            <Link to="/admin/virtual-tours/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Yeni Tur
              </Button>
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left">Başlık</th>
                    <th className="px-6 py-3 text-left">Durum</th>
                    <th className="px-6 py-3 text-left">Görünürlük</th>
                    <th className="px-6 py-3 text-left">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        Yükleniyor...
                      </td>
                    </tr>
                  ) : tours.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center">
                        Henüz sanal tur eklenmemiş
                      </td>
                    </tr>
                  ) : (
                    tours.map((tour) => (
                      <tr key={tour.id} className="border-b">
                        <td className="px-6 py-4">{tour.title}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tour.status === 'yayinda' 
                              ? 'bg-green-100 text-green-800'
                              : tour.status === 'arsiv'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {tour.status === 'yayinda' 
                              ? 'Yayında' 
                              : tour.status === 'arsiv'
                              ? 'Arşiv'
                              : 'Taslak'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <Button
                            variant="ghost"
                            onClick={() => toggleVisibility(tour)}
                          >
                            {tour.visible ? 'Görünür' : 'Gizli'}
                          </Button>
                        </td>
                        <td className="px-6 py-4">
                          <Link 
                            to={`/admin/virtual-tours/${tour.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Düzenle
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default VirtualTourList;
