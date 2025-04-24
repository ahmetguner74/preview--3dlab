
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="arch-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className={`font-display text-lg md:text-xl font-bold ${
            isScrolled ? 'text-arch-black' : 'text-white'
          }`}>
            ACHITECT
          </Link>

          {/* Ana Menü */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/projects" className={`${
              isScrolled ? 'text-arch-black hover:text-arch-gray' : 'text-white hover:text-gray-300'
            } transition-colors`}>
              {t("projects")}
            </Link>
            <Link to="/about" className={`${
              isScrolled ? 'text-arch-black hover:text-arch-gray' : 'text-white hover:text-gray-300'
            } transition-colors`}>
              {t("about")}
            </Link>
            <Link to="/contact" className={`${
              isScrolled ? 'text-arch-black hover:text-arch-gray' : 'text-white hover:text-gray-300'
            } transition-colors`}>
              {t("contact")}
            </Link>
          </div>

          {/* Dil Seçici ve Admin */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/admin">
              <Button variant="outline" size="sm" className={`${
                isScrolled ? 'border-arch-black text-arch-black' : 'border-white text-white'
              }`}>
                Admin
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
