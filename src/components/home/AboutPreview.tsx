
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getAboutContent, AboutContent } from '@/utils/aboutHelpers';

const AboutPreview = () => {
  const { t, i18n } = useTranslation();
  const [teamSection, setTeamSection] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const currentLanguage = i18n.language;
  
  useEffect(() => {
    const fetchAboutContent = async () => {
      setLoading(true);
      try {
        const content = await getAboutContent();
        const team = content.find(section => section.section_key === 'team');
        setTeamSection(team || null);
      } catch (error) {
        console.error('Hakkımızda içeriği getirilirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAboutContent();
  }, [currentLanguage]); // Dil değiştiğinde içeriği tekrar yükle
  
  return (
    <section className="py-24 bg-black">
      <div className="arch-container">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-sm uppercase text-gray-400 tracking-wider">{t("about")}</h2>
            <h3 className="text-2xl md:text-4xl font-display text-white">
              {t("aboutDescription")}
            </h3>
            <p className="text-gray-400">
              {t("aboutResult")}
            </p>
            <div className="pt-4">
              <Link to="/about" className="inline-flex items-center gap-1 border-b border-white pb-1 text-white hover:text-gray-300 hover:border-gray-300 transition-colors">
                {t("learnMore")} <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="h-64 md:h-auto overflow-hidden rounded-md">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-700"></div>
            ) : (
              <img 
                src={teamSection?.image_url || "https://images.unsplash.com/photo-1517502884422-41eaead166d4"} 
                alt={currentLanguage === "tr" ? "Mimarlık stüdyo ekibi" : "Architecture studio team"} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700" 
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
