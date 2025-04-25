
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
    .from('panorama_scenes')
    .insert([scene]);

  if (error) throw error;
  return data;
};

export const fetchAllScenes = async () => {
  const { data, error } = await supabase
    .from('panorama_scenes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const deleteScene = async (id: string) => {
  const { error } = await supabase
    .from('panorama_scenes')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
};

export const updateScene = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('panorama_scenes')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
};
