
import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';
const Navbar = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const navItems = [{
    path: '/',
    label: t('Projects')
  }, {
    path: '/about',
    label: t('About')
  }, {
    path: '/contact',
    label: t('Contact')
  }];
  return <header className={`fixed w-full z-30 transition-all duration-300 ${scrolled ? 'py-3 bg-white shadow-sm' : 'py-5 bg-transparent'}`}>
      <div className="arch-container flex justify-between items-center">
        <NavLink to="/" className="text-xl md:text-2xl font-display font-medium-bold">Digital LAB</NavLink>
        
        {/* Desktop Navigation */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => <NavLink key={item.label} to={item.path} className={({
            isActive
          }) => `text-sm uppercase tracking-wider hover:text-arch-gray transition-colors ${isActive ? 'font-medium' : 'font-normal'}`}>
                {item.label}
              </NavLink>)}
          </nav>

          {/* Admin Button */}
          <Link to="/admin" className="hidden md:flex items-center gap-2 bg-arch-black text-white px-4 py-2 rounded-md text-sm hover:bg-arch-gray transition-colors">
            <Settings size={16} /> {t("Admin")}
          </Link>
          <LanguageSwitcher />
        </div>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-2">
          <Link to="/admin" className="md:hidden text-arch-black">
            <Settings size={24} />
          </Link>
          <button className="md:hidden text-arch-black" onClick={toggleMenu} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMenuOpen && <div className="fixed inset-0 bg-white z-50 flex flex-col animate-fade-in">
            <div className="arch-container pt-5 pb-10 flex justify-between">
              <NavLink to="/" className="text-xl md:text-2xl font-display font-medium">
                ARCHITECTURE
              </NavLink>
              <button onClick={toggleMenu} aria-label="Close menu">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center space-y-8">
              {navItems.map(item => <NavLink key={item.label} to={item.path} onClick={toggleMenu} className={({
            isActive
          }) => `text-2xl uppercase tracking-wider hover:text-arch-gray transition-colors ${isActive ? 'font-medium' : 'font-normal'}`}>
                  {item.label}
                </NavLink>)}
              <Link to="/admin" onClick={toggleMenu} className="text-2xl uppercase tracking-wider hover:text-arch-gray transition-colors">
                {t("Admin")}
              </Link>
              <LanguageSwitcher />
            </div>
          </div>}
      </div>
    </header>;
};
export default Navbar;
