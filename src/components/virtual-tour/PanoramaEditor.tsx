
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
import { Image, Settings, CircleDot, Plus, Trash } from 'lucide-react';
import { uploadFileToStorage } from '@/utils/fileStorage';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [uploading, setUploading] = useState(false);
  const [initialView, setInitialView] = useState<InitialView>({
    yaw: 0,
    pitch: 0,
    fov: 90
  });
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [newHotspot, setNewHotspot] = useState<Omit<Hotspot, 'id'>>({
    title: '',
    position: { yaw: 0, pitch: 0 },
    hotspot_type: 'info'
  });

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      // panorama görsellerini 'panoramas' bucket'ına yüklüyoruz
      const imageUrl = await uploadFileToStorage(file, 'panoramas');
      if (imageUrl) {
        setImageUrl(imageUrl);
      } else {
        throw new Error('Görsel yükleme başarısız');
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
    } finally {
      setUploading(false);
    }
  };

  const addHotspot = () => {
    if (!newHotspot.title) return;
    
    const hotspot: Hotspot = {
      id: `temp-${Date.now()}`, // Geçici bir ID oluşturuyoruz, gerçek ID veritabanında oluşturulacak
      ...newHotspot
    };
    
    setHotspots([...hotspots, hotspot]);
    setNewHotspot({
      title: '',
      position: { yaw: 0, pitch: 0 },
      hotspot_type: 'info'
    });
  };

  const removeHotspot = (id: string) => {
    setHotspots(hotspots.filter(h => h.id !== id));
  };

  const isFormValid = () => {
    return title.trim() !== '' && imageUrl !== '';
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
              {imageUrl ? (
                <div className="relative">
                  <img 
                    src={imageUrl} 
                    alt={title} 
                    className="w-full h-64 object-cover rounded-md"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="outline" onClick={() => setImageUrl('')}>
                      Görseli Değiştir
                    </Button>
                  </div>
                </div>
              ) : (
                <FileUploadBox
                  onFileSelected={handleImageUpload}
                  title="Panorama Yükle"
                  description="360° panorama görseli yükleyin (equirectangular format)"
                  allowedTypes={['jpg', 'jpeg', 'png']}
                  icon={<Image className="w-12 h-12 mx-auto text-gray-400" />}
                  // İsLoading özelliği FileUploadBoxProps içinde tanımlı değil, kaldırıyorum
                />
              )}
              {uploading && (
                <div className="mt-2 text-sm text-blue-500">Yükleniyor...</div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="view" className="space-y-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Yaw (Yatay Bakış): {initialView.yaw}°</Label>
                  <span className="text-sm text-gray-500">-180° / +180°</span>
                </div>
                <Slider 
                  min={-180}
                  max={180}
                  step={1}
                  value={[initialView.yaw]}
                  onValueChange={(value) => setInitialView({...initialView, yaw: value[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Pitch (Dikey Bakış): {initialView.pitch}°</Label>
                  <span className="text-sm text-gray-500">-90° / +90°</span>
                </div>
                <Slider 
                  min={-90}
                  max={90}
                  step={1}
                  value={[initialView.pitch]}
                  onValueChange={(value) => setInitialView({...initialView, pitch: value[0]})}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>FOV (Görüş Alanı): {initialView.fov}°</Label>
                  <span className="text-sm text-gray-500">30° / 120°</span>
                </div>
                <Slider 
                  min={30}
                  max={120}
                  step={1}
                  value={[initialView.fov]}
                  onValueChange={(value) => setInitialView({...initialView, fov: value[0]})}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hotspots" className="space-y-4">
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Panorama kaydedildikten sonra görsel üzerinde hotspot eklemeyi de kullanabilirsiniz.
                </AlertDescription>
              </Alert>

              <div className="space-y-3 border rounded-md p-4">
                <h3 className="font-medium">Yeni Hotspot Ekle</h3>
                <div className="grid gap-3">
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={newHotspot.title}
                      onChange={(e) => setNewHotspot({...newHotspot, title: e.target.value})}
                      placeholder="Hotspot başlığı"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Yaw (Yatay)</Label>
                      <Input
                        type="number"
                        min={-180}
                        max={180}
                        value={newHotspot.position.yaw}
                        onChange={(e) => setNewHotspot({
                          ...newHotspot, 
                          position: {...newHotspot.position, yaw: Number(e.target.value)}
                        })}
                      />
                    </div>
                    <div>
                      <Label>Pitch (Dikey)</Label>
                      <Input
                        type="number"
                        min={-90}
                        max={90}
                        value={newHotspot.position.pitch}
                        onChange={(e) => setNewHotspot({
                          ...newHotspot, 
                          position: {...newHotspot.position, pitch: Number(e.target.value)}
                        })}
                      />
                    </div>
                  </div>

                  <Button 
                    onClick={addHotspot} 
                    disabled={!newHotspot.title}
                    size="sm"
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Hotspot Ekle
                  </Button>
                </div>
              </div>

              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-3">Mevcut Hotspotlar</h3>
                {hotspots.length === 0 ? (
                  <p className="text-sm text-gray-500">Henüz hotspot eklenmemiş.</p>
                ) : (
                  <ul className="space-y-2">
                    {hotspots.map((hotspot) => (
                      <li key={hotspot.id} className="flex justify-between items-center p-2 border rounded-md">
                        <div className="flex items-center">
                          <span className="font-medium">{hotspot.title}</span>
                          <Badge variant="outline" className="ml-2">
                            Y: {hotspot.position.yaw}° P: {hotspot.position.pitch}°
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeHotspot(hotspot.id)}
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
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
          disabled={!isFormValid()}
        >
          Kaydet
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PanoramaEditor;
