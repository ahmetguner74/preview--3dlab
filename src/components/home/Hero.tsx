import React, { useState, useEffect } from 'react';
import { ArrowDownCircle } from 'lucide-react';
import { getSiteImage } from '@/utils/siteHelpers';
const Hero = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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
    document.getElementById('projects')?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Hero background - Şimdi dinamik olarak veritabanından geliyor */}
      <div className="absolute inset-0 bg-arch-black opacity-50 z-10 rounded-3xl bg-slate-900"></div>
      <div className={`absolute inset-0 ${loading ? 'animate-pulse bg-gray-300' : ''} bg-cover bg-center`} style={backgroundImage ? {
      backgroundImage: `url('${backgroundImage}')`
    } : {}} />
      
      <div className="arch-container relative z-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-5xl font-display font-light mb-6">3D MODEL ATÖLYESİ</h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">Profesyonel yaklaşımla verilerinizi dijitalleştiriyoruz.</p>
          <button onClick={scrollToProjects} className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm uppercase tracking-wider
                       hover:bg-white hover:text-arch-black transition-all duration-300">
            View Projects <ArrowDownCircle size={18} />
          </button>
        </div>
      </div>
    </section>;
};
export default Hero;