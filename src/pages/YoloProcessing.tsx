
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Upload, Loader2, Image as ImageIcon, Check, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { processImageWithYolo, YoloApiResponse } from '@/utils/yoloApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

const YoloProcessing = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<YoloApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const { t } = useTranslation();
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
      setApiResponse(null);
      
      // Upload tab'ına geç
      setActiveTab("upload");
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
      const response = await processImageWithYolo(selectedFile);
      setApiResponse(response);
      
      if (response.result_jpg) {
        setProcessedImageUrl(response.result_jpg);
      }
      
      toast.success('Görüntü başarıyla işlendi!');
      // Otomatik olarak sonuç tab'ına geç
      setActiveTab("result");
    } catch (error) {
      console.error('İşleme hatası:', error);
      toast.error('Görüntü işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
      
      // Kullanıcıya API erişim sorunu hakkında bilgi ver
      toast.error('API erişim hatası: CORS politikası engellendi. Sistem şu an test verilerle çalışmaktadır.');
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

            <Button 
              onClick={handleUploadClick}
              className="flex items-center gap-2"
            >
              <Upload size={18} />
              Görüntü Yükle
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />
          </div>

          <Alert className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="h-4 w-4 text-blue-500" />
            <AlertDescription>
              Not: Sistem şu anda CORS kısıtlamaları nedeniyle test modunda çalışmaktadır. Gerçek API erişimi için sunucu yapılandırması gereklidir.
            </AlertDescription>
          </Alert>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 w-full md:w-auto mb-6">
              <TabsTrigger value="upload">
                <div className="flex items-center">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Görüntü
                </div>
              </TabsTrigger>
              <TabsTrigger value="result">
                <div className="flex items-center">
                  <Check className="mr-2 h-4 w-4" />
                  Sonuç
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Görüntü Yükle</CardTitle>
                  <CardDescription>JPEG veya PNG formatında bir görüntü seçin</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!previewUrl ? (
                    <div 
                      className="border-2 border-dashed rounded-md p-10 text-center cursor-pointer hover:bg-gray-50 transition-colors"
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
                  ) : (
                    <div className="space-y-4">
                      <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={previewUrl}
                          alt="Önizleme"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Dosya adı:</span> {selectedFile?.name}
                      </div>
                      
                      <Alert className="bg-blue-50 text-blue-700 border-blue-200">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertDescription>
                          İşlemi başlatmak için "Görüntüyü İşle" düğmesine tıklayın. İşlem sunucu yüküne bağlı olarak birkaç saniye sürebilir.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={handleUploadClick} disabled={isLoading}>
                    Değiştir
                  </Button>
                  <Button 
                    onClick={handleProcessImage} 
                    disabled={!selectedFile || isLoading} 
                    className="flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        İşleniyor...
                      </>
                    ) : 'Görüntüyü İşle'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İşlenmiş Görüntü</CardTitle>
                  <CardDescription>YOLOv8 tarafından algılanan nesneler</CardDescription>
                </CardHeader>
                <CardContent>
                  {processedImageUrl ? (
                    <div className="space-y-6">
                      <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                        <img
                          src={processedImageUrl}
                          alt="İşlenmiş görüntü"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      
                      {apiResponse && (
                        <>
                          <h3 className="text-lg font-semibold mb-2">Algılama Sonuçları</h3>
                          
                          {apiResponse.boxes && apiResponse.boxes.length > 0 ? (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>No</TableHead>
                                  <TableHead>Sınıf</TableHead>
                                  <TableHead>Doğruluk</TableHead>
                                  <TableHead>Koordinatlar</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {apiResponse.boxes.map((box, index) => (
                                  <TableRow key={index}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                      {apiResponse.classes && apiResponse.classes[index] !== undefined 
                                        ? `${apiResponse.classes[index]}` 
                                        : 'Bilinmeyen'}
                                    </TableCell>
                                    <TableCell>
                                      {apiResponse.scores && apiResponse.scores[index] !== undefined
                                        ? `%${(apiResponse.scores[index] * 100).toFixed(2)}`
                                        : '-'}
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-xs font-mono">
                                        [{box.map(coord => coord.toFixed(1)).join(', ')}]
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          ) : (
                            <Alert>
                              <AlertDescription>
                                Hiçbir nesne algılanmadı veya koordinat bilgisi bulunamadı.
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          <Alert className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription>
                              Not: CORS kısıtlamaları nedeniyle şu anda test verileri gösterilmektedir.
                            </AlertDescription>
                          </Alert>
                        </>
                      )}
                      
                      <Alert>
                        <Check className="h-4 w-4" />
                        <AlertDescription>
                          Görüntü başarıyla işlendi.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center text-gray-400 flex-col gap-2">
                      {isLoading ? (
                        <>
                          <Loader2 className="h-12 w-12 animate-spin" />
                          <p>İşleniyor...</p>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="h-12 w-12" />
                          <p>Henüz işlenmiş görüntü yok</p>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-end">
                  {processedImageUrl && (
                    <Button onClick={handleUploadClick}>Yeni Görüntü Yükle</Button>
                  )}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default YoloProcessing;
