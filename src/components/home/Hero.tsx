
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const { t } = useTranslation();
  const [heroImage, setHeroImage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async (): Promise<void> => {
    try {
      const { data: heroData, error: heroError } = await supabase
        .from('site_images')
        .select('image_url')
        .like('image_key', 'hero_%')
        .order('created_at')
        .limit(1)
        .single();

      if (heroError) {
        console.error('Hero görselini getirme hatası:', heroError.message);
        setHeroImage('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070');
      } else if (heroData) {
        setHeroImage(heroData.image_url);
      } else {
        setHeroImage('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070');
      }

      const { data: videoData, error: videoError } = await supabase
        .from('site_images')
        .select('image_url')
        .eq('image_key', 'hero_youtube_video')
        .maybeSingle();

      if (videoError) {
        console.error('Hero video getirme hatası:', videoError.message);
      } else if (videoData?.image_url) {
        setVideoUrl(videoData.image_url);
      }
    } catch (error) {
      console.error('Hero içerik yüklenirken hata:', error);
      setHeroImage('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070');
    }
  };

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}` : '';
  };

  return (
    <section className="relative h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Sol taraf - İçerik */}
        <div className="flex-1 relative">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
          
          <div className="relative z-10 h-full flex flex-col justify-center items-start text-left px-8 lg:px-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-light text-white mb-6 leading-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              
              <Link 
                to="/projects" 
                className="bg-white text-arch-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium inline-block"
              >
                {t('viewProjects')}
              </Link>
            </div>
          </div>
        </div>

        {/* Sağ taraf - Video */}
        {videoUrl && (
          <div className="flex-1 relative">
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
