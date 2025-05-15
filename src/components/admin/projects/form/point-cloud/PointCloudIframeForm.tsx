
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Code } from 'lucide-react';

interface PointCloudIframeFormProps {
  projectId: string | undefined;
  isEditing: boolean;
  onPointCloudAdded: () => void;
}

const PointCloudIframeForm: React.FC<PointCloudIframeFormProps> = ({
  projectId,
  isEditing,
  onPointCloudAdded
}) => {
  const [iframeCode, setIframeCode] = useState('');

  const addPointCloudToDatabase = async (code: string) => {
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
            model_url: code.trim(),
            model_type: 'point_cloud'
          }
        ])
        .select();
        
      if (error) throw error;
      
      toast.success('Nokta bulutu başarıyla eklendi');
      onPointCloudAdded();
      return true;
    } catch (error) {
      console.error('iframe kodu işlenirken hata:', error);
      toast.error('Nokta bulutu iframe kodu eklenirken hata oluştu.');
      return false;
    }
  }

  const handleAddIframeCode = async () => {
    if (!iframeCode.trim()) {
      toast.error('Lütfen geçerli bir iframe kodu girin');
      return;
    }
    
    try {
      const srcMatch = iframeCode.match(/src="([^"]+)"/);
      if (!srcMatch || !srcMatch[1]) {
        throw new Error("Geçersiz iframe kodu");
      }
      
      const iframeSrc = srcMatch[1];
      new URL(iframeSrc); // URL formatını kontrol et
      
      const success = await addPointCloudToDatabase(iframeCode);
      if (success) {
        setIframeCode('');
      }
    } catch (error) {
      console.error('iframe kodu işlenirken hata:', error);
      toast.error('Geçersiz iframe kodu. Lütfen geçerli bir iframe kodu girdiğinizden emin olun.');
    }
  };

  return (
    <div className="space-y-2">
      <Textarea 
        placeholder='<iframe src="https://cloud.agisoft.com/embedded/projects/..." ...'
        value={iframeCode}
        onChange={(e) => setIframeCode(e.target.value)}
        rows={4}
      />
      <Button onClick={handleAddIframeCode} className="w-full">
        <Code className="h-4 w-4 mr-2" /> iframe Kodu Ekle
      </Button>
    </div>
  );
};

export default PointCloudIframeForm;
