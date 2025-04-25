
import React from 'react';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';

interface PanoramaListProps {
  panoramas: any[];
  onRefresh: () => void;
}

const PanoramaList: React.FC<PanoramaListProps> = ({ panoramas, onRefresh }) => {
  if (!panoramas?.length) {
    return (
      <p className="text-gray-500 my-4">Henüz panorama eklenmemiş.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {panoramas.map((panorama) => (
        <div key={panorama.id} className="border rounded-md p-3">
          <p className="font-medium">{panorama.title}</p>
          <div className="aspect-square bg-gray-100 mt-2 overflow-hidden rounded">
            <img 
              src={panorama.image_url} 
              alt={panorama.title} 
              className="object-cover w-full h-full" 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default PanoramaList;
