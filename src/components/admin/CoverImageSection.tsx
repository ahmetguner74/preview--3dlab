
import React, { useState } from 'react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

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
  
  const form = useForm({
    defaultValues: settings
  });

  const handleSettingsChange = (field: string, value: any) => {
    if (onSettingsChange) {
      const newSettings = { ...settings, [field]: value };
      onSettingsChange(newSettings, imageKey);
    }
  };

  // YouTube linki için kullanıcı girişini işleme
  const handleYoutubeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  // YouTube linki kaydetme işlevi
  const handleYoutubeLinkSave = () => {
    if (!onYoutubeLinkChange) return;
    
    if (!inputValue.trim()) return;
    
    let processedLink = inputValue.trim();
    
    if (processedLink.includes('<iframe') && processedLink.includes('src="')) {
      const srcMatch = processedLink.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        processedLink = srcMatch[1];
      }
    }
    
    if (processedLink.includes('youtube.com/watch?v=')) {
      const videoId = processedLink.split('v=')[1]?.split('&')[0];
      if (videoId) {
        processedLink = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    if (processedLink.includes('youtu.be/')) {
      const videoId = processedLink.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        processedLink = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    onYoutubeLinkChange(processedLink, imageKey);
  };

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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Görünüm Ayarları
        </Button>
      </div>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="space-y-2">
            <FormLabel>Opaklık</FormLabel>
            <Slider
              defaultValue={[Number(settings.opacity) * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => handleSettingsChange('opacity', (value / 100).toString())}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Yükseklik</FormLabel>
            <Select 
              defaultValue={settings.height}
              onValueChange={(value) => handleSettingsChange('height', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="50vh">Yarı Ekran</SelectItem>
                <SelectItem value="75vh">3/4 Ekran</SelectItem>
                <SelectItem value="100vh">Tam Ekran</SelectItem>
                <SelectItem value="120vh">Geniş Ekran</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Pozisyon</FormLabel>
            <Select 
              defaultValue={settings.position}
              onValueChange={(value) => handleSettingsChange('position', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Üst</SelectItem>
                <SelectItem value="center">Orta</SelectItem>
                <SelectItem value="bottom">Alt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Karartma Rengi</FormLabel>
            <Select 
              defaultValue={settings.overlay_color}
              onValueChange={(value) => handleSettingsChange('overlay_color', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rgba(0, 0, 0, 0.3)">Hafif Karartma</SelectItem>
                <SelectItem value="rgba(0, 0, 0, 0.5)">Orta Karartma</SelectItem>
                <SelectItem value="rgba(0, 0, 0, 0.7)">Koyu Karartma</SelectItem>
                <SelectItem value="rgba(0, 0, 0, 0)">Karartma Yok</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FormLabel>Karışım Modu</FormLabel>
            <Select 
              defaultValue={settings.blend_mode}
              onValueChange={(value) => handleSettingsChange('blend_mode', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="multiply">Multiply</SelectItem>
                <SelectItem value="screen">Screen</SelectItem>
                <SelectItem value="overlay">Overlay</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {imageUrl ? (
        <div className="mb-4">
          <div 
            className="aspect-video bg-gray-100 rounded cursor-pointer overflow-hidden mb-2"
            onClick={() => onImageClick(imageUrl)}
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
