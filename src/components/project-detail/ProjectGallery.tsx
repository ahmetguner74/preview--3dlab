
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  images: {url: string, type: string}[];
  title: string;
  mainImage: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images, title, mainImage }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };
  
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h3 className="text-xl font-display">Proje Galerisi</h3>
        <p className="text-arch-gray text-sm">
          {title}'nin farklı açılardan görüntülerini inceleyebilirsiniz.
        </p>
        {images.length > 1 && (
          <>
            <div className="flex gap-2">
              <button 
                onClick={prevImage}
                className="w-12 h-12 flex items-center justify-center border border-arch-black hover:bg-arch-black hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextImage}
                className="w-12 h-12 flex items-center justify-center border border-arch-black hover:bg-arch-black hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-sm">
              {currentImageIndex + 1} / {images.length}
            </p>
          </>
        )}
      </div>
      <div className="md:col-span-3 h-96 md:h-[500px] bg-arch-light-gray">
        <img 
          src={images.length > 0 ? images[currentImageIndex].url : mainImage} 
          alt={`${title} - Görsel ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProjectGallery;
