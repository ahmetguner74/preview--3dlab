import React, { useState } from 'react';
import { Cloud, X, Info, Link, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Project3DModel } from '@/types/project';
import { upload3DModel } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PointCloudTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  project3DModels: Project3DModel[];
  setProject3DModels: React.Dispatch<React.SetStateAction<Project3DModel[]>>;
}

const PointCloudTab: React.FC<PointCloudTabProps> = ({
  projectId,
  isEditing,
  project3DModels,
  setProject3DModels
}) => {
  const [pointCloudUrl, setPointCloudUrl] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  
  const handlePointCloudUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      console.log(`Nokta bulutu yükleme başlatılıyor: ${file.name}`);
      const modelUrl = await upload3DModel(file, projectId!, 'point_cloud');
      if (modelUrl) {
        toast.success('Nokta bulutu başarıyla yüklendi');
        console.log('Nokta bulutu URL alındı:', modelUrl);
        
        const { data, error } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectId)
          .eq('model_type', 'point_cloud');
          
        if (!error && data) {
          console.log('Supabase\'den gelen nokta bulutu verileri:', data);
          
          const typedModels = data.map(model => ({
            ...model,
            model_type: model.model_type as "3d_model" | "point_cloud"
          }));
          
          setProject3DModels(prev => [
            ...prev.filter(model => model.model_type !== 'point_cloud'),
            ...(typedModels as Project3DModel[])
          ]);
        } else {
          console.error('Nokta bulutu verileri alınırken hata:', error);
        }
      } else {
        toast.error('Nokta bulutu yüklenirken bir hata oluştu');
        console.error('Nokta bulutu URL alınamadı');
      }
    } catch (error) {
      console.error('Nokta bulutu yüklenirken hata:', error);
      toast.error('Nokta bulutu yüklenirken bir hata oluştu');
    }
  };

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
      
      const { data: updatedData, error: fetchError } = await supabase
        .from('project_3d_models')
        .select('*')
        .eq('project_id', projectId)
        .eq('model_type', 'point_cloud');
        
      if (!fetchError && updatedData) {
        const typedModels = updatedData.map(model => ({
          ...model,
          model_type: model.model_type as "3d_model" | "point_cloud"
        }));
        
        setProject3DModels(prev => [
          ...prev.filter(model => model.model_type !== 'point_cloud'),
          ...(typedModels as Project3DModel[])
        ]);
      }
      
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

  const handleDeletePointCloud = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      setProject3DModels(project3DModels.filter(model => model.id !== modelId));
      toast.success('Nokta bulutu başarıyla silindi');
    } catch (error) {
      console.error('Nokta bulutu silinirken hata:', error);
      toast.error('Nokta bulutu silinirken bir hata oluştu');
    }
  };

  const pointCloudModels = project3DModels.filter(model => model.model_type === 'point_cloud');

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Nokta Bulutu (Point Cloud)</h2>
        <p className="text-sm text-gray-500">Projeye ait nokta bulutu verilerini buradan yükleyebilirsiniz.</p>
      </div>
      
      <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded flex">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div>
          <p className="text-sm text-blue-700">
            Artık hem dosya yükleme, URL ekleme hem de doğrudan iframe kodu yapıştırarak Agisoft Cloud gibi servislerdeki nokta bulutlarını ekleyebilirsiniz.
          </p>
        </div>
      </div>
      
      <div className="mb-6 border border-gray-200 p-4 rounded">
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL Ekle</TabsTrigger>
            <TabsTrigger value="iframe">iframe Kodu</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="mt-4">
            <div className="flex gap-2">
              <Input 
                placeholder="https://potree.github.io/potree/examples/..." 
                value={pointCloudUrl}
                onChange={(e) => setPointCloudUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddPointCloudUrl}>Ekle</Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Potree veya Agisoft Cloud örneğinin tam URL'sini ekleyin
            </p>
          </TabsContent>
          
          <TabsContent value="iframe" className="mt-4">
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
            <p className="text-xs text-gray-500 mt-1">
              Agisoft Cloud gibi servislerden aldığınız iframe kodunu buraya yapıştırın
            </p>
          </TabsContent>
        </Tabs>
      </div>
      
      <FileUploadBox 
        onFileSelected={handlePointCloudUpload}
        title="Nokta Bulutu Dosyası Yükle"
        description="LAZ, LAS, XYZ, PTS formatları desteklenir."
        icon={<Cloud className="mx-auto h-12 w-12 text-gray-400" />}
        allowedTypes={['laz', 'las', 'xyz', 'pts']}
      />

      {pointCloudModels.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Yüklü Nokta Bulutları</h3>
          <div className="space-y-2">
            {pointCloudModels.map(model => (
              <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center overflow-hidden">
                  {model.model_url.includes('<iframe') ? (
                    <Code className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                  ) : model.model_url.includes('cloud.agisoft.com') ? (
                    <img 
                      src="/cloud-agisoft-logo.png" 
                      alt="Agisoft Cloud" 
                      className="h-5 w-5 mr-2 flex-shrink-0" 
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  ) : model.model_url.startsWith('http') && !model.model_url.includes('storage.googleapis') ? (
                    <Link className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Cloud className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                  )}
                  <div className="truncate">
                    {model.model_url.includes('<iframe') ? (
                      <span className="text-sm text-purple-700">Agisoft Cloud iframe</span>
                    ) : (
                      <a 
                        href={model.model_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm truncate"
                      >
                        {model.model_url.includes('cloud.agisoft.com') 
                          ? 'Agisoft Cloud Projesi' 
                          : (model.model_url.split('/').pop() || model.model_url)}
                      </a>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeletePointCloud(model.id)}
                >
                  <X size={16} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PointCloudTab;
