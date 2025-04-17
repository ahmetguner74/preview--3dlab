
import React, { useState, useEffect, useRef } from 'react';
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
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
  };
  
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDrag = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const containerWidth = rect.width;
    
    // Sınırları kontrol et
    let newValue = (x / containerWidth) * 100;
    newValue = Math.max(0, Math.min(100, newValue));
    
    setSliderValue(newValue);
  };
  
  const handleMouseMove = (e: MouseEvent) => {
    handleDrag(e.clientX);
  };
  
  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches[0]) {
      handleDrag(e.touches[0].clientX);
    }
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
  };
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleDragEnd);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging]);

  return (
    <div className="relative h-[600px] overflow-hidden" ref={containerRef}>
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
        
        {/* Dikey Slider Çizgisi */}
        <div 
          className="absolute inset-y-0 bg-white/50 backdrop-blur-sm w-0.5"
          style={{ left: `${sliderValue}%` }}
        />
        
        {/* Sürükleme Kontrolü - Ortadaki Buton */}
        <div 
          ref={handleRef}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-10 cursor-grab active:cursor-grabbing"
          style={{ left: `${sliderValue}%` }}
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
        >
          <MoveHorizontal className="text-gray-600" size={20} />
        </div>
        
        {/* Yardımcı Slider Kontrolü */}
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
