
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface YoloResultImageProps {
  processedImageUrl: string | null;
}

export const YoloResultImage: React.FC<YoloResultImageProps> = ({ processedImageUrl }) => {
  return (
    <div className="aspect-video bg-black rounded-md overflow-hidden flex items-center justify-center">
      {processedImageUrl ? (
        <img
          src={processedImageUrl}
          alt="İşlenmiş görüntü"
          className="max-w-full max-h-full object-contain"
          onError={() => {
            toast.error("İşlenmiş görüntü yüklenemedi");
          }}
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 h-full w-full">
          <AlertTriangle className="h-12 w-12 mb-2" />
          <p>İşlenmiş görüntü bulunamadı</p>
        </div>
      )}
    </div>
  );
};
