
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, MessageCircle, Globe } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: t('Home'), href: '/' },
    { name: t('Projects'), href: '/projects' },
    { name: t('Maps'), href: '/maps' },
    { name: '3D Harita', href: '/cesium' },
    { name: t('About'), href: '/about' },
    { name: t('Contact'), href: '/contact' }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-sm shadow-sm fixed w-full z-50">
      <div className="arch-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-display font-light text-arch-black hover:text-gray-600 transition-colors">
            3D Digital
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-arch-black border-b-2 border-arch-black'
                    : 'text-gray-600 hover:text-arch-black'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            {/* Admin Button */}
            <Link
              to="/admin"
              className="text-gray-600 hover:text-arch-black transition-colors p-2 rounded-md hover:bg-gray-100"
              title="Admin Panel"
            >
              <User size={20} />
            </Link>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/905555555555"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 transition-colors"
              title="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-arch-black transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-3 text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-arch-black bg-gray-50'
                      : 'text-gray-600 hover:text-arch-black hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Controls */}
              <div className="px-3 py-3 space-y-3 border-t border-gray-200">
                <LanguageSwitcher />
                
                <div className="flex items-center space-x-3">
                  <Link
                    to="/admin"
                    className="flex items-center gap-3 text-gray-600 hover:text-arch-black transition-colors bg-gray-100 px-4 py-3 rounded-md hover:bg-gray-200 w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <User size={20} />
                    <span className="text-base font-medium">Admin Panel</span>
                  </Link>
                  
                  <a
                    href="https://wa.me/905555555555"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-md hover:bg-green-600 transition-colors w-full"
                    onClick={() => setIsOpen(false)}
                  >
                    <MessageCircle size={20} />
                    <span className="text-base font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
