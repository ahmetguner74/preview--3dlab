
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Phone, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();

  // Scroll efekti
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const phone = "+905313553274";
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="arch-container">
        <div className="flex items-center justify-between">
          {/* Logo - Ana sayfaya yönlendirme */}
          <Link to="/" className="flex items-center font-display">
            <div className="text-xl font-bold text-yellow-400 mr-1">3D</div>
            <div className="text-lg font-bold">DİJİTAL</div>
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden md:flex space-x-6">
            <NavLink to="/projects" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              {t('projects')}
            </NavLink>
            <NavLink to="/maps" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              Haritalar
            </NavLink>
            <NavLink to="/cesium" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              3D Viewer
            </NavLink>
            <NavLink to="/about" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              {t('about')}
            </NavLink>
            <NavLink to="/contact" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              {t('contact')}
            </NavLink>
            <NavLink to="/yolo" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'}>
              YOLOv8
            </NavLink>
          </nav>

          <div className="flex items-center space-x-3">
            {/* WhatsApp Butonu */}
            <a
              href={`https://wa.me/${phone.replace(/^\+/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 bg-green-500 hover:bg-green-600 transition-colors rounded-full px-3 py-2 text-white text-sm"
              title="WhatsApp ile iletişim"
            >
              <Phone size={16} />
              <span>WhatsApp</span>
            </a>

            {/* Admin Panel Butonu */}
            <Link to="/admin" className="hidden md:block">
              <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800">
                <Settings size={16} className="mr-1" />
                Admin
              </Button>
            </Link>

            {/* Dil değiştirici */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobil menü butonu */}
            <button className="md:hidden ml-4" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-4">
              <NavLink to="/projects" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                {t('projects')}
              </NavLink>
              <NavLink to="/maps" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                Haritalar
              </NavLink>
              <NavLink to="/cesium" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                3D Viewer
              </NavLink>
              <NavLink to="/about" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                {t('about')}
              </NavLink>
              <NavLink to="/contact" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                {t('contact')}
              </NavLink>
              <NavLink to="/yolo" className={({
            isActive
          }) => isActive ? 'text-black font-medium' : 'text-gray-600'} onClick={() => setIsMenuOpen(false)}>
                YOLOv8
              </NavLink>
              
              {/* Mobil WhatsApp */}
              <a
                href={`https://wa.me/${phone.replace(/^\+/, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 transition-colors rounded px-3 py-2 text-white text-sm w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone size={16} />
                <span>WhatsApp</span>
              </a>

              {/* Mobil Admin Panel */}
              <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" size="sm" className="bg-black text-white border-black hover:bg-gray-800 w-fit">
                  <Settings size={16} className="mr-1" />
                  Admin Panel
                </Button>
              </Link>

              <div className="pt-2">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
