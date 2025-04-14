import React, { useState } from 'react';
import { Image, Video, X, Plus } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import FileUploadBox from '@/components/admin/FileUploadBox';
import { ProjectImage, ProjectVideo } from '@/types/project';
import { uploadProjectImage, addProjectVideo, getProjectImages, getProjectVideos } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface MediaTabProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectImages: ProjectImage[];
  projectVideos: ProjectVideo[];
  setProjectImages: React.Dispatch<React.SetStateAction<ProjectImage[]>>;
  setProjectVideos: React.Dispatch<React.SetStateAction<ProjectVideo[]>>;
}

const MediaTab: React.FC<MediaTabProps> = ({ 
  projectId, 
  isEditing,
  projectImages,
  projectVideos,
  setProjectImages,
  setProjectVideos
}) => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  const handleImageUpload = async (file: File, imageType: 'main' | 'gallery' | 'before' | 'after' = 'gallery') => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, imageType);
      if (imageUrl) {
        toast.success('Görsel başarıyla yüklendi');
        const images = await getProjectImages(projectId!);
        setProjectImages(images as ProjectImage[]);
      } else {
        toast.error('Görsel yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error);
      toast.error('Görsel yüklenirken bir hata oluştu');
    }
  };

  const handleVideoUrlAdd = async () => {
    if (!videoUrl.trim()) {
      toast.error('Video URL boş olamaz');
      return;
    }
    
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const success = await addProjectVideo(videoUrl, projectId!);
      if (success) {
        toast.success('Video başarıyla eklendi');
        setVideoUrl('');
        const videos = await getProjectVideos(projectId!);
        setProjectVideos(videos as ProjectVideo[]);
      } else {
        toast.error('Video eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Video eklenirken hata:', error);
      toast.error('Video eklenirken bir hata oluştu');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      
      setProjectImages(projectImages.filter(img => img.id !== imageId));
      toast.success('Görsel başarıyla silindi');
    } catch (error) {
      console.error('Görsel silinirken hata:', error);
      toast.error('Görsel silinirken bir hata oluştu');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('project_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      setProjectVideos(projectVideos.filter(video => video.id !== videoId));
      toast.success('Video başarıyla silindi');
    } catch (error) {
      console.error('Video silinirken hata:', error);
      toast.error('Video silinirken bir hata oluştu');
    }
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
        <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-2">Ana Görsel</h3>
          <FileUploadBox 
            onFileSelected={(file) => handleImageUpload(file, 'main')}
            title="Ana Görsel Yükle"
            description="PNG, JPG, GIF formatları desteklenir. Maksimum 5MB."
            icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
            allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
          />

          {projectImages.filter(img => img.image_type === 'main').length > 0 && (
            <div className="mt-4">
              {projectImages
                .filter(img => img.image_type === 'main')
                .map(img => (
                  <div key={img.id} className="relative">
                    <img 
                      src={img.image_url} 
                      alt="Ana görsel" 
                      className="w-full h-48 object-cover rounded-md"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon" 
                      className="absolute top-2 right-2"
                      onClick={() => handleDeleteImage(img.id)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Galeri Görselleri</h3>
          <FileUploadBox 
            onFileSelected={(file) => handleImageUpload(file, 'gallery')}
            title="Görsel Ekle"
            description="Birden fazla görsel ekleyebilirsiniz. Sürükleyerek sıralayabilirsiniz."
            icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
            allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
          />

          {projectImages.filter(img => img.image_type === 'gallery').length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {projectImages
                .filter(img => img.image_type === 'gallery')
                .map(img => (
                  <div key={img.id} className="relative group">
                    <img 
                      src={img.image_url} 
                      alt="Galeri görseli" 
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDeleteImage(img.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Video</h3>
          <div className="flex gap-2 mb-4">
            <Input 
              placeholder="YouTube veya Vimeo video URL'si"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <Button onClick={handleVideoUrlAdd}>
              <Plus size={16} className="mr-1" /> Ekle
            </Button>
          </div>

          {projectVideos.length > 0 && (
            <div className="space-y-2 mt-4">
              {projectVideos.map(video => (
                <div key={video.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center">
                    <Video className="h-5 w-5 mr-2 text-gray-500" />
                    <a 
                      href={video.video_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm truncate max-w-md"
                    >
                      {video.video_url}
                    </a>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteVideo(video.id)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Before/After Görselleri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FileUploadBox 
                onFileSelected={(file) => handleImageUpload(file, 'before')}
                title="Öncesi Görseli"
                description="Önceki durumu gösteren görsel"
                icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                allowedTypes={['jpg', 'jpeg', 'png']}
              />
              
              {projectImages.filter(img => img.image_type === 'before').length > 0 && (
                <div className="mt-4">
                  {projectImages
                    .filter(img => img.image_type === 'before')
                    .map(img => (
                      <div key={img.id} className="relative">
                        <img 
                          src={img.image_url} 
                          alt="Before görseli" 
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            
            <div>
              <FileUploadBox 
                onFileSelected={(file) => handleImageUpload(file, 'after')}
                title="Sonrası Görseli"
                description="Mevcut durumu gösteren görsel"
                icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                allowedTypes={['jpg', 'jpeg', 'png']}
              />
              
              {projectImages.filter(img => img.image_type === 'after').length > 0 && (
                <div className="mt-4">
                  {projectImages
                    .filter(img => img.image_type === 'after')
                    .map(img => (
                      <div key={img.id} className="relative">
                        <img 
                          src={img.image_url} 
                          alt="After görseli" 
                          className="w-full h-32 object-cover rounded-md"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          className="absolute top-2 right-2"
                          onClick={() => handleDeleteImage(img.id)}
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaTab;
