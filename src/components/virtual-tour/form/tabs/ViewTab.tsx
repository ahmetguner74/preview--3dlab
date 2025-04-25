
import React from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { InitialView } from '@/types/virtual-tour';

interface ViewTabProps {
  initialView: InitialView;
  setInitialView: (view: InitialView) => void;
}

const ViewTab: React.FC<ViewTabProps> = ({ initialView, setInitialView }) => {
  return (
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
  );
};

export default ViewTab;
