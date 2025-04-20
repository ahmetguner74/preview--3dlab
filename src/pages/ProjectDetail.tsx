import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';

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
import { useTranslation } from 'react-i18next';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { project, loading, images, videos, models, beforeImage, afterImage } = useProjectData(slug);
  const { handleThreeDModelSelect, handlePointCloudSelect } = useMediaSelectors();
  const { t } = useTranslation();

  if (loading) {
    return (
      <Layout>
        <div className="arch-container py-24 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-2">{t("Loading") || "Yükleniyor..."}</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="arch-container py-24">
          <h1 className="text-2xl">{t("Page not found")}</h1>
          <Link to="/projects" className="inline-flex items-center mt-4 text-arch-black hover:underline">
            <ArrowLeft size={18} className="mr-2" />
            {t("Projects")}
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
        <div className="arch-container max-w-5xl px-2 sm:px-4 mx-auto"> 
          <div className="relative h-[300px] md:h-[400px] mb-12 rounded-lg overflow-hidden">
            <img
              src={project.thumbnail || mainImage}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <h1 className="text-4xl font-display font-light text-white">{project.title}</h1>
              <div className="flex items-center gap-4 text-white text-lg">
                <span>{project.category || t("Category not set")}</span>
                <span>•</span>
                <span>{project.location || t("Location not set")}</span>
                <span>•</span>
                <span>{project.year || t("Year not set")}</span>
              </div>
            </div>
          </div>

          <ProjectHeader project={project} />
          <ProjectDescription project={project} />

          <div className="mb-16">
            <h2 className="text-2xl font-display mb-6">{t("Gallery")}</h2>
            <ProjectGallery images={images} title={project.title} />
          </div>

          {beforeImage && afterImage && (
            <div className="mb-16">
              <h2 className="text-2xl font-display mb-6">{t("Before / After")}</h2>
              <ProjectBeforeAfter
                beforeImageUrl={beforeImageUrl}
                afterImageUrl={afterImageUrl}
                title={project.title}
              />
            </div>
          )}

          {hasVideos && (
            <div className="mb-16">
              <h2 className="text-2xl font-display mb-6">{t("Video")}</h2>
              <ProjectVideo videoUrl={videoUrl} />
            </div>
          )}

          {threeDModels.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-display mb-6">{t("3D Model")}</h2>
              <ProjectThreeDModel
                models={threeDModels}
                activeModelUrl={activeThreeDModel}
                onModelSelect={(modelUrl) => handleThreeDModelSelect(models, modelUrl)}
              />
            </div>
          )}

          {pointCloudModels.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-display mb-6">{t("Point Cloud")}</h2>
              <ProjectPointCloud
                models={pointCloudModels}
                activePointCloudUrl={activePointCloud}
                onPointCloudSelect={(modelUrl) => handlePointCloudSelect(models, modelUrl)}
              />
            </div>
          )}

          <ProjectSimilar title={project.title} projectId={project.id} />
        </div>
      </section>
    </Layout>
  );
};

export default ProjectDetail;
