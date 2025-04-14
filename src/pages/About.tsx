
import React from 'react';
import Layout from '../components/layout/Layout';
import { ArrowDownCircle } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <section className="pt-16 md:pt-24">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8">About Our Studio</h1>
            <p className="text-lg text-arch-gray">
              We are a team of architects, designers, and visionaries dedicated to creating exceptional spaces 
              that balance form, function, and sustainability.
            </p>
          </div>
        </div>
        
        <div className="w-full h-96 bg-arch-light-gray mb-16">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069" 
            alt="Our studio" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="arch-container">
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-xl md:text-2xl font-display mb-6">Our Philosophy</h2>
              <p className="text-arch-gray mb-4">
                We believe architecture should respond to both human needs and environmental concerns. Our designs 
                seek to create spaces that inspire connection, promote wellbeing, and respect the natural world.
              </p>
              <p className="text-arch-gray">
                Every project begins with deep listening and understanding the unique context, leading to 
                solutions that are both beautiful and practical, timeless yet forward-thinking.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl md:text-2xl font-display mb-6">Our Approach</h2>
              <p className="text-arch-gray mb-4">
                We combine rigorous research and innovative techniques to create architectural solutions that 
                surpass expectations. Our collaborative process involves clients at every stage, ensuring 
                the end result truly reflects their vision.
              </p>
              <p className="text-arch-gray">
                Sustainability isn't just a buzzword for us—it's integrated into every design decision, from 
                material selection to long-term energy efficiency considerations.
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6">
              <h3 className="text-5xl font-display font-light mb-4">30+</h3>
              <p className="text-arch-gray">Completed Projects</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-5xl font-display font-light mb-4">15</h3>
              <p className="text-arch-gray">Years of Experience</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-5xl font-display font-light mb-4">12</h3>
              <p className="text-arch-gray">Design Awards</p>
            </div>
          </div>
          
          <div className="mb-16">
            <h2 className="text-xl md:text-2xl font-display mb-8 text-center">Our Team</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[1, 2, 3].map((member) => (
                <div key={member} className="text-center">
                  <div className="aspect-square bg-arch-light-gray mb-4">
                    <img 
                      src={`https://images.unsplash.com/photo-151${9500${member}}019-7a5625340088?q=80&w=1888`}
                      alt={`Team member ${member}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium">Architect Name</h3>
                  <p className="text-arch-gray text-sm">Principal Architect</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-center mb-16">
            <a 
              href="#contact" 
              className="inline-flex items-center gap-2 border border-arch-black px-6 py-3 text-sm uppercase tracking-wider
                         hover:bg-arch-black hover:text-white transition-all duration-300"
            >
              Get In Touch <ArrowDownCircle size={18} />
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
