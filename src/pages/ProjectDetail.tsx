import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import ThreeModelViewer from '@/components/viewers/ThreeModelViewer';
import PointCloudViewer from '@/components/viewers/PointCloudViewer';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<{url: string, type: string}[]>([]);
  const [videos, setVideos] = useState<{url: string, thumbnail?: string}[]>([]);
  const [models, setModels] = useState<{url: string, type: string}[]>([]);
  const [beforeImage, setBeforeImage] = useState<string | null>(null);
  const [afterImage, setAfterImage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        
        if (!slug) {
          console.error('Slug bulunamadı');
          return;
        }
        
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .single();
          
        if (projectError) {
          throw projectError;
        }
        
        if (!projectData) {
          console.error('Proje bulunamadı');
          return;
        }
        
        setProject(projectData);
        
        const { data: imageData, error: imageError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true });
          
        if (imageError) {
          console.error('Resimler yüklenirken hata oluştu:', imageError);
        } else {
          const allImages = imageData || [];
          
          setImages(allImages.map(img => ({
            url: img.image_url,
            type: img.image_type
          })));
          
          const beforeImg = allImages.find(img => img.image_type === 'before');
          const afterImg = allImages.find(img => img.image_type === 'after');
          
          if (beforeImg) setBeforeImage(beforeImg.image_url);
          if (afterImg) setAfterImage(afterImg.image_url);
        }
        
        const { data: videoData, error: videoError } = await supabase
          .from('project_videos')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sort_order', { ascending: true });
          
        if (videoError) {
          console.error('Videolar yüklenirken hata oluştu:', videoError);
        } else {
          setVideos((videoData || []).map(video => ({
            url: video.video_url,
            thumbnail: video.thumbnail_url || undefined
          })));
        }
        
        const { data: modelData, error: modelError } = await supabase
          .from('project_3d_models')
          .select('*')
          .eq('project_id', projectData.id);
          
        if (modelError) {
          console.error('3D Modeller yüklenirken hata oluştu:', modelError);
        } else {
          setModels((modelData || []).map(model => ({
            url: model.model_url,
            type: model.model_type
          })));
        }
        
      } catch (error) {
        console.error('Proje detayları yüklenirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [slug]);
  
  if (loading) {
    return (
      <Layout>
        <div className="arch-container py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2">Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="arch-container py-24">
          <h1 className="text-2xl">Proje bulunamadı</h1>
          <Link to="/projects" className="inline-flex items-center mt-4 text-arch-black hover:underline">
            <ArrowLeft size={18} className="mr-2" />
            Projelere dön
          </Link>
        </div>
      </Layout>
    );
  }

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

  const mainImage = images.length > 0 
    ? images[0].url 
    : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070';
    
  const beforeImageUrl = beforeImage || 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2013';
  const afterImageUrl = afterImage || mainImage;
  
  const videoUrl = videos.length > 0 
    ? videos[0].url
    : 'https://player.vimeo.com/video/451913264?autoplay=1&loop=1&muted=1';

  const threeDModels = models.filter(model => model.type === '3d_model');
  const pointCloudModels = models.filter(model => model.type === 'point_cloud');
  
  const activeThreeDModel = threeDModels.length > 0 ? threeDModels[0].url : null;
  const activePointCloud = pointCloudModels.length > 0 ? pointCloudModels[0].url : null;

  return (
    <Layout>
      <section className="pt-16 md:pt-24">
        <div className="arch-container">
          <h1 className="text-3xl md:text-5xl font-display font-light mb-6">{project.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-16">
            <p className="text-arch-gray">{project.category || 'Kategori Belirtilmemiş'}</p>
            <p className="text-arch-gray">•</p>
            <p className="text-arch-gray">{project.location || 'Konum Belirtilmemiş'}</p>
            <p className="text-arch-gray">•</p>
            <p className="text-arch-gray">{project.year || 'Yıl Belirtilmemiş'}</p>
          </div>
          
          <div className="w-full h-96 md:h-[600px] mb-16 bg-arch-light-gray">
            <img 
              src={mainImage} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="md:col-span-2">
              <h2 className="text-xl md:text-2xl font-display mb-6">Proje Hakkında</h2>
              <p className="text-arch-gray">
                {project.description || 'Bu proje için henüz bir açıklama girilmemiş.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Müşteri</h3>
                <p>{project.client || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Alan</h3>
                <p>{project.area || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Yıl</h3>
                <p>{project.year || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Mimar</h3>
                <p>{project.architect || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="mb-16">
            <Tabs defaultValue="photos">
              <TabsList className="border-b border-gray-200 w-full justify-start space-x-8 mb-8">
                <TabsTrigger 
                  value="photos"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                >
                  Galeri
                </TabsTrigger>
                {beforeImage && afterImage && (
                  <TabsTrigger 
                    value="before-after"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                  >
                    Öncesi/Sonrası
                  </TabsTrigger>
                )}
                {videos.length > 0 && (
                  <TabsTrigger 
                    value="video"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                  >
                    Video
                  </TabsTrigger>
                )}
                {threeDModels.length > 0 && (
                  <TabsTrigger 
                    value="3d-model"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                  >
                    3D Model
                  </TabsTrigger>
                )}
                {pointCloudModels.length > 0 && (
                  <TabsTrigger 
                    value="point-cloud"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                  >
                    Nokta Bulutu
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="photos">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xl font-display">Proje Galerisi</h3>
                    <p className="text-arch-gray text-sm">
                      {project.title}'nin farklı açılardan görüntülerini inceleyebilirsiniz.
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
                      alt={`${project.title} - Görsel ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {beforeImage && afterImage && (
                <TabsContent value="before-after">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-display">Öncesi</h3>
                      <div className="h-80 bg-arch-light-gray">
                        <img 
                          src={beforeImageUrl}
                          alt={`${project.title} - Öncesi`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-display">Sonrası</h3>
                      <div className="h-80 bg-arch-light-gray">
                        <img 
                          src={afterImageUrl}
                          alt={`${project.title} - Sonrası`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              )}
              
              {videos.length > 0 && (
                <TabsContent value="video">
                  <div className="aspect-w-16 aspect-h-9">
                    <iframe 
                      src={videoUrl}
                      frameBorder="0" 
                      allow="autoplay; fullscreen" 
                      allowFullScreen
                      className="w-full h-[500px]"
                    ></iframe>
                  </div>
                </TabsContent>
              )}
              
              {threeDModels.length > 0 && (
                <TabsContent value="3d-model">
                  <div className="h-[500px] bg-arch-light-gray">
                    {activeThreeDModel ? (
                      <ThreeModelViewer modelUrl={activeThreeDModel} backgroundColor="#f5f5f5" />
                    ) : (
                      <div className="flex items-center justify-center h-full text-arch-gray">
                        3D model bulunamadı
                      </div>
                    )}
                  </div>
                  
                  {threeDModels.length > 1 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Diğer 3D Modeller</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {threeDModels.map((model, idx) => (
                          <div key={idx} className="p-4 border rounded hover:bg-gray-50 cursor-pointer">
                            <p className="truncate text-sm">{model.url.split('/').pop()}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              )}
              
              {pointCloudModels.length > 0 && (
                <TabsContent value="point-cloud">
                  <PointCloudViewer pointCloudUrl={activePointCloud || ''} />
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-display mb-8">Benzer Projeler</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-64 bg-arch-light-gray">
                  <img 
                    src={`https://images.unsplash.com/photo-${1600607000000 + item * 100}-4e2a09cf159d?q=80&w=2070`}
                    alt={`Benzer proje ${item}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
