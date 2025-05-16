
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ProjectGrid from '../components/home/ProjectGrid';
import AboutPreview from '../components/home/AboutPreview';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import '../i18n';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ProjectGrid />
      <AboutPreview />
      
      {/* Admin Panel Butonu */}
      <div className="fixed bottom-24 left-4 z-50">
        <Link to="/admin">
          <Button variant="outline" className="bg-black text-white border-white hover:bg-gray-800">
            Admin Panel
          </Button>
        </Link>
      </div>
    </Layout>
  );
};

export default Index;
