import React from 'react';
import ImageSettingsForm from '../ImageSettingsForm';
import ImageDisplay from '../ImageDisplay';
import { toast } from "sonner";

interface ImageSettingsSectionProps {
  title: string;
  description: string;
  settings: {
    opacity: string;
    overlay_color: string;
  };
  imageUrl: string | null;
  updatedAt?: string | null;
  onImageClick: (url: string) => void;
  onSettingsChange: (settings: any, imageKey: string) => void;
  imageKey: string;
}

const ImageSettingsSection: React.FC<ImageSettingsSectionProps> = ({
  title,
  description,
  settings,
  imageUrl,
  updatedAt,
  onImageClick,
  onSettingsChange,
  imageKey
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [lastSavedSettings, setLastSavedSettings] = useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
    setLastSavedSettings(settings);
  }, [settings]);

  const handleSettingsChange = (field: string, value: any) => {
    const newSettings = { ...localSettings, [field]: value };
    setLocalSettings(newSettings);
  };

  const handleSaveSettings = () => {
    if (JSON.stringify(localSettings) !== JSON.stringify(lastSavedSettings)) {
      onSettingsChange(localSettings, imageKey);
      setLastSavedSettings(localSettings);
      toast.success('Görünüm ayarları kaydedildi');
    }
  };

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
      </div>
    </div>
  );
};

export default ImageSettingsSection;
