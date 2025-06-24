import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
const Hero = () => {
  const {
    t
  } = useTranslation();
  const [heroImage, setHeroImage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  useEffect(() => {
    fetchHeroContent();
  }, []);
  const fetchHeroContent = async (): Promise<void> => {
    try {
      const {
        data: heroData,
        error: heroError
      } = await supabase.from('site_images').select('image_url').like('image_key', 'hero_%').order('created_at').limit(1).single();
      if (heroError) {
        console.error('Hero görselini getirme hatası:', heroError.message);
        setHeroImage('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070');
      } else if (heroData) {
        setHeroImage(heroData.image_url);
      } else {
        setHeroImage('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070');
      }
      const {
        data: videoData,
        error: videoError
      } = await supabase.from('site_images').select('image_url').eq('image_key', 'hero_youtube_video').maybeSingle();
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
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1` : '';
  };
  return <section className="relative h-screen overflow-hidden">
      {/* Arka plan görseli */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `url(${heroImage})`
    }} />
      
      {/* Video arka planda */}
      {videoUrl && <div className="absolute inset-0 opacity-30">
          <iframe src={getYouTubeEmbedUrl(videoUrl)} className="w-full h-full object-cover" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{
        pointerEvents: 'none'
      }} />
        </div>}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
      
      {/* İçerik */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="relative inline-block mb-6">
            {/* Arkaplan efekti */}
            <div className="absolute inset-0 bg-gradient-to-r from-arch-black/80 via-arch-black/60 to-transparent blur-sm rounded-lg transform -skew-y-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
            
            <h1 className="relative text-5xl md:text-7xl font-display leading-tight py- font-normal text-left px-0 text-amber-500 lg:text-8xl">
              {t('heroTitle')}
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl text-amber-300 lg:text-3xl">
            {t('heroSubtitle')}
          </p>
          
          <Link to="/projects" className="bg-white text-black px-10 py-4 rounded-md hover:bg-gray-100 transition-all duration-300 font-medium text-lg inline-block hover:scale-105 transform">
            {t('viewProjects')}
          </Link>
        </div>
      </div>
    </section>;
};
export default Hero;