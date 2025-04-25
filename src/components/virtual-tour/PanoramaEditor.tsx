
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Hotspot, InitialView } from '@/types/virtual-tour';
import { Settings, Image, CircleDot } from 'lucide-react';
import GeneralTab from './form/tabs/GeneralTab';
import ViewTab from './form/tabs/ViewTab';
import HotspotsTab from './form/tabs/HotspotsTab';

interface PanoramaEditorProps {
  tourId?: string;
  onSave: (data: {
    title: string;
    image_url: string;
    initial_view: InitialView;
    hotspots: Hotspot[];
  }) => void;
}

const PanoramaEditor: React.FC<PanoramaEditorProps> = ({ tourId, onSave }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
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

  const addHotspot = () => {
    if (!newHotspot.title) return;
    
    const hotspot: Hotspot = {
      id: `temp-${Date.now()}`,
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

          <TabsContent value="general">
            <GeneralTab
              title={title}
              setTitle={setTitle}
              tourId={tourId}
              onUploadComplete={() => {
                window.location.reload();
              }}
            />
          </TabsContent>

          <TabsContent value="view">
            <ViewTab
              initialView={initialView}
              setInitialView={setInitialView}
            />
          </TabsContent>

          <TabsContent value="hotspots">
            <HotspotsTab
              hotspots={hotspots}
              newHotspot={newHotspot}
              setNewHotspot={setNewHotspot}
              addHotspot={addHotspot}
              removeHotspot={removeHotspot}
            />
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
