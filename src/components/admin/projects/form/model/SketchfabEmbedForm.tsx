
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { Project3DModel } from '@/types/project';
import { Info } from 'lucide-react';

interface SketchfabEmbedFormProps {
  projectId: string | undefined;
  isEditing: boolean;
  onModelAdded: (model: Project3DModel) => void;
}

const SketchfabEmbedForm: React.FC<SketchfabEmbedFormProps> = ({ 
  projectId, 
  isEditing,
  onModelAdded
}) => {
  const [embedCode, setEmbedCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }

    if (!embedCode.includes('<iframe') || !embedCode.includes('sketchfab.com')) {
      toast.error('Geçerli bir Sketchfab embed kodu giriniz');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('project_3d_models')
        .insert({
          project_id: projectId,
          model_url: embedCode,
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
      setEmbedCode('');
      toast.success('Sketchfab modeli başarıyla eklendi');
    } catch (error) {
      console.error('Sketchfab modeli eklenirken hata:', error);
      toast.error('Sketchfab modeli eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h3 className="text-sm font-medium mb-2">Sketchfab Embed Kodu Ekle</h3>
      <form onSubmit={handleSubmit}>
        <Textarea
          value={embedCode}
          onChange={(e) => setEmbedCode(e.target.value)}
          placeholder='<div class="sketchfab-embed-wrapper"><iframe title="Model" src="https://sketchfab.com/models/..."></iframe></div>'
          className="h-32 mb-2"
        />
        <Button 
          type="submit" 
          disabled={isSubmitting || !embedCode}
          className="w-full"
        >
          Sketchfab Modeli Ekle
        </Button>
      </form>
      <div className="flex items-center gap-2 bg-blue-50 p-2 rounded mt-2">
        <Info size={16} className="text-blue-500" />
        <p className="text-xs text-blue-700">
          Sketchfab'den "Embed" seçeneğini kullanarak aldığınız kodu buraya yapıştırın.
        </p>
      </div>
    </>
  );
};

export default SketchfabEmbedForm;
