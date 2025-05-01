
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getSiteImage } from '@/utils/siteHelpers';
import { useTranslation } from 'react-i18next';

const AboutPreview = () => {
  const { t, i18n } = useTranslation();
  const [teamImage, setTeamImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTeamImage = async () => {
      setLoading(true);
      const imageUrl = await getSiteImage('about_team');
      setTeamImage(imageUrl);
      setLoading(false);
    };
    fetchTeamImage();
  }, []);
  
  return (
    <section className="py-24 bg-arch-light-gray bg-black">
      <div className="arch-container">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-sm uppercase text-arch-gray tracking-wider">{t("about")}</h2>
            <h3 className="text-2xl md:text-4xl font-display text-white">
              {i18n.language === "tr" 
                ? "Tarihi yapılardan modern komplekslere kadar farklı karmaşıklıktaki nesnelerle çalışıyoruz." 
                : "We work with objects of different complexity from historical buildings to modern complexes."}
            </h3>
            <p className="text-arch-gray">
              {i18n.language === "tr"
                ? "Çalışma sonucunda lazer tarama noktaları bulutu, fotogrametrik model, ortofoto planlar ve ölçülü restorasyon çizimleri tarafınıza teslim edilir."
                : "As a result of the work, laser scanning point clouds, photogrammetric model, orthophoto plans and measured restoration drawings are delivered to you."}
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center gap-1 border-b border-arch-black pb-1 hover:text-arch-gray hover:border-arch-whitetransition-colors">
                {i18n.language === "tr" ? "Stüdyomuz hakkında daha fazla bilgi edinin" : "Learn more about our studio"} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="h-64 md:h-auto overflow-hidden">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
              <img 
                src={teamImage || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2025"} 
                alt={i18n.language === "tr" ? "Mimarlık stüdyo ekibi" : "Architecture studio team"} 
                className="w-full h-full object-cover" 
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
