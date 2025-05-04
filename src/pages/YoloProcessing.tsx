
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { processImageWithYolo } from '@/utils/yoloApi';

const YoloProcessing = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Dosya türü kontrolü
      if (!file.type.match('image/jpeg') && !file.type.match('image/png')) {
        toast.error('Sadece JPEG veya PNG görüntüleri yükleyebilirsiniz.');
        return;
      }
      
      setSelectedFile(file);
      
      // Önizleme URL'si oluştur
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // İşlenmiş görüntüyü temizle
      setProcessedImageUrl(null);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast.error('Lütfen önce bir görüntü seçin.');
      return;
    }

    setIsLoading(true);

    try {
      const processedUrl = await processImageWithYolo(selectedFile);
      setProcessedImageUrl(processedUrl);
      toast.success('Görüntü başarıyla işlendi!');
    } catch (error) {
      console.error('İşleme hatası:', error);
      toast.error('Görüntü işlenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="arch-container py-12">
        <h1 className="text-3xl md:text-4xl font-display mb-8">YOLOv8 Görüntü İşleme</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Yükleme Kartı */}
          <Card>
            <CardHeader>
              <CardTitle>Görüntü Yükle</CardTitle>
              <CardDescription>JPEG veya PNG görüntü yükleyin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png"
                className="hidden"
              />
              
              <div 
                className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={handleUploadClick}
              >
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                  Görüntü yüklemek için tıklayın veya sürükleyin
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  JPEG veya PNG, en fazla 5MB
                </p>
              </div>
              
              {previewUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Seçilen Görüntü</p>
                  <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Önizleme"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                </div>
              )}
              
              <Button 
                onClick={handleProcessImage} 
                disabled={!selectedFile || isLoading} 
                className="w-full"
              >
                {isLoading ? 'İşleniyor...' : 'Görüntüyü İşle'}
              </Button>
            </CardContent>
          </Card>
          
          {/* Sonuç Kartı */}
          <Card>
            <CardHeader>
              <CardTitle>İşlenmiş Görüntü</CardTitle>
              <CardDescription>YOLOv8 tarafından işlenmiş görüntü</CardDescription>
            </CardHeader>
            <CardContent>
              {processedImageUrl ? (
                <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                  <img
                    src={processedImageUrl}
                    alt="İşlenmiş görüntü"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                  {isLoading ? (
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400"></div>
                      <p className="mt-2">İşleniyor...</p>
                    </div>
                  ) : (
                    <p>Henüz işlenmiş görüntü yok</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default YoloProcessing;
