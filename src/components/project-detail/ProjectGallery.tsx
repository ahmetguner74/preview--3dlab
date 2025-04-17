
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProjectGalleryProps {
  images: {url: string, type: string}[];
  title: string;
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const galleryImages = images.filter(img => img.type === 'gallery');
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };
  
  if (galleryImages.length === 0) {
    return (
      <div className="h-96 bg-arch-light-gray flex items-center justify-center">
        <p className="text-gray-500">Bu proje için galeri görseli bulunmamaktadır.</p>
      </div>
    );
  }
  
  return (
    <div className="grid md:grid-cols-4 gap-6">
      <div className="md:col-span-1 space-y-4">
        <h3 className="text-xl font-display">Proje Galerisi</h3>
        <p className="text-arch-gray text-sm">
          {title}'nin farklı açılardan görüntülerini inceleyebilirsiniz.
        </p>
        {galleryImages.length > 1 && (
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
              {currentImageIndex + 1} / {galleryImages.length}
            </p>
          </>
        )}
      </div>
      <div className="md:col-span-3 h-96 md:h-[500px] bg-arch-light-gray">
        <img 
          src={galleryImages[currentImageIndex].url}
          alt={`${title} - Görsel ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default ProjectGallery;
