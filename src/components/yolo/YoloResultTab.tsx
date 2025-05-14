
import React from 'react';
import { Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { YoloApiResponse } from '@/utils/yoloApi';
import { YoloResultImage } from './YoloResultImage';
import { YoloDetectionTable } from './YoloDetectionTable';

interface YoloResultTabProps {
  apiResponse: YoloApiResponse | null;
  isLoading: boolean;
  processedImageUrl: string | null;
  onNewImage: () => void;
}

export const YoloResultTab: React.FC<YoloResultTabProps> = ({
  apiResponse,
  isLoading,
  processedImageUrl,
  onNewImage
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>İşlenmiş Görüntü</CardTitle>
        <CardDescription>YOLOv8 tarafından algılanan nesneler</CardDescription>
      </CardHeader>
      <CardContent>
        {apiResponse ? (
          <div className="space-y-6">
            <YoloResultImage 
              processedImageUrl={processedImageUrl} 
            />
            
            {apiResponse && (
              <>
                <h3 className="text-lg font-semibold mb-2">Algılama Sonuçları</h3>
                
                <YoloDetectionTable apiResponse={apiResponse} />
                
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
          <Button onClick={onNewImage}>Yeni Görüntü İşle</Button>
        )}
      </CardFooter>
    </Card>
  );
};
