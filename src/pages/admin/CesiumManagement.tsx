
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CesiumProject, CesiumLayer } from '@/types/cesium';
import { toast } from "sonner";
import AdminSidebar from '@/components/admin/AdminSidebar';
import { ArrowLeftCircle, LogOut, Plus, Globe, Layers, Eye, EyeOff, Trash2, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const CesiumManagement = () => {
  const [projects, setProjects] = useState<CesiumProject[]>([]);
  const [layers, setLayers] = useState<CesiumLayer[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchLayers(selectedProjectId);
    } else {
      setLayers([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cesium_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Cesium projeleri yüklenirken hata:', error);
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const fetchLayers = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('cesium_layers')
        .select('*')
        .eq('project_id', projectId)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setLayers(data || []);
    } catch (error) {
      console.error('Cesium katmanları yüklenirken hata:', error);
      toast.error('Katmanlar yüklenirken bir hata oluştu');
    }
  };

  const toggleProjectVisibility = async (project: CesiumProject) => {
    try {
      const { error } = await supabase
        .from('cesium_projects')
        .update({ visible: !project.visible })
        .eq('id', project.id);

      if (error) throw error;
      
      setProjects(projects.map(p => 
        p.id === project.id ? { ...p, visible: !p.visible } : p
      ));
      
      toast.success(project.visible 
        ? 'Proje gizlendi' 
        : 'Proje görünür yapıldı');
    } catch (error) {
      console.error('Proje durumu değiştirilirken hata:', error);
      toast.error('Proje durumu değiştirilemedi');
    }
  };

  const toggleLayerVisibility = async (layer: CesiumLayer) => {
    try {
      const { error } = await supabase
        .from('cesium_layers')
        .update({ visible: !layer.visible })
        .eq('id', layer.id);

      if (error) throw error;
      
      setLayers(layers.map(l => 
        l.id === layer.id ? { ...l, visible: !l.visible } : l
      ));
      
      toast.success(layer.visible 
        ? 'Katman gizlendi' 
        : 'Katman görünür yapıldı');
    } catch (error) {
      console.error('Katman durumu değiştirilirken hata:', error);
      toast.error('Katman durumu değiştirilemedi');
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm('Bu projeyi silmek istediğinizden emin misiniz? Tüm katmanları da silinecek.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('cesium_projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProjects(projects.filter(p => p.id !== id));
      if (selectedProjectId === id) {
        setSelectedProjectId(undefined);
      }
      toast.success('Proje başarıyla silindi');
    } catch (error) {
      console.error('Proje silinirken hata:', error);
      toast.error('Proje silinemedi');
    }
  };

  const deleteLayer = async (id: string) => {
    if (!window.confirm('Bu katmanı silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('cesium_layers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setLayers(layers.filter(l => l.id !== id));
      toast.success('Katman başarıyla silindi');
    } catch (error) {
      console.error('Katman silinirken hata:', error);
      toast.error('Katman silinemedi');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yayinda':
        return <Badge className="bg-green-500">Yayında</Badge>;
      case 'taslak':
        return <Badge variant="secondary">Taslak</Badge>;
      case 'arsiv':
        return <Badge variant="outline">Arşiv</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getLayerTypeBadge = (type: string) => {
    const typeMap = {
      pointcloud: { label: 'Nokta Bulutu', color: 'bg-blue-500' },
      mesh: { label: '3D Mesh', color: 'bg-purple-500' },
      tileset: { label: '3D Tiles', color: 'bg-indigo-500' },
      ortho: { label: 'Ortofoto', color: 'bg-green-500' },
      dem: { label: 'DEM', color: 'bg-orange-500' },
      vector: { label: 'Vektör', color: 'bg-red-500' }
    };
    
    const typeInfo = typeMap[type as keyof typeof typeMap] || { label: type, color: 'bg-gray-500' };
    return <Badge className={typeInfo.color}>{typeInfo.label}</Badge>;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Siteye Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Cesium Yönetimi</h1>
          </div>
          
          <div>
            <button className="flex items-center text-gray-600 hover:text-arch-black">
              <span className="text-sm mr-2">Çıkış Yap</span>
              <LogOut size={18} />
            </button>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Projeler Kartı */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Globe size={20} />
                  Cesium Projeleri
                </CardTitle>
                <Button className="flex items-center gap-2">
                  <Plus size={16} />
                  Yeni Proje
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Proje Adı</TableHead>
                    <TableHead>Durum</TableHead>
                    <TableHead>Görünürlük</TableHead>
                    <TableHead>Oluşturulma</TableHead>
                    <TableHead className="text-right">İşlemler</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow 
                      key={project.id}
                      className={selectedProjectId === project.id ? 'bg-blue-50' : ''}
                    >
                      <TableCell>
                        <div 
                          className="cursor-pointer hover:text-blue-600"
                          onClick={() => setSelectedProjectId(project.id)}
                        >
                          <div className="font-medium">{project.title}</div>
                          {project.description && (
                            <div className="text-sm text-gray-500">{project.description}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(project.status)}</TableCell>
                      <TableCell>
                        <Switch
                          checked={project.visible}
                          onCheckedChange={() => toggleProjectVisibility(project)}
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(project.created_at).toLocaleDateString('tr-TR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm">
                            <Edit size={14} />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => deleteProject(project.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {projects.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  <Globe size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Henüz Cesium projesi eklenmemiş</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Katmanlar Kartı */}
          {selectedProjectId && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Layers size={20} />
                    Proje Katmanları
                  </CardTitle>
                  <Button className="flex items-center gap-2">
                    <Plus size={16} />
                    Yeni Katman
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Katman Adı</TableHead>
                      <TableHead>Tür</TableHead>
                      <TableHead>Görünürlük</TableHead>
                      <TableHead>Şeffaflık</TableHead>
                      <TableHead>Veri URL</TableHead>
                      <TableHead className="text-right">İşlemler</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {layers.map((layer) => (
                      <TableRow key={layer.id}>
                        <TableCell>
                          <div className="font-medium">{layer.name}</div>
                        </TableCell>
                        <TableCell>{getLayerTypeBadge(layer.layer_type)}</TableCell>
                        <TableCell>
                          <Switch
                            checked={layer.visible}
                            onCheckedChange={() => toggleLayerVisibility(layer)}
                          />
                        </TableCell>
                        <TableCell>{Math.round(layer.opacity * 100)}%</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate text-sm text-gray-500">
                            {layer.data_url}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              <Edit size={14} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteLayer(layer.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {layers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Layers size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Bu proje için henüz katman eklenmemiş</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

export default CesiumManagement;
