
import React, { useState, useEffect } from 'react';
import { ArrowDownCircle } from 'lucide-react';
import { getSiteImage } from '@/utils/siteHelpers';
import { useTranslation } from 'react-i18next';
import { useIsMobile } from '@/hooks/use-mobile';

// Panelden yönetim için bu yapı Supabase entegrasyonu ile tekrar düzenlenecek!
const DEFAULT_HERO = {
  title: {
    tr: "3D DİJİTALLEŞTİRME ATÖLYESİ",
    en: "3D DIGITIZATION WORKSHOP"
  },
  subtitle: {
    tr: "Profesyonel yaklaşımla verilerinizi dijitalleştiriyoruz.",
    en: "We digitize your data with a professional approach."
  },
  youtubeChannel: "https://www.youtube.com/channel/UCrSguWcA9nJyuqCdENnXeZA"
};

const Hero = () => {
  const { t, i18n } = useTranslation();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();
  const heroData = DEFAULT_HERO;
  const lang = i18n.language === "en" ? "en" : "tr";
  
  useEffect(() => {
    const fetchHeroData = async () => {
      setLoading(true);
      const [imageUrl, videoLink] = await Promise.all([
        getSiteImage('hero_background'),
        getSiteImage('hero_youtube_video')
      ]);
      setBackgroundImage(imageUrl);
      if (videoLink) setVideoUrl(videoLink);
      setLoading(false);
    };
    fetchHeroData();
  }, []);
  
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  // Video embed src'ine parametreleri ekle (autoplay, mute, loop, controls)
  const finalVideoUrl = React.useMemo(() => {
    if (!videoUrl) return null;

    // Eğer link YouTube embed formatında değilse ve farklı formatları destekle
    let processedUrl = videoUrl;

    // Normal YouTube watch formatını embed formatına dönüştür
    if (processedUrl.includes('youtube.com/watch?v=')) {
      const videoId = processedUrl.split('v=')[1]?.split('&')[0];
      if (videoId) {
        processedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtu.be formatındaki linkleri embed formatına dönüştür
    if (processedUrl.includes('youtu.be/')) {
      const videoId = processedUrl.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        processedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // URL'nin geçerli olduğundan emin olalım
    if (!processedUrl.includes('youtube.com/embed/')) {
      console.error('Geçersiz YouTube embed URL\'si:', videoUrl);
      return null;
    }

    // Video ID'sini çıkar (parametreleri eklemek için)
    const videoId = processedUrl.split('/embed/')[1]?.split('?')[0];
    if (!videoId) {
      console.error('Video ID çıkarılamadı:', processedUrl);
      return null;
    }

    // Tüm parametreleri temizle ve yeniden ekle
    const baseUrl = `https://www.youtube.com/embed/${videoId}`;
    return `${baseUrl}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0`;
  }, [videoUrl]);
  
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-white md:bg-transparent py-10 md:py-0">
      {/* Arkaplan */}
      <div className="absolute inset-0 bg-arch-black opacity-40 z-10 rounded-3xl" />
      <div 
        className={`absolute inset-0 ${loading ? 'animate-pulse bg-gray-300' : ''} bg-cover bg-center rounded-3xl`}
        style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}}
      />
      
      {/* İçerik */}
      <div className="arch-container relative z-20 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-16 min-h-[60vh] justify-between px-2 md:px-0">
          {/* Sol Blok: Yazı Alanı */}
          <div className="flex flex-col justify-center flex-1 max-w-xl text-left text-white drop-shadow-2xl bg-black/40 md:bg-transparent rounded-3xl md:rounded-none p-6 md:p-0 min-w-[320px]">
            <h1 className="text-4xl font-display mb-6 font-extrabold text-yellow-300 md:text-5xl text-left">{heroData.title[lang]}</h1>
            <p className="text-lg mb-8 font-medium text-yellow-200 md:text-xl">{heroData.subtitle[lang]}</p>
            <div className="flex gap-4 mb-6 flex-wrap">
              <button 
                onClick={scrollToProjects} 
                className="flex items-center gap-2 border border-white px-6 py-3 uppercase tracking-wider hover:text-arch-black transition-all duration-300 bg-yellow-300 hover:bg-yellow-200 font-bold text-base text-black rounded shadow-sm animate-fade-in"
              >
                {t("viewProjects")} <ArrowDownCircle size={18} />
              </button>
            </div>
            <div className="mt-2">
              <span className="text-xs text-white/90">{t("youtubeInfo")}</span>
            </div>
          </div>
          
          {/* Sağ Blok: Gömülü YouTube Video */}
          <div className="flex-1 flex items-center justify-center min-w-[340px] md:max-w-2xl">
            <div className={`w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-black bg-opacity-80 backdrop-blur-sm ring-2 ring-white ring-opacity-20 animate-fade-in ${isMobile ? 'h-64' : 'h-80'}`}>
              {finalVideoUrl ? (
                <iframe 
                  src={finalVideoUrl} 
                  title="Hero Video" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen 
                  className="w-full h-full" 
                  frameBorder="0"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Video yüklenemedi
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
