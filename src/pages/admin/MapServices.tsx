
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/header/AdminHeader';
import MapServicesList from '@/components/admin/map-services/MapServicesList';
import MapServiceForm from '@/components/admin/map-services/MapServiceForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mapServicesApi } from '@/api/mapServicesApi';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const MapServices = () => {
  const [services, setServices] = useState<MapService[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<MapService | undefined>();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await mapServicesApi.getMapServices();
      setServices(data);
    } catch (error) {
      console.error('Harita servisleri yüklenirken hata:', error);
      toast.error('Harita servisleri yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
    toast.success('Veriler güncellendi');
  };

  const handleSubmit = async (data: CreateMapServiceRequest) => {
    try {
      if (editingService) {
        await mapServicesApi.updateMapService(editingService.id, data);
        toast.success('Harita servisi güncellendi');
      } else {
        await mapServicesApi.createMapService(data);
        toast.success('Yeni harita servisi eklendi');
      }
      
      setShowForm(false);
      setEditingService(undefined);
      await fetchServices();
    } catch (error) {
      console.error('Harita servisi kaydedilirken hata:', error);
      toast.error('Harita servisi kaydedilemedi');
    }
  };

  const handleEdit = (service: MapService) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await mapServicesApi.deleteMapService(id);
      toast.success('Harita servisi silindi');
      await fetchServices();
    } catch (error) {
      console.error('Harita servisi silinirken hata:', error);
      toast.error('Harita servisi silinemedi');
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      await mapServicesApi.toggleVisibility(id, visible);
      toast.success(`Harita servisi ${visible ? 'gösterilecek' : 'gizlenecek'}`);
      await fetchServices();
    } catch (error) {
      console.error('Görünürlük değiştirilirken hata:', error);
      toast.error('Görünürlük değiştirilemedi');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingService(undefined);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader 
          title="Harita Servisleri" 
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {!showForm ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold">Harita Servisleri</h1>
                    <p className="text-gray-600">GeoServer WMS ve WFS servislerinizi yönetin</p>
                  </div>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus size={16} className="mr-2" />
                    Yeni Servis Ekle
                  </Button>
                </div>

                <MapServicesList
                  services={services}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                  loading={loading}
                />
              </>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {editingService ? 'Harita Servisini Düzenle' : 'Yeni Harita Servisi Ekle'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <MapServiceForm
                    service={editingService}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MapServices;
