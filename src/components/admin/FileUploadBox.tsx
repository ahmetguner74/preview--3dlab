
import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from "sonner";

interface FileUploadBoxProps {
  onFileSelected: (file: File) => Promise<void>;
  onMultipleFilesSelected?: (files: FileList) => Promise<void>;
  title: string;
  description?: string;
  allowedTypes?: string[];
  icon?: React.ReactNode;
  maxSizeMB?: number;
  isUploading?: boolean;
  allowMultiple?: boolean;
  acceptZip?: boolean;
}

const FileUploadBox = ({
  onFileSelected,
  onMultipleFilesSelected,
  title,
  description,
  allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'obj', 'gltf', 'glb', 'las', 'laz', 'xyz', 'pts'],
  icon,
  maxSizeMB = 50,
  isUploading = false,
  allowMultiple = false,
  acceptZip = false
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
      if (allowMultiple && e.dataTransfer.files.length > 1) {
        await validateAndProcessMultipleFiles(e.dataTransfer.files);
      } else {
        const file = e.dataTransfer.files[0];
        await validateAndProcessFile(file);
      }
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (allowMultiple && e.target.files.length > 1) {
        await validateAndProcessMultipleFiles(e.target.files);
      } else {
        const file = e.target.files[0];
        await validateAndProcessFile(file);
      }
    }
  };

  const validateAndProcessFile = async (file: File) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    
    // ZIP dosyası kontrolü
    if (acceptZip && fileExt === 'zip') {
      await processFile(file);
      return;
    }
    
    // Dosya türü kontrolü
    if (allowedTypes && !allowedTypes.includes(fileExt)) {
      const errorMsg = `Geçersiz dosya türü. İzin verilen türler: ${allowedTypes.join(', ')}${acceptZip ? ', zip' : ''}`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg);
      return;
    }

    await processFile(file);
  };

  const validateAndProcessMultipleFiles = async (files: FileList) => {
    if (!onMultipleFilesSelected) {
      toast.error('Çoklu dosya yükleme desteklenmiyor');
      return;
    }

    // Tüm dosyaları doğrula
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!acceptZip || fileExt !== 'zip') {
        if (allowedTypes && !allowedTypes.includes(fileExt)) {
          const errorMsg = `Geçersiz dosya türü: ${file.name}`;
          setErrorMessage(errorMsg);
          toast.error(errorMsg);
          return;
        }
      }

      // Dosya boyutu kontrolü
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        const errorMsg = `Dosya boyutu ${maxSizeMB}MB'dan küçük olmalıdır: ${file.name}`;
        setErrorMessage(errorMsg);
        toast.error(errorMsg);
        return;
      }
    }

    try {
      setErrorMessage(null);
      console.log(`${files.length} dosya yükleme başlatılıyor`);
      await onMultipleFilesSelected(files);
      console.log('Çoklu dosya yükleme işlevi tamamlandı');
    } catch (error) {
      console.error("Çoklu dosya yükleme hatası:", error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      setErrorMessage(errorMessage);
      toast.error(`Dosyalar yüklenemedi: ${errorMessage}`);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processFile = async (file: File) => {
    // Dosya boyutu kontrolü
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

  const getAcceptString = () => {
    let acceptString = allowedTypes?.map(type => `.${type}`).join(',') || '';
    if (acceptZip) {
      acceptString += acceptString ? ',.zip' : '.zip';
    }
    return acceptString;
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
              {allowMultiple ? 'Dosya(lar) Seç' : 'Dosya Seç'}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept={getAcceptString()}
              multiple={allowMultiple}
            />
          </div>
          
          {allowMultiple && (
            <p className="mt-2 text-xs text-gray-500">
              Birden fazla dosya seçebilirsiniz
            </p>
          )}
          
          {acceptZip && (
            <p className="mt-1 text-xs text-gray-500">
              ZIP arşivi de desteklenir
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default FileUploadBox;
