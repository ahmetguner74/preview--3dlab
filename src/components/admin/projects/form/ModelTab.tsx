
import React, { useState } from 'react';
import { Box, X, Link, ExternalLink, Code } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Project3DModel } from '@/types/project';
import { upload3DModel } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Info } from 'lucide-react';

interface ModelTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  project3DModels: Project3DModel[];
  setProject3DModels: React.Dispatch<React.SetStateAction<Project3DModel[]>>;
}

const ModelTab: React.FC<ModelTabProps> = ({
  projectId,
  isEditing,
  project3DModels,
  setProject3DModels
}) => {
  const [modelUrl, setModelUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUrlSubmit = async (e: React.FormEvent) => {
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
      
      setProject3DModels(prev => [...prev, newModel]);
      setModelUrl('');
      toast.success('Model başarıyla eklendi');
    } catch (error) {
      console.error('Model eklenirken hata:', error);
      toast.error('Model eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmbedSubmit = async (e: React.FormEvent) => {
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
      
      setProject3DModels(prev => [...prev, newModel]);
      setEmbedCode('');
      toast.success('Sketchfab modeli başarıyla eklendi');
    } catch (error) {
      console.error('Sketchfab modeli eklenirken hata:', error);
      toast.error('Sketchfab modeli eklenirken bir hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handle3DModelUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      console.log(`3D model yükleme başlatılıyor: ${file.name}`);
      const modelUrl = await upload3DModel(file, projectId!, '3d_model');
      if (modelUrl) {
        toast.success('Model başarıyla yüklendi');
        console.log('Model URL alındı:', modelUrl);
        
        const { data, error } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectId)
          .eq('model_type', '3d_model');
          
        if (!error && data) {
          console.log('Supabase\'den gelen model verileri:', data);
          
          const typedModels = data.map(model => ({
            ...model,
            model_type: model.model_type as "3d_model" | "point_cloud"
          }));
          
          setProject3DModels(prev => [
            ...prev.filter(model => model.model_type !== '3d_model'),
            ...(typedModels as Project3DModel[])
          ]);
        } else {
          console.error('Model verileri alınırken hata:', error);
        }
      } else {
        toast.error('Model yüklenirken bir hata oluştu');
        console.error('Model URL alınamadı');
      }
    } catch (error) {
      console.error('Model yüklenirken hata:', error);
      toast.error('Model yüklenirken bir hata oluştu');
    }
  };

  const handleDelete3DModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      setProject3DModels(project3DModels.filter(model => model.id !== modelId));
      toast.success('Model başarıyla silindi');
    } catch (error) {
      console.error('Model silinirken hata:', error);
      toast.error('Model silinirken bir hata oluştu');
    }
  };

  const threeJSModels = project3DModels.filter(model => model.model_type === '3d_model');

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">3D Model</h2>
        <p className="text-sm text-gray-500">Projeye ait 3D modelleri buradan yükleyebilir veya harici kaynaklardan ekleyebilirsiniz.</p>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="fab" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="fab">Fab.com URL</TabsTrigger>
            <TabsTrigger value="sketchfab">Sketchfab Embed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="fab" className="mt-4 p-4 border border-dashed rounded-lg">
            <h3 className="text-sm font-medium mb-2">Fab.com Model URL'si Ekle</h3>
            <form onSubmit={handleUrlSubmit} className="flex gap-2">
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
          </TabsContent>
          
          <TabsContent value="sketchfab" className="mt-4 p-4 border border-dashed rounded-lg">
            <h3 className="text-sm font-medium mb-2">Sketchfab Embed Kodu Ekle</h3>
            <form onSubmit={handleEmbedSubmit}>
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
          </TabsContent>
        </Tabs>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">Model Dosyası Yükle</h3>
        <FileUploadBox 
          onFileSelected={handle3DModelUpload}
          title="3D Model Yükle"
          description="OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir."
          icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
          allowedTypes={['obj', 'gltf', 'glb']}
        />
      </div>

      {/* 3D Model Listesi */}
      {threeJSModels.length > 0 && (
        <div className="mt-6">
          <h3 className="text-md font-medium mb-2">Yüklü 3D Modeller</h3>
          <div className="space-y-2">
            {threeJSModels.map(model => (
              <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                <div className="flex items-center flex-1 min-w-0">
                  {model.model_url.includes('<iframe') ? (
                    <Code className="h-5 w-5 mr-2 text-purple-500 flex-shrink-0" />
                  ) : model.model_url.startsWith('https://fab.com/') ? (
                    <Box className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0" />
                  ) : (
                    <Box className="h-5 w-5 mr-2 text-gray-500 flex-shrink-0" />
                  )}
                  
                  {model.model_url.includes('<iframe') ? (
                    <span className="text-sm truncate text-purple-700">
                      Sketchfab Modeli
                    </span>
                  ) : model.model_url.startsWith('https://fab.com/') ? (
                    <a 
                      href={model.model_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm truncate flex items-center"
                    >
                      <span className="truncate">{model.model_url}</span>
                      <ExternalLink className="h-4 w-4 ml-1 flex-shrink-0" />
                    </a>
                  ) : (
                    <span className="text-sm truncate">
                      {model.model_url.split('/').pop()}
                    </span>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete3DModel(model.id)}
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

export default ModelTab;
