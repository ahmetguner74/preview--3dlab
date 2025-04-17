
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { MoveHorizontal } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProjectBeforeAfterProps {
  beforeImageUrl: string;
  afterImageUrl: string;
  title: string;
}

const ProjectBeforeAfter: React.FC<ProjectBeforeAfterProps> = ({ beforeImageUrl, afterImageUrl, title }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const isMobile = useIsMobile();
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Container */}
      <div className="relative w-full h-full">
        {/* Öncesi Görsel */}
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={beforeImageUrl} 
            alt={`${title} - Öncesi`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Sonrası Görsel (Kaydırılabilir) */}
        <div 
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
        >
          <img 
            src={afterImageUrl}
            alt={`${title} - Sonrası`}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dikey Slider */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="relative h-full w-0.5 flex items-center">
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center pointer-events-auto">
              <MoveHorizontal className="text-gray-600" size={20} />
            </div>
          </div>
        </div>
        
        {/* Slider Kontrolü */}
        <div className={`absolute ${isMobile ? 'bottom-6 px-6' : 'right-6'} w-${isMobile ? 'full' : '32'} ${isMobile ? '' : 'h-full'} pointer-events-none`}>
          <div className={`relative ${isMobile ? '' : 'h-full'} flex ${isMobile ? '' : 'items-center'}`}>
            <Slider
              value={[sliderValue]}
              onValueChange={handleSliderChange}
              min={0}
              max={100}
              step={0.1}
              className={`pointer-events-auto ${isMobile ? 'w-full' : 'h-full'}`}
              orientation={isMobile ? "horizontal" : "vertical"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBeforeAfter;
