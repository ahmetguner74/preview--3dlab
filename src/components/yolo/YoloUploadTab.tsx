
import React from 'react';
import { Upload, Loader2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import FileUploadBox from '@/components/admin/FileUploadBox';

interface YoloUploadTabProps {
  previewUrl: string | null;
  selectedFile: File | null;
  isLoading: boolean;
  onFileSelected: (file: File) => void;
  onProcessImage: () => void;
}

export const YoloUploadTab: React.FC<YoloUploadTabProps> = ({
  previewUrl,
  selectedFile,
  isLoading,
  onFileSelected,
  onProcessImage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Görüntü Yükle</CardTitle>
        <CardDescription>JPEG veya PNG formatında bir görüntü seçin</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FileUploadBox 
          onFileSelected={onFileSelected}
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
          onClick={onProcessImage} 
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
  );
};
