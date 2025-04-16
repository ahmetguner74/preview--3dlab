
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Image } from 'lucide-react';

export const CoverImagesMenuItem = () => {
  const location = useLocation();
  const isActive = location.pathname.includes('/admin/cover-images');
  
  return (
    <Link 
      to="/admin/cover-images" 
      className={`flex items-center gap-2 px-4 py-2 text-sm ${
        isActive 
          ? 'bg-arch-black text-white' 
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Image size={18} />
      <span>Kapak Görselleri</span>
    </Link>
  );
};

export default CoverImagesMenuItem;
