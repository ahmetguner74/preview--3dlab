
import { supabase } from '@/integrations/supabase/client';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';

export const mapServicesApi = {
  // Tüm harita servislerini getir
  async getMapServices(): Promise<MapService[]> {
    const { data, error } = await supabase
      .from('map_services')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Görünür harita servislerini getir
  async getVisibleMapServices(): Promise<MapService[]> {
    const { data, error } = await supabase
      .from('map_services')
      .select('*')
      .eq('visible', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Yeni harita servisi oluştur
  async createMapService(service: CreateMapServiceRequest): Promise<MapService> {
    const { data, error } = await supabase
      .from('map_services')
      .insert([service])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Harita servisini güncelle
  async updateMapService(id: string, updates: Partial<CreateMapServiceRequest>): Promise<MapService> {
    const { data, error } = await supabase
      .from('map_services')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Harita servisini sil
  async deleteMapService(id: string): Promise<void> {
    const { error } = await supabase
      .from('map_services')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Görünürlüğü değiştir
  async toggleVisibility(id: string, visible: boolean): Promise<MapService> {
    const { data, error } = await supabase
      .from('map_services')
      .update({ visible, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
