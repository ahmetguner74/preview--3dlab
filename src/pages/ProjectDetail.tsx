
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// This will come from Supabase in the real implementation
const projectDetails = {
  'modern-residence': {
    id: 1,
    title: 'Modern Residence',
    location: 'New York',
    category: 'Residential',
    year: '2023',
    client: 'Private Client',
    area: '450 sqm',
    architect: 'Lead Architect Name',
    description: 'This modern residential project harmoniously integrates with its surroundings while providing a sleek, contemporary living space. The design emphasizes open spaces, natural light, and sustainable materials.',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2070',
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=2070',
    ],
    beforeImage: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?q=80&w=2013',
    afterImage: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070',
    videoUrl: 'https://player.vimeo.com/video/451913264?autoplay=1&loop=1&muted=1'
  }
};

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const project = slug ? projectDetails[slug as keyof typeof projectDetails] : undefined;
  
  if (!project) {
    return (
      <Layout>
        <div className="arch-container py-24">
          <h1 className="text-2xl">Project not found</h1>
        </div>
      </Layout>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.images.length - 1 : prev - 1
    );
  };

  return (
    <Layout>
      <section className="pt-16 md:pt-24">
        <div className="arch-container">
          <h1 className="text-3xl md:text-5xl font-display font-light mb-6">{project.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 mb-16">
            <p className="text-arch-gray">{project.category}</p>
            <p className="text-arch-gray">•</p>
            <p className="text-arch-gray">{project.location}</p>
            <p className="text-arch-gray">•</p>
            <p className="text-arch-gray">{project.year}</p>
          </div>
          
          <div className="w-full h-96 md:h-[600px] mb-16 bg-arch-light-gray">
            <img 
              src={project.images[0]} 
              alt={project.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="md:col-span-2">
              <h2 className="text-xl md:text-2xl font-display mb-6">About the Project</h2>
              <p className="text-arch-gray">
                {project.description}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Client</h3>
                <p>{project.client}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Area</h3>
                <p>{project.area}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Year</h3>
                <p>{project.year}</p>
              </div>
              <div>
                <h3 className="text-sm uppercase text-arch-gray">Architect</h3>
                <p>{project.architect}</p>
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
                  Gallery
                </TabsTrigger>
                <TabsTrigger 
                  value="before-after"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                >
                  Before/After
                </TabsTrigger>
                <TabsTrigger 
                  value="video"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                >
                  Video
                </TabsTrigger>
                <TabsTrigger 
                  value="3d-model"
                  className="data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-4"
                >
                  3D Model
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="photos">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="md:col-span-1 space-y-4">
                    <h3 className="text-xl font-display">Project Gallery</h3>
                    <p className="text-arch-gray text-sm">
                      Browse through the images to see different aspects of the {project.title}.
                    </p>
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
                      {currentImageIndex + 1} / {project.images.length}
                    </p>
                  </div>
                  <div className="md:col-span-3 h-96 md:h-[500px] bg-arch-light-gray">
                    <img 
                      src={project.images[currentImageIndex]} 
                      alt={`${project.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="before-after">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-display">Before</h3>
                    <div className="h-80 bg-arch-light-gray">
                      <img 
                        src={project.beforeImage}
                        alt={`${project.title} - Before`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-display">After</h3>
                    <div className="h-80 bg-arch-light-gray">
                      <img 
                        src={project.afterImage}
                        alt={`${project.title} - After`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="video">
                <div className="aspect-w-16 aspect-h-9">
                  <iframe 
                    src={project.videoUrl}
                    frameBorder="0" 
                    allow="autoplay; fullscreen" 
                    allowFullScreen
                    className="w-full h-[500px]"
                  ></iframe>
                </div>
              </TabsContent>
              
              <TabsContent value="3d-model">
                <div className="flex items-center justify-center h-[500px] bg-arch-light-gray">
                  <p className="text-arch-gray">
                    3D Model Viewer would be implemented here with Three.js integration
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-2xl font-display mb-8">Similar Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-64 bg-arch-light-gray">
                  <img 
                    src={`https://images.unsplash.com/photo-${1600607000000 + item * 100}-4e2a09cf159d?q=80&w=2070`}
                    alt={`Similar project ${item}`}
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
