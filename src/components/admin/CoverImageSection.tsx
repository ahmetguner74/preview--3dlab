
import React, { useState } from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';

interface CoverImageSectionProps {
  imageKey: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  updatedAt?: string | null;
  onImageClick: (url: string) => void;
  onFileSelected: (file: File, imageKey: string) => Promise<void>;
  onYoutubeLinkChange?: (link: string, imageKey: string) => void;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  imageKey,
  title,
  description,
  imageUrl,
  updatedAt,
  onImageClick,
  onFileSelected,
  onYoutubeLinkChange
}) => {
  const [inputValue, setInputValue] = useState(imageUrl || '');
  
  // YouTube linki için kullanıcı girişini işleme
  const handleYoutubeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // YouTube linki kaydetme işlevi
  const handleYoutubeLinkSave = () => {
    if (!onYoutubeLinkChange) return;
    
    // Link boş ise işlemi durdur
    if (!inputValue.trim()) {
      return;
    }
    
    let processedLink = inputValue.trim();
    
    // Eğer iframe kodu girilmişse, src değerini çıkart
    if (processedLink.includes('<iframe') && processedLink.includes('src="')) {
      const srcMatch = processedLink.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        processedLink = srcMatch[1];
      }
    }
    
    // Normal YouTube watch link formatını embed formatına dönüştür
    if (processedLink.includes('youtube.com/watch?v=')) {
      const videoId = processedLink.split('v=')[1]?.split('&')[0];
      if (videoId) {
        processedLink = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // youtu.be formatındaki linkleri embed formatına dönüştür
    if (processedLink.includes('youtu.be/')) {
      const videoId = processedLink.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        processedLink = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    onYoutubeLinkChange(processedLink, imageKey);
  };

  // hero_youtube_video için sadece metin kutusu göster
  if (imageKey === 'hero_youtube_video') {
    return (
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <div className="mb-4">
          <input
            type="text"
            placeholder="YouTube linki veya iframe kodu"
            value={inputValue}
            onChange={handleYoutubeInputChange}
            className="w-full border rounded px-3 py-2 mb-2"
          />
          <button
            onClick={handleYoutubeLinkSave}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
          >
            Kaydet
          </button>
          <p className="text-xs text-gray-500 mt-2">
            YouTube normal video linki (<strong>youtube.com/watch?v=VIDEO_ID</strong>), embed linki 
            (<strong>youtube.com/embed/VIDEO_ID</strong>) veya iframe kodu girebilirsiniz.
          </p>
          {updatedAt && (
            <div className="text-xs text-gray-500 mt-1">
              Son güncelleme: {new Date(updatedAt).toLocaleDateString('tr-TR')}
            </div>
          )}
        </div>
      </div>
    );
  }

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
