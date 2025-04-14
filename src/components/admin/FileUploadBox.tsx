
import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadBoxProps {
  onFileSelected: (file: File) => Promise<void>;
  title: string;
  description?: string;
  allowedTypes?: string[];
  icon?: React.ReactNode;
}

const FileUploadBox = ({
  onFileSelected,
  title,
  description,
  allowedTypes = ['jpg', 'jpeg', 'png', 'gif'],
  icon
}: FileUploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      await processFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    // Dosya türünü kontrol et
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    if (allowedTypes && !allowedTypes.includes(fileExt)) {
      alert(`Geçersiz dosya türü. İzin verilen türler: ${allowedTypes.join(', ')}`);
      return;
    }

    try {
      setIsUploading(true);
      await onFileSelected(file);
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
    } finally {
      setIsUploading(false);
      // Dosya input'unu temizle ki aynı dosyayı tekrar seçebilsin
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 text-center transition-colors
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isUploading ? (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
          <p className="mt-2 text-sm text-gray-600">Yükleniyor...</p>
        </div>
      ) : (
        <>
          {icon || <Upload className="mx-auto h-12 w-12 text-gray-400" />}
          <h3 className="mt-2 text-sm font-medium text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
          
          <div className="mt-4">
            <Button 
              type="button" 
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              Dosya Seç
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={allowedTypes?.map(type => `.${type}`).join(',')}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default FileUploadBox;
