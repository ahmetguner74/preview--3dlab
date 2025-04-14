
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Yeni bileşenleri import et
import ProjectHeader from '@/components/project-detail/ProjectHeader';
import ProjectMainImage from '@/components/project-detail/ProjectMainImage';
import ProjectDescription from '@/components/project-detail/ProjectDescription';
import ProjectGallery from '@/components/project-detail/ProjectGallery';
import ProjectBeforeAfter from '@/components/project-detail/ProjectBeforeAfter';
import ProjectVideo from '@/components/project-detail/ProjectVideo';
import ProjectThreeDModel from '@/components/project-detail/ProjectThreeDModel';
import ProjectPointCloud from '@/components/project-detail/ProjectPointCloud';
import ProjectSimilar from '@/components/project-detail/ProjectSimilar';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
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
        
        // Resim verilerini yükle
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
        
        // Video verilerini yükle
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
        
        // 3D model verilerini yükle
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

  // Model seçim işleyicileri
  const handleThreeDModelSelect = (modelUrl: string) => {
    setModels(prev => {
      const newModels = [...prev];
      const selectedModel = newModels.find(m => m.url === modelUrl && m.type === '3d_model');
      const otherModels = newModels.filter(m => m.url !== modelUrl || m.type !== '3d_model');
      
      if (selectedModel) {
        return [selectedModel, ...otherModels];
      }
      return newModels;
    });
  };
  
  const handlePointCloudSelect = (modelUrl: string) => {
    setModels(prev => {
      const newModels = [...prev];
      const selectedModel = newModels.find(m => m.url === modelUrl && m.type === 'point_cloud');
      const otherModels = newModels.filter(m => m.url !== modelUrl || m.type !== 'point_cloud');
      
      if (selectedModel) {
        return [selectedModel, ...otherModels];
      }
      return newModels;
    });
  };
  
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

  // Veri hazırlama
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
  
  const activePointCloud = pointCloudModels.length > 0 
    ? pointCloudModels[0].url 
    : 'https://potree.github.io/potree/examples/clipping_volume.html';

  return (
    <Layout>
      <section className="pt-16 md:pt-24">
        <div className="arch-container">
          <ProjectHeader project={project} />
          
          <ProjectMainImage imageUrl={mainImage} title={project.title} />
          
          <ProjectDescription project={project} />
          
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
                <ProjectGallery 
                  images={images} 
                  title={project.title}
                  mainImage={mainImage} 
                />
              </TabsContent>
              
              {beforeImage && afterImage && (
                <TabsContent value="before-after">
                  <ProjectBeforeAfter 
                    beforeImageUrl={beforeImageUrl}
                    afterImageUrl={afterImageUrl}
                    title={project.title}
                  />
                </TabsContent>
              )}
              
              {videos.length > 0 && (
                <TabsContent value="video">
                  <ProjectVideo videoUrl={videoUrl} />
                </TabsContent>
              )}
              
              {threeDModels.length > 0 && (
                <TabsContent value="3d-model">
                  <ProjectThreeDModel 
                    models={threeDModels}
                    activeModelUrl={activeThreeDModel}
                    onModelSelect={handleThreeDModelSelect}
                  />
                </TabsContent>
              )}
              
              {pointCloudModels.length > 0 && (
                <TabsContent value="point-cloud">
                  <ProjectPointCloud
                    models={pointCloudModels}
                    activePointCloudUrl={activePointCloud}
                    onPointCloudSelect={handlePointCloudSelect}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <ProjectSimilar title={project.title} />
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
