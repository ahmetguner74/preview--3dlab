
import React from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormLabel } from '@/components/ui/form';

interface ImageSettingsFormProps {
  settings: {
    opacity: string;
    height: string;
    position: string;
    overlay_color: string;
    blend_mode: string;
  };
  onSettingsChange: (field: string, value: any) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

const ImageSettingsForm: React.FC<ImageSettingsFormProps> = ({
  settings,
  onSettingsChange,
  showSettings,
  onToggleSettings
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSettings}
      >
        <Settings className="h-4 w-4 mr-2" />
        Görünüm Ayarları
      </Button>

      {showSettings && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <div className="space-y-2">
            <FormLabel>Opaklık</FormLabel>
            <Slider
              defaultValue={[Number(settings.opacity) * 100]}
              max={100}
              step={1}
              onValueChange={([value]) => onSettingsChange('opacity', (value / 100).toString())}
            />
          </div>

          <div className="space-y-2">
            <FormLabel>Yükseklik</FormLabel>
            <Select 
              defaultValue={settings.height}
              onValueChange={(value) => onSettingsChange('height', value)}
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
              onValueChange={(value) => onSettingsChange('position', value)}
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
              onValueChange={(value) => onSettingsChange('overlay_color', value)}
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
              onValueChange={(value) => onSettingsChange('blend_mode', value)}
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
    </>
  );
};

export default ImageSettingsForm;
