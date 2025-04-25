
import React, { useState } from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import YouTubeSection from './sections/YouTubeSection';
import ImageSettingsSection from './sections/ImageSettingsSection';

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
  const [inputValue, setInputValue] = useState(imageUrl || '');

  if (imageKey === 'hero_youtube_video') {
    return (
      <YouTubeSection
        title={title}
        description={description}
        inputValue={inputValue}
        onYoutubeLinkChange={onYoutubeLinkChange}
        imageKey={imageKey}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ImageSettingsSection
        title={title}
        description={description}
        settings={settings}
        imageUrl={imageUrl || null}
        updatedAt={updatedAt}
        onImageClick={onImageClick}
        onSettingsChange={onSettingsChange!}
        imageKey={imageKey}
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
