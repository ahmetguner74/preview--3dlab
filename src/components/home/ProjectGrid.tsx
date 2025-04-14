
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

// This will be replaced by data from Supabase later
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
  }
];

const ProjectGrid = () => {
  return (
    <section id="projects" className="py-24">
      <div className="arch-container">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-sm uppercase text-arch-gray tracking-wider mb-2">Our Work</h2>
            <h3 className="text-2xl md:text-4xl font-display">Featured Projects</h3>
          </div>
          <div className="hidden md:block">
            <Link 
              to="/projects" 
              className="flex items-center gap-1 text-sm hover:text-arch-gray transition-colors"
            >
              View All Projects <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProjects.map(project => (
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
        
        <div className="mt-10 md:hidden flex justify-center">
          <Link 
            to="/projects" 
            className="flex items-center gap-1 text-sm hover:text-arch-gray transition-colors"
          >
            View All Projects <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectGrid;
