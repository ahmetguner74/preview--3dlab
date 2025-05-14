
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { processImageWithYolo, YoloApiResponse, getProcessedImageUrl } from '@/utils/yoloApi';
import { YoloUploadTab } from '@/components/yolo/YoloUploadTab';
import { YoloResultTab } from '@/components/yolo/YoloResultTab';
import { YoloTabHeader } from '@/components/yolo/YoloTabHeader';

const YoloProcessing = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<YoloApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  
  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    setProcessedImageUrl(null);
    setApiResponse(null);
    setActiveTab("upload");
    toast.info("Görüntü yüklendi. İşlemek için 'Görüntüyü İşle' düğmesine tıklayın.");
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast.error('Lütfen önce bir görüntü seçin.');
      return;
    }

    setIsLoading(true);
    setProcessedImageUrl(null);

    try {
      const response = await processImageWithYolo(selectedFile);
      setApiResponse(response);
      
      if (response.result_image) {
        const imageUrl = getProcessedImageUrl(response.result_image);
        setProcessedImageUrl(imageUrl);
      } else {
        setProcessedImageUrl(null);
      }
      
      toast.success('Görüntü başarıyla işlendi!');
      setActiveTab("result");
    } catch (error) {
      console.error('İşleme hatası:', error);
      toast.error('Görüntü işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="arch-container py-12">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-display mb-2">YOLOv8 Görüntü İşleme</h1>
              <p className="text-gray-600">Görüntüleri yapay zeka ile algılama ve segmentasyon</p>
            </div>
          </div>

          <Alert className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Not: API erişiminde CORS sorunları oluşabilir. Bu durumda sistem, test verileri gösterecektir.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-auto mb-6">
              <TabsTrigger value="upload">
                <YoloTabHeader icon="upload" label="Görüntü" />
              </TabsTrigger>
              <TabsTrigger value="result">
                <YoloTabHeader icon="result" label="Sonuç" />
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <YoloUploadTab 
                previewUrl={previewUrl}
                selectedFile={selectedFile}
                isLoading={isLoading}
                onFileSelected={handleFileSelected}
                onProcessImage={handleProcessImage}
              />
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              <YoloResultTab 
                apiResponse={apiResponse}
                isLoading={isLoading}
                processedImageUrl={processedImageUrl}
                onNewImage={() => setActiveTab("upload")}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default YoloProcessing;
