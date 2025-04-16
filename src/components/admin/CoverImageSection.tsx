
import React from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';

interface CoverImageSectionProps {
  imageKey: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  updatedAt?: string | null;
  onImageClick: (url: string) => void;
  onFileSelected: (file: File, imageKey: string) => Promise<void>;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  imageKey,
  title,
  description,
  imageUrl,
  updatedAt,
  onImageClick,
  onFileSelected
}) => {
  return (
    <div className="border rounded-lg p-6 bg-white">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      
      {imageUrl ? (
        <div className="mb-4">
          <div 
            className="aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden mb-2"
            onClick={() => onImageClick(imageUrl)}
          >
            <img 
              src={imageUrl} 
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          {updatedAt && (
            <div className="text-xs text-gray-500">
              Son güncelleme: {new Date(updatedAt).toLocaleDateString('tr-TR')}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-4">
          <p className="text-gray-500">Görsel henüz yüklenmemiş</p>
        </div>
      )}
      
      <FileUploadBox
        onFileSelected={(file) => onFileSelected(file, imageKey)}
        title="Yeni görsel yükle"
        description="JPG, PNG veya WebP formatında görsel yükleyebilirsiniz"
        allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
      />
    </div>
  );
};

export default CoverImageSection;
