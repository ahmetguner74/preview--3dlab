
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import YouTubePopup from './YouTubePopup';

const Hero = () => {
  const { t } = useTranslation();
  const [heroImage, setHeroImage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Arka plan görseli */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{ backgroundImage: `url(${heroImage})` }} 
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/60" />
      
      {/* Video Play Button - Sağ üst köşe */}
      {videoUrl && (
        <div className="absolute top-8 right-8 z-20">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="group bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-4 hover:bg-white/30 transition-all duration-300 hover:scale-110"
          >
            <Play size={24} className="text-white group-hover:text-amber-300 transition-colors" />
          </button>
        </div>
      )}
      
      {/* İçerik */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="max-w-3xl">
          <div className="relative inline-block mb-6">
            {/* Arkaplan efekti */}
            <div className="absolute inset-0 bg-gradient-to-r from-arch-black/80 via-arch-black/60 to-transparent blur-sm rounded-lg transform -skew-y-1"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-lg"></div>
            
            <h1 className="relative text-5xl md:text-7xl font-display leading-tight py-4 font-normal text-left px-6 text-amber-500 lg:text-8xl">
              {t('heroTitle')}
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-12 leading-relaxed max-w-2xl text-amber-300 lg:text-3xl">
            {t('heroSubtitle')}
          </p>
          
          <Link 
            to="/projects" 
            className="bg-white text-black px-10 py-4 rounded-md hover:bg-gray-100 transition-all duration-300 font-medium text-lg inline-block hover:scale-105 transform"
          >
            {t('viewProjects')}
          </Link>
        </div>
      </div>

      {/* YouTube Popup */}
      <YouTubePopup 
        videoUrl={videoUrl}
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
      />
    </section>
  );
};

export default Hero;
