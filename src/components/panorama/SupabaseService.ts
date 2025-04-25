
import { supabase } from "@/integrations/supabase/client";

export const uploadPanoramaImage = async (file: File) => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data, error } = await supabase
    .storage
    .from('panoramas')
    .upload(`public/${fileName}`, file, { upsert: true });

  if (error) throw error;
  
  const { data: publicUrlData } = supabase
    .storage
    .from('panoramas')
    .getPublicUrl(`public/${fileName}`);
    
  return { path: data.path, publicUrl: publicUrlData.publicUrl };
};

export const addSceneRecord = async (scene: any) => {
  const { data, error } = await supabase
    .from('tour_panoramas')
    .insert([{
      title: scene.name,
      image_url: scene.imageUrl,
      initial_view: {
        yaw: scene.initialYaw || 0,
        pitch: scene.initialPitch || 0,
        fov: scene.initialFov || 90
      },
      tour_id: scene.tourId || '00000000-0000-0000-0000-000000000000' // Geçici bir ID
    }]);

  if (error) throw error;
  return data;
};

export const fetchAllScenes = async () => {
  const { data, error } = await supabase
    .from('tour_panoramas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteScene = async (id: string) => {
  const { error } = await supabase
    .from('tour_panoramas')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const updateScene = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('tour_panoramas')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
};
