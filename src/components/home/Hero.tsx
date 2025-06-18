
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';

const Hero = () => {
  const { t } = useTranslation();
  const [heroImage, setHeroImage] = useState<string>('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(false);

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
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1` : '';
  };

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
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </>
      )}

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-light text-white mb-6 leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            {t('heroSubtitle')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/projects" 
              className="bg-white text-arch-black px-8 py-3 rounded-md hover:bg-gray-100 transition-colors font-medium"
            >
              {t('viewProjects')}
            </Link>
            
            {videoUrl && (
              <button
                onClick={() => setShowVideo(true)}
                className="border border-white text-white px-8 py-3 rounded-md hover:bg-white/10 transition-colors font-medium flex items-center gap-2"
              >
                <Play size={20} fill="currentColor" />
                {t('youtubeWatch')}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
