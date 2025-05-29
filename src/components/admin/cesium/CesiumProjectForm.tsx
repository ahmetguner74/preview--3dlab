
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const projectSchema = z.object({
  title: z.string().min(1, 'Proje başlığı gereklidir'),
  slug: z.string().min(1, 'Slug gereklidir').regex(/^[a-z0-9-]+$/, 'Slug sadece küçük harf, sayı ve tire içerebilir'),
  description: z.string().optional(),
  status: z.enum(['taslak', 'yayinda', 'arsiv']),
  visible: z.boolean(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface CesiumProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CesiumProjectForm: React.FC<CesiumProjectFormProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      status: 'taslak',
      visible: true,
    },
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const { error } = await supabase
        .from('cesium_projects')
        .insert([{
          title: data.title,
          slug: data.slug,
          description: data.description || null,
          status: data.status,
          visible: data.visible,
        }]);

      if (error) throw error;

      toast.success('Cesium projesi başarıyla oluşturuldu');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Proje oluşturulurken hata:', error);
      toast.error('Proje oluşturulamadı');
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    form.setValue('title', value);
    if (!form.getValues('slug')) {
      form.setValue('slug', generateSlug(value));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yeni Cesium Projesi</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proje Başlığı</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Proje başlığını girin"
                      {...field}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="proje-url-adresi"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama (İsteğe bağlı)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Proje hakkında kısa açıklama"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durum</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Proje durumunu seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="taslak">Taslak</SelectItem>
                      <SelectItem value="yayinda">Yayında</SelectItem>
                      <SelectItem value="arsiv">Arşiv</SelectItem>
                    </SelectContent>
                  </Select>
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
                    <FormLabel>Görünürlük</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Proje ana sayfada görüntülensin mi?
                    </div>
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

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit">
                Proje Oluştur
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CesiumProjectForm;
