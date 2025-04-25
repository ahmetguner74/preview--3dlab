
import React, { useState, useCallback } from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import ImageSettingsForm from './ImageSettingsForm';
import ImageDisplay from './ImageDisplay';
import YouTubeInput from './YouTubeInput';
import { toast } from 'sonner';

interface CoverImageSectionProps {
  imageKey: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  updatedAt?: string | null;
  settings?: {
    opacity: string;
    overlay_color: string;
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
    overlay_color: 'rgba(0, 0, 0, 0.5)',
  },
  onImageClick,
  onFileSelected,
  onYoutubeLinkChange,
  onSettingsChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [inputValue, setInputValue] = useState(imageUrl || '');
  const [localSettings, setLocalSettings] = useState(settings);
  const [lastSavedSettings, setLastSavedSettings] = useState(settings);
  
  React.useEffect(() => {
    setLocalSettings(settings);
    setLastSavedSettings(settings);
  }, [settings]);

  const handleSettingsChange = useCallback((field: string, value: any) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
  }, [localSettings]);

  const handleSaveSettings = useCallback(() => {
    if (onSettingsChange && JSON.stringify(localSettings) !== JSON.stringify(lastSavedSettings)) {
      onSettingsChange(localSettings, imageKey);
      setLastSavedSettings(localSettings);
      toast.success('Görünüm ayarları kaydedildi');
    }
  }, [localSettings, lastSavedSettings, onSettingsChange, imageKey]);

  if (imageKey === 'hero_youtube_video') {
    return (
      <div className="border rounded-lg p-4 md:p-6 bg-white">
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
    <div className="border rounded-lg p-4 md:p-6 bg-white">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="space-y-6">
        <ImageSettingsForm
          settings={localSettings}
          onSettingsChange={handleSettingsChange}
          showSettings={showSettings}
          onToggleSettings={() => setShowSettings(!showSettings)}
          onSaveSettings={handleSaveSettings}
          previewUrl={imageUrl}
        />
        
        {!showSettings && (
          <ImageDisplay
            imageUrl={imageUrl}
            settings={localSettings}
            onClick={() => imageUrl && onImageClick(imageUrl)}
            updatedAt={updatedAt}
          />
        )}
        
        <FileUploadBox
          onFileSelected={(file) => onFileSelected(file, imageKey)}
          title="Yeni görsel yükle"
          description="JPG, PNG veya WebP formatında görsel yükleyebilirsiniz"
          allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
        />
      </div>
    </div>
  );
};

export default CoverImageSection;
