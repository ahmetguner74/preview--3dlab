
import React from 'react';
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Upload } from 'lucide-react';

interface YoloUploadTabProps {
  previewUrl: string | null;
  selectedFile: File | null;
  isLoading: boolean;
  onFileSelected: (file: File) => void;
  onProcessImage: () => Promise<void>;
}

export const YoloUploadTab: React.FC<YoloUploadTabProps> = ({
  previewUrl,
  selectedFile,
  isLoading,
  onFileSelected,
  onProcessImage
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      onFileSelected(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="space-y-6">
      <div 
        className="border-2 border-dashed rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          ref={fileInputRef}
        />
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="h-10 w-10 text-gray-400" />
          <h3 className="text-lg font-medium">Görüntü Yükle</h3>
          <p className="text-sm text-center text-gray-500 max-w-xs">
            Bir resim dosyası sürükleyip bırakın veya seçmek için tıklayın
          </p>
          <p className="text-xs text-gray-400">
            Desteklenen formatlar: JPG, PNG, BMP
          </p>
        </div>
      </div>

      {previewUrl && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Seçilen Görüntü</h3>
          <div className="border rounded-lg overflow-hidden bg-white shadow-sm">
            <AspectRatio ratio={16 / 9} className="bg-muted">
              <img
                src={previewUrl}
                alt="Seçilen görüntü"
                className="object-contain w-full h-full"
              />
            </AspectRatio>
            <div className="p-2 text-xs text-gray-500">
              {selectedFile?.name} ({Math.round((selectedFile?.size || 0) / 1024)} KB)
            </div>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={onProcessImage}
              disabled={isLoading || !selectedFile}
              className="w-full md:w-auto"
            >
              {isLoading ? 'İşleniyor...' : 'Görüntüyü İşle'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
