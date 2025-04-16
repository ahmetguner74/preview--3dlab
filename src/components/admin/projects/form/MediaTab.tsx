
import React, { useState, useCallback } from 'react';
import { ProjectImage, ProjectVideo } from '@/types/project';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { 
  uploadProjectImage, 
  addProjectVideo, 
  getProjectImages, 
  getProjectVideos 
} from '@/utils/mediaHelpers';
import { Button } from "@/components/ui/button";
import { 
  Image, 
  Video, 
  X, 
  ExternalLink, 
  Plus, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  GalleryHorizontal
} from 'lucide-react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImagePreviewDialog from '@/components/admin/ImagePreviewDialog';
import { Input } from '@/components/ui/input';

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
  const [activeMediaTab, setActiveMediaTab] = useState<string>('thumbnail');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');

  // Medya yükleyici işlevleri
  const handleImagesUpdated = useCallback(async () => {
    if (projectId) {
      const images = await getProjectImages(projectId);
      setProjectImages(images as ProjectImage[]);
    }
  }, [projectId, setProjectImages]);

  const handleVideosUpdated = useCallback(async () => {
    if (projectId) {
      const videos = await getProjectVideos(projectId);
      setProjectVideos(videos as ProjectVideo[]);
    }
  }, [projectId, setProjectVideos]);

  const handleThumbnailUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, 'main');
      
      if (imageUrl) {
        onThumbnailUpdated(imageUrl);
        toast.success('Proje kapak görseli yüklendi');
        await handleImagesUpdated();
      }
    } catch (error) {
      console.error('Kapak görseli yükleme hatası:', error);
      toast.error('Kapak görseli yüklenemedi');
    }
  };

  const handleGalleryImageUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, 'gallery');
      if (imageUrl) {
        toast.success('Galeri görseli başarıyla yüklendi');
        await handleImagesUpdated();
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    }
  };

  const handleBeforeAfterImageUpload = async (file: File, type: 'before' | 'after') => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, projectId!, type);
      if (imageUrl) {
        toast.success(`${type === 'before' ? 'Öncesi' : 'Sonrası'} görseli başarıyla yüklendi`);
        await handleImagesUpdated();
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error);
      toast.error('Görsel yüklenemedi');
    }
  };

  const handleVideoAdd = async () => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    if (!videoUrl || !videoUrl.trim()) {
      toast.error('Lütfen geçerli bir video URL\'si girin');
      return;
    }
    
    try {
      const success = await addProjectVideo(videoUrl, projectId!);
      if (success) {
        toast.success('Video başarıyla eklendi');
        setVideoUrl('');
        await handleVideosUpdated();
      } else {
        toast.error('Video eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Video ekleme hatası:', error);
      toast.error('Video eklenemedi');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      toast.success('Görsel başarıyla silindi');
      await handleImagesUpdated();
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
      toast.success('Video başarıyla silindi');
      await handleVideosUpdated();
    } catch (error) {
      console.error('Video silinirken hata:', error);
      toast.error('Video silinirken bir hata oluştu');
    }
  };

  const openPreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsPreviewOpen(true);
  };

  // Görsel filtreleme yardımcı fonksiyonları
  const galleryImages = projectImages.filter(img => img.image_type === 'gallery');
  const beforeImages = projectImages.filter(img => img.image_type === 'before');
  const afterImages = projectImages.filter(img => img.image_type === 'after');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-md shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
          <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
        </div>
        
        <Tabs defaultValue="thumbnail" value={activeMediaTab} onValueChange={setActiveMediaTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="thumbnail" className="flex items-center gap-2">
              <Image size={16} /> Kapak
            </TabsTrigger>
            <TabsTrigger value="gallery" className="flex items-center gap-2">
              <GalleryHorizontal size={16} /> Galeri
            </TabsTrigger>
            <TabsTrigger value="before-after" className="flex items-center gap-2">
              <ChevronLeft size={16} /><ChevronRight size={16} /> Öncesi/Sonrası
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video size={16} /> Videolar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="thumbnail" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Proje Kapak Görseli</CardTitle>
                <CardDescription>Ana sayfada ve proje listelerinde kullanılacak görsel</CardDescription>
              </CardHeader>
              <CardContent>
                {thumbnail ? (
                  <div className="mb-4 relative">
                    <div 
                      className="aspect-video bg-gray-100 rounded overflow-hidden cursor-pointer"
                      onClick={() => openPreview(thumbnail)}
                    >
                      <img 
                        src={thumbnail} 
                        alt="Kapak görseli" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button 
                        variant="secondary" 
                        size="icon" 
                        className="bg-white/80 backdrop-blur-sm hover:bg-white"
                        onClick={() => openPreview(thumbnail)}
                      >
                        <Eye size={16} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 border-2 border-dashed rounded-md p-8 text-center transition-colors border-gray-300">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Kapak Görseli Yok</h3>
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP formatları desteklenir.</p>
                  </div>
                )}
                
                <FileUploadBox 
                  onFileSelected={handleThumbnailUpload}
                  title="Kapak Görseli Yükle"
                  description="PNG, JPG, WEBP formatları desteklenir. Maksimum 5MB."
                  icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                  allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gallery" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Proje Galeri Görselleri</CardTitle>
                <CardDescription>Projeye ait görseller, detay sayfasında sergilenecektir</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FileUploadBox 
                  onFileSelected={handleGalleryImageUpload}
                  title="Galeri Görseli Ekle"
                  description="Birden fazla görsel ekleyebilirsiniz. PNG, JPG, WEBP formatları desteklenir."
                  icon={<GalleryHorizontal className="mx-auto h-12 w-12 text-gray-400" />}
                  allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                />
                
                {galleryImages.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {galleryImages.map(img => (
                      <div key={img.id} className="relative group aspect-square overflow-hidden">
                        <img 
                          src={img.image_url} 
                          alt="Galeri görseli" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <div className="flex gap-2">
                            <Button 
                              variant="secondary" 
                              size="icon" 
                              className="h-8 w-8 bg-white/80"
                              onClick={() => openPreview(img.image_url)}
                            >
                              <Eye size={14} />
                            </Button>
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
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <p>Henüz galeri görseli eklenmemiş</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="before-after" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Öncesi / Sonrası Görselleri</CardTitle>
                <CardDescription>Projenin önceki ve sonraki halini karşılaştırmak için görseller</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Öncesi Görseli */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Öncesi Görseli</h3>
                    {beforeImages.length > 0 ? (
                      <div className="relative aspect-video">
                        <img 
                          src={beforeImages[0].image_url} 
                          alt="Öncesi görseli" 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-white/80 backdrop-blur-sm hover:bg-white"
                            onClick={() => openPreview(beforeImages[0].image_url)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteImage(beforeImages[0].id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video border-2 border-dashed rounded-md flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Henüz görsel yok</p>
                      </div>
                    )}
                    <FileUploadBox 
                      onFileSelected={(file) => handleBeforeAfterImageUpload(file, 'before')}
                      title="Öncesi Görseli Yükle"
                      description="Önceki durumu gösteren görsel"
                      icon={<ChevronLeft className="mx-auto h-12 w-12 text-gray-400" />}
                      allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                    />
                  </div>
                  
                  {/* Sonrası Görseli */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Sonrası Görseli</h3>
                    {afterImages.length > 0 ? (
                      <div className="relative aspect-video">
                        <img 
                          src={afterImages[0].image_url} 
                          alt="Sonrası görseli" 
                          className="w-full h-full object-cover rounded-md"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <Button 
                            variant="secondary" 
                            size="icon" 
                            className="bg-white/80 backdrop-blur-sm hover:bg-white"
                            onClick={() => openPreview(afterImages[0].image_url)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteImage(afterImages[0].id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="aspect-video border-2 border-dashed rounded-md flex items-center justify-center">
                        <p className="text-gray-500 text-sm">Henüz görsel yok</p>
                      </div>
                    )}
                    <FileUploadBox 
                      onFileSelected={(file) => handleBeforeAfterImageUpload(file, 'after')}
                      title="Sonrası Görseli Yükle"
                      description="Mevcut durumu gösteren görsel"
                      icon={<ChevronRight className="mx-auto h-12 w-12 text-gray-400" />}
                      allowedTypes={['jpg', 'jpeg', 'png', 'webp']}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="videos" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Proje Videoları</CardTitle>
                <CardDescription>YouTube veya Vimeo video bağlantıları ekleyebilirsiniz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="YouTube veya Vimeo video linki girin"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleVideoAdd} disabled={!videoUrl.trim()}>
                    <Plus size={16} className="mr-1" /> Ekle
                  </Button>
                </div>
                
                {projectVideos.length > 0 ? (
                  <div className="space-y-4">
                    {projectVideos.map(video => (
                      <div key={video.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Video className="text-gray-400" size={20} />
                          <span className="text-sm font-medium truncate max-w-[300px]">
                            {video.video_url}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => window.open(video.video_url, '_blank')}
                          >
                            <ExternalLink size={14} className="mr-1" /> Görüntüle
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <X size={14} className="mr-1" /> Sil
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border-2 border-dashed rounded-md">
                    <Video className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Video Yok</h3>
                    <p className="mt-1 text-xs text-gray-500">Yukarıdaki alandan video ekleyebilirsiniz</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ImagePreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        imageUrl={previewImage}
      />
    </div>
  );
};

export default MediaTab;
