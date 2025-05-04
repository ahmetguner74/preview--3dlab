
import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { ArrowDownCircle } from 'lucide-react';
import { getAboutContent } from '../utils/aboutHelpers';
import { AboutContent } from '../utils/aboutHelpers';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import WhatsappButton from '@/components/ui/WhatsappButton';

const About = () => {
  const [aboutSections, setAboutSections] = useState<AboutContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  useEffect(() => {
    const fetchAboutContent = async () => {
      setLoading(true);
      const content = await getAboutContent();
      setAboutSections(content);
      setLoading(false);
    };

    fetchAboutContent();
  }, []);

  const renderSkeleton = () => (
    <>
      <div className="max-w-3xl mx-auto text-center mb-16">
        <Skeleton className="h-12 w-2/3 mx-auto mb-8" />
        <Skeleton className="h-20 w-full mx-auto" />
      </div>
      <div className="w-full h-96 bg-arch-light-gray mb-16">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div>
          <Skeleton className="h-8 w-1/3 mb-6" />
          <Skeleton className="h-24 w-full mb-4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    </>
  );

  // Felsefemiz ve Yaklaşımımız bölümlerini bul
  const philosophySection = aboutSections.find(section => section.section_key === 'philosophy');
  const approachSection = aboutSections.find(section => section.section_key === 'approach');
  
  // Ekip görseli için about_team bölümünü bul (büyük görsel için)
  const teamSection = aboutSections.find(section => section.section_key === 'team');
  
  // Diğer bölümleri grid için filtrele (tarih vb.)
  const otherSections = aboutSections.filter(section => 
    !['philosophy', 'approach', 'team'].includes(section.section_key)
  );

  return (
    <Layout>
      <section className="pt-16 md:pt-24 bg-black text-white">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8 text-white">{t("about")}</h1>
            <p className="text-lg text-gray-300">
              {currentLanguage === 'tr' 
                ? 'Mimarlar, tasarımcılar ve vizyon sahiplerinden oluşan bir ekibiz. Form, işlev ve sürdürülebilirliği dengeleyen olağanüstü mekanlar yaratmaya adanmış durumdayız.'
                : 'We are a team of architects, designers, and visionaries dedicated to creating exceptional spaces that balance form, function, and sustainability.'}
            </p>
          </div>
        </div>
        
        <div className="w-full h-96 mb-16">
          {loading ? (
            <Skeleton className="w-full h-full" />
          ) : (
            <img 
              src={teamSection?.image_url || "https://images.unsplash.com/photo-1497366754035-f200968a6e72"} 
              alt={currentLanguage === 'tr' ? "Stüdyomuz" : "Our studio"} 
              className="w-full h-full object-cover" 
            />
          )}
        </div>
        
        <div className="arch-container">
          {loading ? renderSkeleton() : (
            <>
              <div className="grid md:grid-cols-2 gap-12 mb-16">
                <div>
                  <h2 className="text-xl md:text-2xl font-display mb-6 text-white">
                    {currentLanguage === 'tr' ? philosophySection?.title_tr : philosophySection?.title_en}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {currentLanguage === 'tr' ? philosophySection?.content_tr : philosophySection?.content_en}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-xl md:text-2xl font-display mb-6 text-white">
                    {currentLanguage === 'tr' ? approachSection?.title_tr : approachSection?.title_en}
                  </h2>
                  <p className="text-gray-300 mb-4">
                    {currentLanguage === 'tr' ? approachSection?.content_tr : approachSection?.content_en}
                  </p>
                </div>
              </div>
              
              {otherSections.length > 0 && (
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                  {otherSections.map((section) => (
                    <div key={section.id} className="bg-gray-800 p-6 rounded-md">
                      {section.image_url && (
                        <div className="overflow-hidden mb-4 rounded-md">
                          <img 
                            src={section.image_url} 
                            alt={currentLanguage === 'tr' ? section.title_tr : section.title_en} 
                            className="w-full h-48 object-cover transition-transform hover:scale-105"
                          />
                        </div>
                      )}
                      <h3 className="font-display text-lg mb-2 text-white">
                        {currentLanguage === 'tr' ? section.title_tr : section.title_en}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {currentLanguage === 'tr' ? section.content_tr : section.content_en}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="text-center pb-16">
                <a href="#contact" className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm uppercase tracking-wider
                             hover:bg-white hover:text-black transition-all duration-300">
                  {currentLanguage === 'tr' ? 'İletişime Geçin' : 'Get In Touch'} <ArrowDownCircle size={18} />
                </a>
              </div>
            </>
          )}
        </div>
      </section>
      <WhatsappButton />
    </Layout>
  );
};

export default About;
