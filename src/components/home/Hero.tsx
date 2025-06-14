import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useTranslation } from 'react-i18next';

const Hero = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const { data: heroData, error: heroError } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('image_type', 'hero')
        .order('sort_order');

      if (!heroError && heroData) {
        const images = heroData.map(item => item.image_url);
        if (images.length > 0) {
          setHeroImages(images);
        }
      }

      const { data: videoData, error: videoError } = await supabase
        .from('site_images')
        .select('youtube_url')
        .eq('image_type', 'hero_video')
        .single();

      if (!videoError && videoData?.youtube_url) {
        setVideoUrl(videoData.youtube_url);
      }
    } catch (error) {
      console.error('Hero içerik yüklenirken hata:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(heroImages.length, 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(heroImages.length, 1)) % Math.max(heroImages.length, 1));
  };

  useEffect(() => {
    if (heroImages.length > 1) {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }
  }, [heroImages.length]);

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : '';
  };

  const currentImage = heroImages.length > 0 
    ? heroImages[currentSlide] 
    : 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070';

  return (
    <section className="relative h-screen overflow-hidden">
      {showVideo && videoUrl ? (
        <div className="absolute inset-0 z-10">
          <iframe
            src={getYouTubeEmbedUrl(videoUrl)}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          <button
            onClick={() => setShowVideo(false)}
            className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-20"
          >
            ×
          </button>
        </div>
      ) : (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${currentImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </>
      )}

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-light text-white mb-6 leading-tight">
            {t("3D Digital Architecture")}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t("Innovative solutions for modern architecture with cutting-edge technology")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/projects" 
              className="bg-white text-arch-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              {t("View Projects")}
            </Link>
            
            <Link 
              to="/cesium" 
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Globe size={20} />
              {t("3D Harita")}
            </Link>
            
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="border border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors font-medium flex items-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                {t("Watch Video")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {heroImages.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {heroImages.length > 1 && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Hero;
