
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CesiumProject, CesiumLayer } from '@/types/cesium';
import { toast } from 'sonner';

export const useCesiumProjects = () => {
  const [projects, setProjects] = useState<CesiumProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('cesium_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      // Type casting yaparak Supabase'den gelen string değerleri doğru type'lara çeviriyoruz
      setProjects(data?.map(project => ({
        ...project,
        status: project.status as 'taslak' | 'yayinda' | 'arsiv'
      })) || []);
    } catch (error) {
      console.error('Cesium projeleri yüklenirken hata:', error);
      toast.error('Projeler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, refetch: fetchProjects };
};

export const useCesiumLayers = (projectId?: string) => {
  const [layers, setLayers] = useState<CesiumLayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLayers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('cesium_layers')
        .select('*')
        .order('sort_order', { ascending: true });

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query;

      if (error) throw error;
      // Type casting yaparak Supabase'den gelen string değerleri doğru type'lara çeviriyoruz
      setLayers(data?.map(layer => ({
        ...layer,
        layer_type: layer.layer_type as 'pointcloud' | 'mesh' | 'ortho' | 'dem' | 'vector' | 'tileset',
        metadata: (layer.metadata as Record<string, any>) || {},
        style_config: (layer.style_config as Record<string, any>) || {}
      })) || []);
    } catch (error) {
      console.error('Cesium katmanları yüklenirken hata:', error);
      toast.error('Katmanlar yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLayers();
  }, [projectId]);

  const toggleLayerVisibility = async (layerId: string, visible: boolean) => {
    try {
      const { error } = await supabase
        .from('cesium_layers')
        .update({ visible })
        .eq('id', layerId);

      if (error) throw error;
      
      setLayers(layers.map(layer => 
        layer.id === layerId ? { ...layer, visible } : layer
      ));
    } catch (error) {
      console.error('Katman görünürlüğü değiştirilirken hata:', error);
      toast.error('Katman durumu değiştirilemedi');
    }
  };

  const updateLayerOpacity = async (layerId: string, opacity: number) => {
    try {
      const { error } = await supabase
        .from('cesium_layers')
        .update({ opacity })
        .eq('id', layerId);

      if (error) throw error;
      
      setLayers(layers.map(layer => 
        layer.id === layerId ? { ...layer, opacity } : layer
      ));
    } catch (error) {
      console.error('Katman şeffaflığı değiştirilirken hata:', error);
      toast.error('Katman şeffaflığı değiştirilemedi');
    }
  };

  return { 
    layers, 
    loading, 
    refetch: fetchLayers,
    toggleLayerVisibility,
    updateLayerOpacity
  };
};
