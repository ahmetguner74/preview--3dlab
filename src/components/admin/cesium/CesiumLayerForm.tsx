
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

const layerSchema = z.object({
  name: z.string().min(1, 'Katman adı gereklidir'),
  layer_type: z.enum(['pointcloud', 'mesh', 'ortho', 'dem', 'vector', 'tileset']),
  data_url: z.string().url('Geçerli bir URL giriniz'),
  visible: z.boolean(),
  opacity: z.number().min(0).max(1),
  sort_order: z.number().min(0),
});

type LayerFormData = z.infer<typeof layerSchema>;

interface CesiumLayerFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  projectId: string;
  editingLayer?: any;
}

const CesiumLayerForm: React.FC<CesiumLayerFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
  projectId,
  editingLayer
}) => {
  const form = useForm<LayerFormData>({
    resolver: zodResolver(layerSchema),
    defaultValues: {
      name: editingLayer?.name || '',
      layer_type: editingLayer?.layer_type || 'tileset',
      data_url: editingLayer?.data_url || '',
      visible: editingLayer?.visible ?? true,
      opacity: editingLayer?.opacity ?? 1,
      sort_order: editingLayer?.sort_order ?? 0,
    },
  });

  React.useEffect(() => {
    if (editingLayer) {
      form.reset({
        name: editingLayer.name,
        layer_type: editingLayer.layer_type,
        data_url: editingLayer.data_url,
        visible: editingLayer.visible,
        opacity: editingLayer.opacity,
        sort_order: editingLayer.sort_order,
      });
    } else {
      form.reset({
        name: '',
        layer_type: 'tileset',
        data_url: '',
        visible: true,
        opacity: 1,
        sort_order: 0,
      });
    }
  }, [editingLayer, form]);

  const onSubmit = async (data: LayerFormData) => {
    try {
      if (editingLayer) {
        // Güncelleme
        const { error } = await supabase
          .from('cesium_layers')
          .update({
            name: data.name,
            layer_type: data.layer_type,
            data_url: data.data_url,
            visible: data.visible,
            opacity: data.opacity,
            sort_order: data.sort_order,
          })
          .eq('id', editingLayer.id);

        if (error) throw error;
        toast.success('Katman güncellendi');
      } else {
        // Yeni katman
        const { error } = await supabase
          .from('cesium_layers')
          .insert([{
            project_id: projectId,
            name: data.name,
            layer_type: data.layer_type,
            data_url: data.data_url,
            visible: data.visible,
            opacity: data.opacity,
            sort_order: data.sort_order,
            metadata: {},
            style_config: {},
          }]);

        if (error) throw error;
        toast.success('Katman eklendi');
      }

      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error('Katman kaydedilirken hata:', error);
      toast.error(`Katman kaydedilemedi: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingLayer ? 'Katman Düzenle' : 'Yeni Katman Ekle'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Katman Adı</FormLabel>
                  <FormControl>
                    <Input placeholder="Örn: Ana Bina Modeli" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="layer_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Katman Türü</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Katman türünü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tileset">3D Tiles</SelectItem>
                      <SelectItem value="pointcloud">Nokta Bulutu</SelectItem>
                      <SelectItem value="mesh">3D Mesh</SelectItem>
                      <SelectItem value="ortho">Ortofoto</SelectItem>
                      <SelectItem value="dem">Yükseklik Modeli</SelectItem>
                      <SelectItem value="vector">Vektör</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veri URL'i</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://example.com/tileset.json" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sıralama</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        {...field} 
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="visible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Görünür</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="opacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şeffaflık: {Math.round(field.value * 100)}%</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.1}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit">
                {editingLayer ? 'Güncelle' : 'Katman Ekle'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CesiumLayerForm;
