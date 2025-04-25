
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Image, X, Upload } from 'lucide-react';
import { usePanoramaUploads } from '@/hooks/usePanoramaUploads';
import { Progress } from '@/components/ui/progress';

interface PanoramaUploaderProps {
  tourId: string;
  onComplete?: () => void;
}

const PanoramaUploader: React.FC<PanoramaUploaderProps> = ({ tourId, onComplete }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploads, addFiles, startUploads, removeUpload, clearUploads } = usePanoramaUploads(tourId);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      addFiles(event.target.files);
    }
  };

  const handleUploadClick = async () => {
    if (uploads.size === 0) {
      fileInputRef.current?.click();
      return;
    }
    
    await startUploads();
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Panoramalar</h3>
        <div className="flex gap-2">
          {uploads.size > 0 && (
            <Button variant="outline" onClick={clearUploads}>
              Listeyi Temizle
            </Button>
          )}
          <Button onClick={handleUploadClick}>
            <Upload className="w-4 h-4 mr-2" />
            {uploads.size === 0 ? 'Dosya Seç' : 'Yüklemeyi Başlat'}
          </Button>
        </div>
      </div>

      {uploads.size > 0 && (
        <div className="space-y-2">
          {Array.from(uploads.entries()).map(([fileName, upload]) => (
            <div key={fileName} className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Image className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium">{fileName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUpload(fileName)}
                  disabled={upload.status === 'uploading'}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {upload.status === 'uploading' && (
                <Progress value={upload.progress} className="h-1" />
              )}
              {upload.status === 'error' && (
                <p className="text-sm text-red-500">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanoramaUploader;
