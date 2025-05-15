
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Project3DModel } from '@/types/project';

interface FabUrlFormProps {
  projectId: string | undefined;
  isEditing: boolean;
  onModelAdded: (model: Project3DModel) => void;
}

const FabUrlForm: React.FC<FabUrlFormProps> = ({ projectId, isEditing, onModelAdded }) => {
  const [modelUrl, setModelUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }

    if (!modelUrl.startsWith('https://fab.com/')) {
      toast.error('Geçerli bir Fab.com URL\'si giriniz');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('project_3d_models')
        .insert({
          project_id: projectId,
          model_url: modelUrl,
          model_type: '3d_model'
        })
        .select('*')
        .single();

      if (error) throw error;

      // Tip güvenliğini sağlamak için model_type'ı açıkça dönüştürüyoruz
      const newModel: Project3DModel = {
        ...data,
        model_type: data.model_type as "3d_model" | "point_cloud"
      };
      
      onModelAdded(newModel);
      setModelUrl('');
      toast.success('Model başarıyla eklendi');
    } catch (error) {
      console.error('Model eklenirken hata:', error);
      toast.error('Model eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">Fab.com Model URL'si Ekle</h3>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="url"
          value={modelUrl}
          onChange={(e) => setModelUrl(e.target.value)}
          placeholder="https://fab.com/s/your-model-id"
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !modelUrl}
          className="whitespace-nowrap"
        >
          URL Ekle
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-2">
        * Sadece Fab.com URL'leri desteklenmektedir
      </p>
    </>
  );
};

export default FabUrlForm;
