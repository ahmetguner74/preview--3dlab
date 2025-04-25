
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Save } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

interface ImageSettingsFormProps {
  settings: {
    opacity: string;
    overlay_color: string;
  };
  showSettings: boolean;
  onToggleSettings: () => void;
  onSettingsChange: (field: string, value: any) => void;
  onSaveSettings?: () => void;
  previewUrl?: string | null;
}

const ImageSettingsForm: React.FC<ImageSettingsFormProps> = ({
  settings,
  showSettings,
  onToggleSettings,
  onSettingsChange,
  onSaveSettings,
  previewUrl
}) => {
  const form = useForm({
    defaultValues: settings
  });

  React.useEffect(() => {
    form.reset(settings);
  }, [settings, form]);

  if (!showSettings) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleSettings}
        className="w-full md:w-auto"
      >
        <Settings className="h-4 w-4 mr-2" />
        Görünüm Ayarları
      </Button>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSettings}
          className="w-full md:w-auto"
        >
          <Settings className="h-4 w-4 mr-2" />
          Ayarları Gizle
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onSaveSettings}
          className="w-full md:w-auto"
        >
          <Save className="h-4 w-4 mr-2" />
          Ayarları Kaydet
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Form {...form}>
          <div className="space-y-6 bg-white p-4 rounded-lg border">
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
              <FormLabel>Karartma Seviyesi</FormLabel>
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
          </div>
        </Form>

        {previewUrl && (
          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-medium text-sm text-gray-700 mb-4">Canlı Önizleme</h3>
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <div 
                className="w-full h-full relative"
                style={{
                  backgroundImage: `url(${previewUrl})`,
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
