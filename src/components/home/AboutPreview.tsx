
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getSiteImage } from '@/utils/siteHelpers';

const AboutPreview = () => {
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
    <section className="py-24 bg-arch-light-gray">
      <div className="arch-container">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h2 className="text-sm uppercase text-arch-gray tracking-wider">About Us</h2>
            <h3 className="text-2xl md:text-4xl font-display">Creating spaces that evolve with time and purpose</h3>
            <p className="text-arch-gray">
              Founded with a passion for transformative design, our studio brings together the best minds in architecture to create spaces that inspire and endure. We believe in the power of thoughtful design to enhance life and community.
            </p>
            <div className="pt-4">
              <Link 
                to="/about" 
                className="inline-flex items-center gap-1 border-b border-arch-black pb-1 hover:text-arch-gray hover:border-arch-gray transition-colors"
              >
                Learn more about our studio <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          
          <div className="h-64 md:h-auto overflow-hidden">
            {loading ? (
              <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
              <img 
                src={teamImage || "https://images.unsplash.com/photo-1517502884422-41eaead166d4?q=80&w=2025"} 
                alt="Architecture studio team"
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
