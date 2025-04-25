
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface HotspotManagerProps {
  panoramaId: string;
  position?: { yaw: number; pitch: number };
}

const HotspotManager: React.FC<HotspotManagerProps> = ({ panoramaId, position }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'info' | 'link'>('info');
  const [targetPanorama, setTargetPanorama] = useState<string>('');

  const { data: otherPanoramas } = useQuery({
    queryKey: ['panoramas-for-links', panoramaId],
    queryFn: async () => {
      const { data: panorama } = await supabase
        .from('tour_panoramas')
        .select('tour_id')
        .eq('id', panoramaId)
        .single();

      if (!panorama) throw new Error('Panorama bulunamadı');

      const { data, error } = await supabase
        .from('tour_panoramas')
        .select('*')
        .eq('tour_id', panorama.tour_id)
        .neq('id', panoramaId);

      if (error) throw error;
      return data;
    },
    enabled: !!panoramaId
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!position) {
      toast.error('Hotspot pozisyonu belirlenmedi');
      return;
    }

    try {
      const { error } = await supabase
        .from('tour_hotspots')
        .insert({
          panorama_id: panoramaId,
          title,
          description,
          position,
          hotspot_type: type,
          target_panorama_id: type === 'link' ? targetPanorama : null
        });

      if (error) throw error;

      toast.success('Hotspot başarıyla eklendi');
      setTitle('');
      setDescription('');
      setType('info');
      setTargetPanorama('');
    } catch (error) {
      console.error('Hotspot eklenirken hata:', error);
      toast.error('Hotspot eklenemedi');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Hotspot başlığı"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Açıklama</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Hotspot açıklaması"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Tür</label>
        <Select value={type} onValueChange={(value: 'info' | 'link') => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Hotspot türü seçin" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Bilgi</SelectItem>
            <SelectItem value="link">Bağlantı</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {type === 'link' && (
        <div>
          <label className="block text-sm font-medium mb-1">Hedef Panorama</label>
          <Select value={targetPanorama} onValueChange={setTargetPanorama}>
            <SelectTrigger>
              <SelectValue placeholder="Hedef panorama seçin" />
            </SelectTrigger>
            <SelectContent>
              {otherPanoramas?.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button type="submit">
        Hotspot Ekle
      </Button>
    </form>
  );
};

export default HotspotManager;
