
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface PointCloudUrlFormProps {
  projectId: string | undefined;
  isEditing: boolean;
  onPointCloudAdded: () => void;
}

const PointCloudUrlForm: React.FC<PointCloudUrlFormProps> = ({
  projectId,
  isEditing,
  onPointCloudAdded
}) => {
  const [pointCloudUrl, setPointCloudUrl] = useState('');

  const addPointCloudToDatabase = async (url: string) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('project_3d_models')
        .insert([
          {
            project_id: projectId,
            model_url: url.trim(),
            model_type: 'point_cloud'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Nokta bulutu başarıyla eklendi');
      onPointCloudAdded();
      return true;
    } catch (error) {
      console.error('Nokta bulutu URL eklenirken hata:', error);
      toast.error('Nokta bulutu URL eklenirken hata oluştu. Lütfen geçerli bir URL girdiğinizden emin olun.');
      return false;
    }
  }

  const handleAddPointCloudUrl = async () => {
    if (!pointCloudUrl.trim()) {
      toast.error('Lütfen geçerli bir URL girin');
      return;
    }
    
    try {
      new URL(pointCloudUrl); // URL formatını kontrol et
      
      const success = await addPointCloudToDatabase(pointCloudUrl);
      if (success) {
        setPointCloudUrl('');
      }
    } catch (error) {
      console.error('Nokta bulutu URL eklenirken hata:', error);
      toast.error('Geçersiz URL formatı. Lütfen geçerli bir URL girdiğinizden emin olun.');
    }
  };

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="https://potree.github.io/potree/examples/..." 
        value={pointCloudUrl}
        onChange={(e) => setPointCloudUrl(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleAddPointCloudUrl}>Ekle</Button>
    </div>
  );
};

export default PointCloudUrlForm;
