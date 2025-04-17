
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import ProjectHeader from '@/components/project-detail/ProjectHeader';
import ProjectDescription from '@/components/project-detail/ProjectDescription';
import ProjectGallery from '@/components/project-detail/ProjectGallery';
import ProjectBeforeAfter from '@/components/project-detail/ProjectBeforeAfter';
import ProjectVideo from '@/components/project-detail/ProjectVideo';
import ProjectThreeDModel from '@/components/project-detail/ProjectThreeDModel';
import ProjectPointCloud from '@/components/project-detail/ProjectPointCloud';
import ProjectSimilar from '@/components/project-detail/ProjectSimilar';
import { useProjectData } from '@/hooks/useProjectData';
import { useMediaSelectors } from '@/hooks/useMediaSelectors';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, images, videos, models, beforeImage, afterImage } = useProjectData(slug);
  const { handleThreeDModelSelect, handlePointCloudSelect } = useMediaSelectors();

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

  const mainImage = images.length > 0 
    ? images[0].url 
    : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070';
    
  const beforeImageUrl = beforeImage || 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2013';
  const afterImageUrl = afterImage || mainImage;
  
  const hasVideos = videos && videos.length > 0;
  console.log('Videolar:', videos);
  
  const videoUrl = hasVideos 
    ? videos[0].url
    : '';

  const threeDModels = models.filter(model => model.type === '3d_model');
  const pointCloudModels = models.filter(model => model.type === 'point_cloud');
  
  const activeThreeDModel = threeDModels.length > 0 ? threeDModels[0].url : null;
  const activePointCloud = pointCloudModels.length > 0 
    ? pointCloudModels[0].url 
    : 'https://potree.github.io/potree/examples/clipping_volume.html';

  return (
    <Layout>
      <section>
        <div className="arch-container">
          <ProjectHeader project={project} />
          
          <div className="mb-16">
            <Tabs defaultValue="gallery" className="w-full">
              <TabsList className="border-b border-gray-200 w-full justify-start space-x-8 mb-8 overflow-x-auto flex-nowrap">
                <TabsTrigger 
                  value="gallery"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4 whitespace-nowrap"
                >
                  Galeri
                </TabsTrigger>
                {beforeImage && afterImage && (
                  <TabsTrigger 
                    value="before-after"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4 whitespace-nowrap"
                  >
                    Öncesi/Sonrası
                  </TabsTrigger>
                )}
                {hasVideos && (
                  <TabsTrigger 
                    value="video"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4 whitespace-nowrap"
                  >
                    Video
                  </TabsTrigger>
                )}
                {threeDModels.length > 0 && (
                  <TabsTrigger 
                    value="3d-model"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4 whitespace-nowrap"
                  >
                    3D Model
                  </TabsTrigger>
                )}
                {pointCloudModels.length > 0 && (
                  <TabsTrigger 
                    value="point-cloud"
                    className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4 whitespace-nowrap"
                  >
                    Nokta Bulutu
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="gallery">
                <ProjectGallery 
                  images={images} 
                  title={project.title}
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
              
              {hasVideos && (
                <TabsContent value="video">
                  <ProjectVideo videoUrl={videoUrl} />
                </TabsContent>
              )}
              
              {threeDModels.length > 0 && (
                <TabsContent value="3d-model">
                  <ProjectThreeDModel 
                    models={threeDModels}
                    activeModelUrl={activeThreeDModel}
                    onModelSelect={(modelUrl) => handleThreeDModelSelect(models, modelUrl)}
                  />
                </TabsContent>
              )}
              
              {pointCloudModels.length > 0 && (
                <TabsContent value="point-cloud">
                  <ProjectPointCloud
                    models={pointCloudModels}
                    activePointCloudUrl={activePointCloud}
                    onPointCloudSelect={(modelUrl) => handlePointCloudSelect(models, modelUrl)}
                  />
                </TabsContent>
              )}
            </Tabs>
          </div>
          
          <ProjectDescription project={project} />
          <ProjectSimilar title={project.title} projectId={project.id} />
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
