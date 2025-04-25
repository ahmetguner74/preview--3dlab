
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface ImageSettingsFormProps {
  settings: {
    opacity: string;
    height: string;
    position: string;
    overlay_color: string;
    blend_mode: string;
  };
  showSettings: boolean;
  onToggleSettings: () => void;
  onSettingsChange: (field: string, value: any) => void;
}

const ImageSettingsForm: React.FC<ImageSettingsFormProps> = ({
  settings,
  showSettings,
  onToggleSettings,
  onSettingsChange
}) => {
  const form = useForm({
    defaultValues: settings
  });

  if (!showSettings) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSettings}
      >
        <Settings className="h-4 w-4 mr-2" />
        Görünüm Ayarları
      </Button>
    );
  }

  return (
    <div className="w-full">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSettings}
        className="mb-4"
      >
        <Settings className="h-4 w-4 mr-2" />
        Ayarları Gizle
      </Button>

      <Form {...form}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="opacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opaklık</FormLabel>
                <div className="pt-2">
                  <Slider
                    defaultValue={[Number(settings.opacity) * 100]}
                    max={100}
                    step={1}
                    onValueChange={([value]) => onSettingsChange('opacity', (value / 100).toString())}
                  />
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Yükseklik</label>
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
            <label className="text-sm font-medium">Pozisyon</label>
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
            <label className="text-sm font-medium">Karartma Rengi</label>
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
            <label className="text-sm font-medium">Karışım Modu</label>
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
      </Form>
    </div>
  );
};

export default ImageSettingsForm;
