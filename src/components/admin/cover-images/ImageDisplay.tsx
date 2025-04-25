
import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  settings: {
    opacity: string;
    overlay_color: string;
  };
  onClick: () => void;
  updatedAt?: string | null;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, settings, onClick, updatedAt }) => {
  if (!imageUrl) {
    return (
      <div className="aspect-video bg-gray-100 rounded flex items-center justify-center mb-4">
        <p className="text-gray-500">Görsel henüz yüklenmemiş</p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div 
        className="aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden mb-2"
        onClick={onClick}
      >
        <div 
          className="w-full h-full relative"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundColor: settings.overlay_color,
              opacity: Number(settings.opacity)
            }}
          />
        </div>
      </div>
      {updatedAt && (
        <div className="text-xs text-gray-500">
          Son güncelleme: {new Date(updatedAt).toLocaleDateString('tr-TR')}
        </div>
      )}
    </div>
  );
};

export default ImageDisplay;
