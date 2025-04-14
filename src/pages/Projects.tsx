
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { ArrowUpRight } from 'lucide-react';

// This will come from Supabase in the real implementation
const sampleProjects = [
  {
    id: 1,
    title: 'Modern Residence',
    location: 'New York',
    category: 'Residential',
    year: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070',
    slug: 'modern-residence'
  },
  {
    id: 2,
    title: 'Urban Office Complex',
    location: 'London',
    category: 'Commercial',
    year: '2022',
    thumbnail: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070',
    slug: 'urban-office-complex'
  },
  {
    id: 3,
    title: 'Cultural Center',
    location: 'Barcelona',
    category: 'Public',
    year: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1600607687644-a7e711d3355a?q=80&w=2070',
    slug: 'cultural-center'
  },
  {
    id: 4,
    title: 'Beach House',
    location: 'Malibu',
    category: 'Residential',
    year: '2022',
    thumbnail: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071',
    slug: 'beach-house'
  },
  {
    id: 5,
    title: 'Urban Garden',
    location: 'Tokyo',
    category: 'Landscape',
    year: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070',
    slug: 'urban-garden'
  },
  {
    id: 6,
    title: 'Glass Pavilion',
    location: 'Vancouver',
    category: 'Public',
    year: '2022',
    thumbnail: 'https://images.unsplash.com/photo-1521574873411-508db9056132?q=80&w=2070',
    slug: 'glass-pavilion'
  },
  {
    id: 7,
    title: 'Mountain Retreat',
    location: 'Aspen',
    category: 'Residential',
    year: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=2080',
    slug: 'mountain-retreat'
  },
  {
    id: 8,
    title: 'Urban Apartments',
    location: 'Berlin',
    category: 'Residential',
    year: '2022',
    thumbnail: 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2070',
    slug: 'urban-apartments'
  },
  {
    id: 9,
    title: 'Corporate Headquarters',
    location: 'Singapore',
    category: 'Commercial',
    year: '2023',
    thumbnail: 'https://images.unsplash.com/photo-1577495508326-19a1b3cf65b1?q=80&w=2057',
    slug: 'corporate-headquarters'
  }
];

const categories = ['All', 'Residential', 'Commercial', 'Public', 'Landscape'];

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const filteredProjects = selectedCategory === 'All' 
    ? sampleProjects 
    : sampleProjects.filter(project => project.category === selectedCategory);

  return (
    <Layout>
      <section className="pt-16 md:pt-24 pb-16">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8">Our Projects</h1>
            <p className="text-lg text-arch-gray">
              Explore our portfolio of architectural projects spanning various scales and typologies.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 text-sm ${
                  selectedCategory === category
                    ? 'bg-arch-black text-white'
                    : 'bg-white border border-arch-black text-arch-black hover:bg-arch-light-gray'
                } transition-colors`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map(project => (
              <Link to={`/project/${project.slug}`} key={project.id}>
                <div className="group relative h-80 overflow-hidden">
                  <img 
                    src={project.thumbnail} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="project-card-overlay">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ArrowUpRight size={40} className="text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 p-6 z-10">
                    <h4 className="text-xl text-white font-medium">{project.title}</h4>
                    <p className="text-sm text-white/80 mt-1">
                      {project.category} · {project.location}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <p className="text-arch-gray">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Projects;
