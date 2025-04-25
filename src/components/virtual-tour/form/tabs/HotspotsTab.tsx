
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash } from 'lucide-react';
import { Hotspot } from '@/types/virtual-tour';

interface HotspotsTabProps {
  hotspots: Hotspot[];
  newHotspot: Omit<Hotspot, 'id'>;
  setNewHotspot: (hotspot: Omit<Hotspot, 'id'>) => void;
  addHotspot: () => void;
  removeHotspot: (id: string) => void;
}

const HotspotsTab: React.FC<HotspotsTabProps> = ({
  hotspots,
  newHotspot,
  setNewHotspot,
  addHotspot,
  removeHotspot
}) => {
  return (
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
  );
};

export default HotspotsTab;
