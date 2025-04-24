
import React, { useState } from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import ImageSettingsForm from './ImageSettingsForm';
import ImageDisplay from './ImageDisplay';
import YouTubeInput from './YouTubeInput';

interface CoverImageSectionProps {
  imageKey: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  updatedAt?: string | null;
  settings?: {
    opacity: string;
    height: string;
    position: string;
    overlay_color: string;
    blend_mode: string;
  };
  onImageClick: (url: string) => void;
  onFileSelected: (file: File, imageKey: string) => Promise<void>;
  onYoutubeLinkChange?: (link: string, imageKey: string) => void;
  onSettingsChange?: (settings: any, imageKey: string) => void;
}

const CoverImageSection: React.FC<CoverImageSectionProps> = ({
  imageKey,
  title,
  description,
  imageUrl,
  updatedAt,
  settings = {
    opacity: '0.7',
    height: '100vh',
    position: 'center',
    overlay_color: 'rgba(0, 0, 0, 0.5)',
    blend_mode: 'normal'
  },
  onImageClick,
  onFileSelected,
  onYoutubeLinkChange,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [inputValue, setInputValue] = useState(imageUrl || '');

  const handleSettingsChange = (field: string, value: any) => {
    if (onSettingsChange) {
      const newSettings = { ...settings, [field]: value };
      onSettingsChange(newSettings, imageKey);
    }
  };

  if (imageKey === 'hero_youtube_video') {
    return (
      <div className="border rounded-lg p-6 bg-white">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-4">{description}</p>
        <YouTubeInput
          inputValue={inputValue}
          onYoutubeLinkSave={() => onYoutubeLinkChange?.(inputValue, imageKey)}
          onInputChange={(e) => setInputValue(e.target.value)}
        />
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <ImageSettingsForm
          settings={settings}
          onSettingsChange={handleSettingsChange}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
        />
      </div>

      <ImageDisplay
        imageUrl={imageUrl}
        settings={settings}
        onClick={() => imageUrl && onImageClick(imageUrl)}
        updatedAt={updatedAt}
      />
      
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
