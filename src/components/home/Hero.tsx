
import React from 'react';
import { ArrowDownCircle } from 'lucide-react';

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[90vh] flex items-center overflow-hidden">
      {/* Hero background - Using a placeholder for now */}
      <div className="absolute inset-0 bg-arch-black opacity-50 z-10"></div>
      <div 
        className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070')] 
                   bg-cover bg-center"
      />
      
      <div className="arch-container relative z-20">
        <div className="max-w-2xl text-white">
          <h1 className="text-3xl md:text-5xl font-display font-light mb-6">
            Creating Spaces That Inspire
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            We design architecture that transforms environments and enhances lives through innovative, sustainable solutions.
          </p>
          <button 
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 border border-white px-6 py-3 text-sm uppercase tracking-wider
                       hover:bg-white hover:text-arch-black transition-all duration-300"
          >
            View Projects <ArrowDownCircle size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
