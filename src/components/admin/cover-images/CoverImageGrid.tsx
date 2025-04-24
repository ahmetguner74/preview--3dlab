
import React from 'react';
import { Loader2 } from 'lucide-react';
import { CoverImage } from '@/api/coverImagesApi';
import CoverImageSection from './CoverImageSection';

interface CoverImageGridProps {
  loading: boolean;
  coverImages: CoverImage[];
  onImageClick: (url: string) => void;
  onFileSelected: (file: File, imageKey: string) => Promise<void>;
  onYoutubeLinkChange: (link: string, imageKey: string) => void;
  onSettingsChange: (settings: any, imageKey: string) => void;
}

const CoverImageGrid: React.FC<CoverImageGridProps> = ({
  loading,
  coverImages,
  onImageClick,
  onFileSelected,
  onYoutubeLinkChange,
  onSettingsChange
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 size={36} className="animate-spin text-arch-black" />
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <CoverImageSection 
        imageKey="hero_background"
        title="Ana Sayfa Arkaplan Görseli"
        description="Ana sayfada üst bölümde görünen arkaplan resmi"
        imageUrl={coverImages.find(img => img.image_key === 'hero_background')?.image_url}
        updatedAt={coverImages.find(img => img.image_key === 'hero_background')?.updated_at}
        settings={coverImages.find(img => img.image_key === 'hero_background')?.settings}
        onImageClick={onImageClick}
        onFileSelected={onFileSelected}
        onSettingsChange={onSettingsChange}
      />
      
      <CoverImageSection 
        imageKey="about_team"
        title="Hakkımızda Ekip Görseli"
        description="Ana sayfada hakkımızda bölümünde görünen ekip resmi"
        imageUrl={coverImages.find(img => img.image_key === 'about_team')?.image_url}
        updatedAt={coverImages.find(img => img.image_key === 'about_team')?.updated_at}
        settings={coverImages.find(img => img.image_key === 'about_team')?.settings}
        onImageClick={onImageClick}
        onFileSelected={onFileSelected}
        onSettingsChange={onSettingsChange}
      />
      
      <CoverImageSection 
        imageKey="featured_projects_cover"
        title="Öne Çıkan Projeler Görseli"
        description="Ana sayfada öne çıkan projeler bölümünde görünen kapak resmi"
        imageUrl={coverImages.find(img => img.image_key === 'featured_projects_cover')?.image_url}
        updatedAt={coverImages.find(img => img.image_key === 'featured_projects_cover')?.updated_at}
        settings={coverImages.find(img => img.image_key === 'featured_projects_cover')?.settings}
        onImageClick={onImageClick}
        onFileSelected={onFileSelected}
        onSettingsChange={onSettingsChange}
      />

      <CoverImageSection
        imageKey="hero_youtube_video"
        title="Ana Sayfa YouTube Video Linki"
        description="Ana sayfanın üstündeki YouTube videosu için YouTube linki veya iframe kodu"
        imageUrl={coverImages.find(img => img.image_key === 'hero_youtube_video')?.image_url}
        updatedAt={coverImages.find(img => img.image_key === 'hero_youtube_video')?.updated_at}
        settings={coverImages.find(img => img.image_key === 'hero_youtube_video')?.settings}
        onImageClick={onImageClick}
        onFileSelected={onFileSelected}
        onYoutubeLinkChange={onYoutubeLinkChange}
        onSettingsChange={onSettingsChange}
      />
    </div>
  );
};

export default CoverImageGrid;
