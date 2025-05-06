
import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import { Upload, Loader2, Image as ImageIcon, Check, AlertTriangle, Info, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { processImageWithYolo, YoloApiResponse, YOLO_API_BASE_URL } from '@/utils/yoloApi';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import FileUploadBox from '@/components/admin/FileUploadBox';

const YoloProcessing = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<YoloApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("upload");
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [longProcessing, setLongProcessing] = useState<boolean>(false);
  
  // Zaman aşımı kontrolü
  useEffect(() => {
    let timerId: number | undefined;
    
    if (isLoading) {
      // 10 saniye sonra uzun işlem uyarısı göster
      timerId = window.setTimeout(() => {
        setLongProcessing(true);
        toast.warning("İşlem biraz uzun sürüyor, lütfen bekleyin.");
      }, 10000);
    }
    
    return () => {
      if (timerId) {
        window.clearTimeout(timerId);
      }
    };
  }, [isLoading]);

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    
    // Önizleme URL'si oluştur
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
    
    // İşlenmiş görüntüyü temizle
    setProcessedImageUrl(null);
    setApiResponse(null);
    setLongProcessing(false);
    
    // Upload tab'ına geç
    setActiveTab("upload");
    
    toast.info("Görüntü yüklendi. İşlemek için 'Görüntüyü İşle' düğmesine tıklayın.");
  };

  const handleProcessImage = async () => {
    if (!selectedFile) {
      toast.error('Lütfen önce bir görüntü seçin.');
      return;
    }

    setIsLoading(true);
    setUploadProgress(0);
    setLongProcessing(false);
    setProcessedImageUrl(null);
    
    // İlerleme animasyonu için basit bir zamanlayıcı
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 5, 90));
    }, 300);

    try {
      const response = await processImageWithYolo(selectedFile);
      setApiResponse(response);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // İşlenmiş görüntü URL'si oluştur
      if (response.result_image) {
        setProcessedImageUrl(`${YOLO_API_BASE_URL}/${response.result_image}`);
      } else {
        setProcessedImageUrl(null);
      }
      
      toast.success('Görüntü başarıyla işlendi!');
      // Otomatik olarak sonuç tab'ına geç
      setActiveTab("result");
    } catch (error) {
      clearInterval(progressInterval);
      setUploadProgress(0);
      console.error('İşleme hatası:', error);
      toast.error('Görüntü işlenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
      setLongProcessing(false);
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
                  <FileUploadBox 
                    onFileSelected={handleFileSelected}
                    title="Görüntü Yükle"
                    description="JPEG veya PNG formatında bir dosya seçin (en fazla 5MB)"
                    allowedTypes={['jpg', 'jpeg', 'png']}
                    icon={<Upload className="h-12 w-12 text-gray-400" />}
                    maxSizeMB={5}
                  />
                  
                  {previewUrl && (
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
                <CardFooter className="flex justify-end">
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
              
              {isLoading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} />
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600">
                      Görüntü işleniyor... {uploadProgress}%
                    </p>
                    {longProcessing && (
                      <div className="flex items-center text-amber-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">İşlem biraz uzun sürüyor, lütfen bekleyin...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="result" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>İşlenmiş Görüntü</CardTitle>
                  <CardDescription>YOLOv8 tarafından algılanan nesneler</CardDescription>
                </CardHeader>
                <CardContent>
                  {apiResponse ? (
                    <div className="space-y-6">
                      <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
                        {processedImageUrl ? (
                          <img
                            src={processedImageUrl}
                            alt="İşlenmiş görüntü"
                            className="max-w-full max-h-full object-contain"
                            onError={() => {
                              toast.error("İşlenmiş görüntü yüklenemedi");
                              setProcessedImageUrl(null);
                            }}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
                            <AlertTriangle className="h-12 w-12 mb-2" />
                            <p>İşlenmiş görüntü bulunamadı</p>
                          </div>
                        )}
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
                          
                          {apiResponse.error && (
                            <Alert variant="destructive">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>
                                API Hatası: {apiResponse.error}
                              </AlertDescription>
                            </Alert>
                          )}
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
                    <Button onClick={() => setActiveTab("upload")}>Yeni Görüntü İşle</Button>
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
