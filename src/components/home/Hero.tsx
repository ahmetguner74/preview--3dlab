
import React, { useState, useEffect } from 'react';
import { ArrowDownCircle, Youtube } from 'lucide-react';
import { getSiteImage } from '@/utils/siteHelpers';
import { useTranslation } from 'react-i18next';

const DEFAULT_VIDEO_URL = "https://www.youtube.com/embed/CkN5vxecNXI?autoplay=1&mute=1&loop=1&controls=0";

const Hero = () => {
  const { t } = useTranslation();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // İleride YouTube linkini Supabase'den almak mümkün.
  const [videoUrl] = useState(DEFAULT_VIDEO_URL);

  useEffect(() => {
    const fetchHeroBackground = async () => {
      setLoading(true);
      const imageUrl = await getSiteImage('hero_background');
      setBackgroundImage(imageUrl);
      setLoading(false);
    };
    fetchHeroBackground();
  }, []);
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-white md:bg-transparent py-10 md:py-0">
      {/* Arkaplan */}
      <div className="absolute inset-0 bg-arch-black opacity-40 z-10 rounded-3xl" />
      <div className={`absolute inset-0 ${loading ? 'animate-pulse bg-gray-300' : ''} bg-cover bg-center`} style={backgroundImage ? { backgroundImage: `url('${backgroundImage}')` } : {}} />
      {/* İçerik */}
      <div className="arch-container relative z-20 w-full">
        <div className="flex flex-col md:flex-row items-center md:items-stretch gap-8 md:gap-12 min-h-[40vh] justify-between">
          {/* Sol Blok: Yazı */}
          <div className="flex flex-col justify-center flex-1 max-w-2xl text-left text-white">
            <h1 className="text-4xl md:text-6xl font-display mb-6 font-extrabold text-cyan-300 drop-shadow">{t("heroTitle")}</h1>
            <p className="text-lg md:text-xl mb-8 font-medium text-cyan-200 drop-shadow">{t("heroSubtitle")}</p>
            <div className="flex gap-4 mb-6 flex-wrap">
              <button onClick={scrollToProjects} className="flex items-center gap-2 border border-white px-6 py-3 uppercase tracking-wider hover:text-arch-black transition-all duration-300 bg-yellow-300 hover:bg-yellow-200 font-bold text-base text-black rounded shadow-sm animate-fade-in">
                {t("viewProjects")} <ArrowDownCircle size={18} />
              </button>
              <a href="https://www.youtube.com/channel/UCrSguWcA9nJyuqCdENnXeZA" rel="noopener noreferrer" target="_blank" className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded uppercase hover:bg-gray-800 transition-colors font-bold text-base animate-fade-in">
                <Youtube size={18} /> {t("youtubeWatch")}
              </a>
            </div>
            <div className="mt-2">
              <span className="text-xs text-white/90">{t("youtubeInfo")}</span>
            </div>
          </div>
          {/* Sağ Blok: Gömülü YouTube Video */}
          <div className="flex-1 max-w-xl flex items-center justify-center">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-black bg-opacity-80 backdrop-blur-sm ring-2 ring-white ring-opacity-20 animate-fade-in">
              <iframe
                src={videoUrl}
                title="Hero Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="w-full h-full"
                frameBorder={0}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
