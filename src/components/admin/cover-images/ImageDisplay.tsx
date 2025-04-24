
import React from 'react';

interface ImageDisplayProps {
  imageUrl: string | null;
  settings: {
    opacity: string;
    height: string;
    position: string;
    overlay_color: string;
    blend_mode: string;
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
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: settings.position,
          opacity: Number(settings.opacity),
          mixBlendMode: settings.blend_mode as any
        }}
      >
        <div 
          className="w-full h-full" 
          style={{ backgroundColor: settings.overlay_color }}
        />
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
