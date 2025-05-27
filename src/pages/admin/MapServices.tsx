
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/header/AdminHeader';
import MapServiceForm from '@/components/admin/map-services/MapServiceForm';
import MapServicesList from '@/components/admin/map-services/MapServicesList';
import { mapServicesApi } from '@/api/mapServicesApi';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const MapServices = () => {
  const [services, setServices] = useState<MapService[]>([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<MapService | null>(null);

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

  const handleSubmit = async (data: CreateMapServiceRequest) => {
    try {
      setFormLoading(true);
      
      if (editingService) {
        const updated = await mapServicesApi.updateMapService(editingService.id, data);
        setServices(services.map(s => s.id === editingService.id ? updated : s));
        toast.success('Harita servisi güncellendi');
      } else {
        const newService = await mapServicesApi.createMapService(data);
        setServices([newService, ...services]);
        toast.success('Harita servisi eklendi');
      }
      
      handleCloseForm();
    } catch (error) {
      console.error('Harita servisi kaydedilirken hata:', error);
      toast.error('Harita servisi kaydedilemedi');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (service: MapService) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await mapServicesApi.deleteMapService(id);
      setServices(services.filter(s => s.id !== id));
      toast.success('Harita servisi silindi');
    } catch (error) {
      console.error('Harita servisi silinirken hata:', error);
      toast.error('Harita servisi silinemedi');
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const updated = await mapServicesApi.toggleVisibility(id, visible);
      setServices(services.map(s => s.id === id ? updated : s));
      toast.success(`Harita servisi ${visible ? 'görünür' : 'gizli'} yapıldı`);
    } catch (error) {
      console.error('Görünürlük değiştirilirken hata:', error);
      toast.error('Görünürlük değiştirilemedi');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader title="Harita Servisleri" />
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>GeoServer Harita Servisleri</CardTitle>
                  <Button onClick={() => setShowForm(true)}>
                    <Plus size={16} className="mr-1" />
                    Yeni Servis Ekle
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <MapServicesList
                  services={services}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleVisibility={handleToggleVisibility}
                  loading={loading}
                />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      <Dialog open={showForm} onOpenChange={handleCloseForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Harita Servisini Düzenle' : 'Yeni Harita Servisi Ekle'}
            </DialogTitle>
          </DialogHeader>
          <MapServiceForm
            service={editingService || undefined}
            onSubmit={handleSubmit}
            onCancel={handleCloseForm}
            loading={formLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapServices;
