
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUploadBox from '../admin/FileUploadBox';
import { Hotspot, InitialView, Position } from '@/types/virtual-tour';
import { Image, Settings, CircleDot } from 'lucide-react';

interface PanoramaEditorProps {
  onSave: (data: {
    title: string;
    image_url: string;
    initial_view: InitialView;
    hotspots: Hotspot[];
  }) => void;
}

const PanoramaEditor: React.FC<PanoramaEditorProps> = ({ onSave }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [initialView, setInitialView] = useState<InitialView>({
    yaw: 0,
    pitch: 0,
    fov: 90
  });
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      // Görsel yükleme işlemi burada yapılacak
      setImageUrl('temp-url');
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Panorama Düzenle</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">
              <Settings className="w-4 h-4 mr-2" />
              Genel
            </TabsTrigger>
            <TabsTrigger value="view">
              <Image className="w-4 h-4 mr-2" />
              Görünüm
            </TabsTrigger>
            <TabsTrigger value="hotspots">
              <CircleDot className="w-4 h-4 mr-2" />
              Hotspotlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Panorama başlığı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Panorama Görseli</label>
              <FileUploadBox
                onFileSelected={handleImageUpload}
                title="Panorama Yükle"
                description="360° panorama görseli yükleyin"
                allowedTypes={['jpg', 'jpeg', 'png']}
                icon={<Image className="w-12 h-12 mx-auto text-gray-400" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Yaw (°)</label>
                <Input
                  type="number"
                  value={initialView.yaw}
                  onChange={(e) => setInitialView({
                    ...initialView,
                    yaw: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pitch (°)</label>
                <Input
                  type="number"
                  value={initialView.pitch}
                  onChange={(e) => setInitialView({
                    ...initialView,
                    pitch: Number(e.target.value)
                  })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">FOV (°)</label>
                <Input
                  type="number"
                  value={initialView.fov}
                  onChange={(e) => setInitialView({
                    ...initialView,
                    fov: Number(e.target.value)
                  })}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotspots">
            {/* Hotspot yönetimi sonraki adımda eklenecek */}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button
          variant="secondary" 
          onClick={() => {
            setTitle('');
            setImageUrl('');
            setInitialView({ yaw: 0, pitch: 0, fov: 90 });
            setHotspots([]);
          }}
        >
          Sıfırla
        </Button>
        <Button 
          onClick={() => onSave({
            title,
            image_url: imageUrl,
            initial_view: initialView,
            hotspots
          })}
        >
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PanoramaEditor;
