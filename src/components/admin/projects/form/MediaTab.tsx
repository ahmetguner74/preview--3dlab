
import React from 'react';
import { ProjectImage, ProjectVideo } from '@/types/project';
import MainImageUploader from './media/MainImageUploader';
import GalleryUploader from './media/GalleryUploader';
import VideoUploader from './media/VideoUploader';
import BeforeAfterUploader from './media/BeforeAfterUploader';
import ThumbnailUploader from './media/ThumbnailUploader';
import { getProjectImages, getProjectVideos } from '@/utils/mediaHelpers';

interface MediaTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  projectVideos: ProjectVideo[];
  setProjectImages: React.Dispatch<React.SetStateAction<ProjectImage[]>>;
  setProjectVideos: React.Dispatch<React.SetStateAction<ProjectVideo[]>>;
  thumbnail?: string;
  onThumbnailUpdated: (thumbnailUrl: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({ 
  projectId, 
  isEditing,
  projectImages,
  projectVideos,
  setProjectImages,
  setProjectVideos,
  thumbnail,
  onThumbnailUpdated
}) => {
  const handleImagesUpdated = async () => {
    if (projectId) {
      const images = await getProjectImages(projectId);
      setProjectImages(images as ProjectImage[]);
    }
  };

  const handleVideosUpdated = async () => {
    if (projectId) {
      const videos = await getProjectVideos(projectId);
      setProjectVideos(videos as ProjectVideo[]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
        <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
      </div>
      
      <div className="space-y-6">
        <ThumbnailUploader
          projectId={projectId}
          isEditing={isEditing}
          thumbnail={thumbnail}
          onThumbnailUpdated={onThumbnailUpdated}
        />

        <MainImageUploader
          projectId={projectId}
          isEditing={isEditing}
          projectImages={projectImages}
          onImagesUpdated={handleImagesUpdated}
        />

        <GalleryUploader
          projectId={projectId}
          isEditing={isEditing}
          projectImages={projectImages}
          onImagesUpdated={handleImagesUpdated}
        />

        <VideoUploader
          projectId={projectId}
          isEditing={isEditing}
          projectVideos={projectVideos}
          onVideosUpdated={handleVideosUpdated}
        />

        <BeforeAfterUploader
          projectId={projectId}
          isEditing={isEditing}
          projectImages={projectImages}
          onImagesUpdated={handleImagesUpdated}
        />
      </div>
    </div>
  );
};

export default MediaTab;
