import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from './LanguageSwitcher';
import { Menu } from "lucide-react";
const Navbar = () => {
  const {
    t
  } = useTranslation();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-md shadow-md' : 'bg-black/50 backdrop-blur-sm'}`}>
      <div className="arch-container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center px-[20px] py-[6px] my-0 mx-0">
            <div className="font-display text-2xl md:text-3xl font-bold text-yellow-400 mr-2">3D</div>
            <div className="font-display text-lg md:text-xl font-bold text-white">
              DİJİTAL
            </div>
          </Link>

          {/* Hamburger menu for mobile */}
          <button className="md:hidden text-white p-2" onClick={toggleMobileMenu}>
            <Menu size={24} />
          </button>

          {/* Ana Menü - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/projects" className={`${isScrolled ? 'text-white hover:text-yellow-300' : 'text-white hover:text-yellow-300'} transition-colors`}>
              {t("projects")}
            </Link>
            <Link to="/about" className={`${isScrolled ? 'text-white hover:text-yellow-300' : 'text-white hover:text-yellow-300'} transition-colors`}>
              {t("about")}
            </Link>
            <Link to="/contact" className={`${isScrolled ? 'text-white hover:text-yellow-300' : 'text-white hover:text-yellow-300'} transition-colors`}>
              {t("contact")}
            </Link>
          </div>

          {/* Dil Seçici ve Admin - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/admin">
              <Button variant="outline" size="sm" className="border-white hover:bg-yellow-400 hover:border-yellow-400 font-normal text-zinc-950">
                {t("admin")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobil Menü */}
        {isMobileMenuOpen && <div className="md:hidden bg-black/95 backdrop-blur-md py-4">
            <div className="flex flex-col space-y-3 px-4">
              <Link to="/projects" className="text-white py-2 hover:text-yellow-300" onClick={() => setIsMobileMenuOpen(false)}>
                {t("projects")}
              </Link>
              <Link to="/about" className="text-white py-2 hover:text-yellow-300" onClick={() => setIsMobileMenuOpen(false)}>
                {t("about")}
              </Link>
              <Link to="/contact" className="text-white py-2 hover:text-yellow-300" onClick={() => setIsMobileMenuOpen(false)}>
                {t("contact")}
              </Link>
              
              <div className="flex items-center justify-between pt-3 border-t border-gray-700">
                <LanguageSwitcher />
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="border-white hover:bg-yellow-400 hover:border-yellow-400 text-white hover:text-black">
                    {t("admin")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>}
      </div>
    </nav>;
};
export default Navbar;