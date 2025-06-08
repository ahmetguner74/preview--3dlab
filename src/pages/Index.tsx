
import React from 'react';
import Layout from '../components/layout/Layout';
import Hero from '../components/home/Hero';
import ProjectGrid from '../components/home/ProjectGrid';
import AboutPreview from '../components/home/AboutPreview';
import '../i18n';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <ProjectGrid />
      <AboutPreview />
    </Layout>
  );
};

export default Index;
