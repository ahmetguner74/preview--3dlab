
import React, { useEffect } from 'react';
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
  previewUrl?: string | null;
}

const ImageSettingsForm: React.FC<ImageSettingsFormProps> = ({
  settings,
  showSettings,
  onToggleSettings,
  onSettingsChange,
  previewUrl
}) => {
  const form = useForm({
    defaultValues: settings
  });

  // Form değerlerinin değişikliğinde güncelleme
  useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

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
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
        >
          <Settings className="h-4 w-4 mr-2" />
          Ayarları Gizle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Form {...form}>
          <div className="space-y-4 bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-sm text-gray-700 mb-4">Görsel Ayarları</h3>

            <FormField
              control={form.control}
              name="opacity"
              render={() => (
                <FormItem>
                  <FormLabel>Opaklık</FormLabel>
                  <div className="pt-2">
                    <Slider
                      value={[Number(settings.opacity) * 100]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => {
                        const newValue = (value / 100).toString();
                        onSettingsChange('opacity', newValue);
                      }}
                    />
                    <div className="text-xs text-right mt-1">
                      {Math.round(Number(settings.opacity) * 100)}%
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Yükseklik</FormLabel>
              <Select 
                value={settings.height}
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
                value={settings.position}
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
                value={settings.overlay_color}
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
                value={settings.blend_mode}
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

        {previewUrl && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-sm text-gray-700 mb-4">Canlı Önizleme</h3>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `url(${previewUrl})`,
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
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Bu önizleme, web sitenizde görselin nasıl görüneceğini temsil eder
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSettingsForm;
