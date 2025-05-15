
import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface FileUploadBoxProps {
  onFileSelected: (file: File) => Promise<void>;
  title: string;
  description?: string;
  allowedTypes?: string[];
  icon?: React.ReactNode;
  maxSizeMB?: number;
  isUploading?: boolean;
}

const FileUploadBox = ({
  onFileSelected,
  title,
  description,
  allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'obj', 'gltf', 'glb', 'las', 'laz', 'xyz', 'pts'],
  icon,
  maxSizeMB = 5,
  isUploading = false
}: FileUploadBoxProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
      await validateAndProcessFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      await validateAndProcessFile(file);
    }
  };

  const validateAndProcessFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // Dosya türü kontrolü
    if (allowedTypes && !allowedTypes.includes(fileExt)) {
      const errorMsg = `Geçersiz dosya türü. İzin verilen türler: ${allowedTypes.join(', ')}`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }

    // Dosya boyutu kontrolü (MB cinsinden)
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      const errorMsg = `Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır. Seçilen dosya: ${fileSizeMB.toFixed(2)}MB`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }

    try {
      setErrorMessage(null);
      console.log(`Dosya yükleme başlatılıyor: ${file.name} (${file.size} bytes)`);
      await onFileSelected(file);
      console.log('Dosya yükleme işlevi tamamlandı');
    } catch (error) {
      console.error("Dosya yükleme hatası:", error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setErrorMessage(errorMessage);
      toast.error(`Dosya yüklenemedi: ${errorMessage}`);
    } finally {
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
          
          {errorMessage && (
            <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
          )}
          
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
