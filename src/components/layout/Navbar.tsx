
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}
    >
      <div className="arch-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center font-display">
            <div className="text-xl font-bold text-yellow-400 mr-1">3D</div>
            <div className="text-lg font-bold">DİJİTAL</div>
          </Link>

          {/* Masaüstü menü */}
          <nav className="hidden md:flex space-x-6">
            <NavLink 
              to="/projects" 
              className={({ isActive }) => 
                isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'
              }
            >
              {t('projects')}
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'
              }
            >
              {t('about')}
            </NavLink>
            <NavLink 
              to="/contact" 
              className={({ isActive }) => 
                isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'
              }
            >
              {t('contact')}
            </NavLink>
            <NavLink 
              to="/yolo" 
              className={({ isActive }) => 
                isActive ? 'text-black font-medium' : 'text-gray-600 hover:text-black transition-colors'
              }
            >
              YOLOv8
            </NavLink>
          </nav>

          <div className="flex items-center">
            {/* Dil değiştirici */}
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            {/* Mobil menü butonu */}
            <button 
              className="md:hidden ml-4"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Mobil menü */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <nav className="flex flex-col space-y-4">
              <NavLink 
                to="/projects" 
                className={({ isActive }) => 
                  isActive ? 'text-black font-medium' : 'text-gray-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('projects')}
              </NavLink>
              <NavLink 
                to="/about" 
                className={({ isActive }) => 
                  isActive ? 'text-black font-medium' : 'text-gray-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('about')}
              </NavLink>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => 
                  isActive ? 'text-black font-medium' : 'text-gray-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contact')}
              </NavLink>
              <NavLink 
                to="/yolo" 
                className={({ isActive }) => 
                  isActive ? 'text-black font-medium' : 'text-gray-600'
                }
                onClick={() => setIsMenuOpen(false)}
              >
                YOLOv8
              </NavLink>
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
