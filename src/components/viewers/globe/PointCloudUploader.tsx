
import React, { useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/components/ui/use-toast';

interface PointCloudUploaderProps {
  onPointCloudLoaded: (data: {
    url: string;
    name: string;
    type: string;
    coordinateSystem: string;
  }) => void;
}

const PointCloudUploader: React.FC<PointCloudUploaderProps> = ({ onPointCloudLoaded }) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [remoteUrl, setRemoteUrl] = useState<string>('');
  const [coordinateSystem, setCoordinateSystem] = useState<string>('WGS84');
  const { t } = useTranslation();
  const { toast } = useToast();

  // Desteklenen nokta bulutu formatları
  const supportedFormats = ['las', 'laz', 'ept', 'xyz', 'pcd'];

  // Dosya sürükle ve bırak işlemleri
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    // Dosya uzantısını kontrol et
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (!supportedFormats.includes(fileExt)) {
      toast({
        title: t("Desteklenmeyen format"),
        description: t("Lütfen desteklenen bir nokta bulutu formatı yükleyin (LAS, LAZ, EPT, XYZ, PCD)."),
        variant: "destructive"
      });
      return;
    }
    
    setSelectedFile(file);
    setRemoteUrl('');
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoteUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemoteUrl(e.target.value);
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    
    try {
      if (selectedFile) {
        // Gerçek uygulamada dosya sunucuya yüklenecek
        // Burada simüle ediyoruz
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Dosya URL'sini oluştur (gerçek bir uygulamada sunucudan dönen URL kullanılır)
        const fileUrl = URL.createObjectURL(selectedFile);
        const fileType = selectedFile.name.split('.').pop()?.toLowerCase() || '';
        
        onPointCloudLoaded({
          url: fileUrl,
          name: selectedFile.name,
          type: fileType,
          coordinateSystem
        });
        
        toast({
          title: t("Yükleme başarılı"),
          description: t("Nokta bulutu başarıyla yüklendi."),
        });
      } else if (remoteUrl) {
        // URL kontrolü
        if (!isValidUrl(remoteUrl)) {
          toast({
            title: t("Geçersiz URL"),
            description: t("Lütfen geçerli bir URL girin."),
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // URL'den dosya tipi çıkar
        const urlParts = remoteUrl.split('.');
        const fileType = urlParts[urlParts.length - 1].toLowerCase();
        
        if (!supportedFormats.includes(fileType)) {
          toast({
            title: t("Desteklenmeyen format"),
            description: t("URL, desteklenen bir nokta bulutu formatına işaret etmiyor."),
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Gerçek bir uygulamada URL'nin erişilebilir olduğunu kontrol edebiliriz
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        onPointCloudLoaded({
          url: remoteUrl,
          name: remoteUrl.split('/').pop() || 'Uzaktan veri',
          type: fileType,
          coordinateSystem
        });
        
        toast({
          title: t("Uzaktan veri yüklendi"),
          description: t("Nokta bulutu başarıyla yüklendi."),
        });
      } else {
        toast({
          title: t("Dosya veya URL gerekli"),
          description: t("Lütfen bir dosya yükleyin veya URL girin."),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Yükleme hatası:', error);
      toast({
        title: t("Yükleme başarısız"),
        description: t("Nokta bulutu yüklenirken bir hata oluştu."),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // URL doğrulama
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleFileDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input 
          id="file-input"
          type="file"
          accept=".las,.laz,.ept,.xyz,.pcd"
          className="hidden"
          onChange={handleFileInputChange}
        />
        
        <UploadCloud className="w-12 h-12 mx-auto text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">
          {selectedFile ? selectedFile.name : t('Dosya seçin veya sürükleyin')}
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('Desteklenen formatlar')}: LAS, LAZ, EPT, XYZ, PCD
        </p>
        {selectedFile && (
          <div className="mt-2 text-sm text-gray-600">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </div>
        )}
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="remote-url">{t('veya URL belirtin')}</Label>
        <Input
          id="remote-url"
          type="text"
          placeholder="https://example.com/pointcloud.las"
          value={remoteUrl}
          onChange={handleRemoteUrlChange}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500">
          {t('Publicly accessible URL to a point cloud file')}
        </p>
      </div>

      <div className="flex flex-col space-y-2">
        <Label>{t('Koordinat Sistemi')}</Label>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="wgs84"
              name="coordinate-system"
              value="WGS84"
              checked={coordinateSystem === 'WGS84'}
              onChange={() => setCoordinateSystem('WGS84')}
              className="h-4 w-4"
            />
            <Label htmlFor="wgs84" className="cursor-pointer">WGS84 (EPSG:4326)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="radio"
              id="utm"
              name="coordinate-system"
              value="UTM"
              checked={coordinateSystem === 'UTM'}
              onChange={() => setCoordinateSystem('UTM')}
              className="h-4 w-4"
            />
            <Label htmlFor="utm" className="cursor-pointer">UTM</Label>
          </div>
        </div>
      </div>

      <Button 
        onClick={handleUpload}
        disabled={(!selectedFile && !remoteUrl) || isLoading} 
        className="w-full"
      >
        {isLoading ? (
          <>
            <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></span>
            {t('Yükleniyor...')}
          </>
        ) : t('Yükle ve Görüntüle')}
      </Button>
    </div>
  );
};

export default PointCloudUploader;
