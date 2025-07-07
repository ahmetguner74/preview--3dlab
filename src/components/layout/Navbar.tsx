
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const navigation = [
    { name: t('Home'), href: '/' },
    { name: t('Projects'), href: '/projects' },
    { name: t('Maps'), href: '/maps' },
    { name: 'Cesium 3D', href: '/cesium3d' },
    { name: t('About'), href: '/about' },
    { name: t('Contact'), href: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="arch-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-display font-medium">
            3D Digital
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-arch-black font-medium'
                    : 'text-arch-gray hover:text-arch-black'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side - Language Switcher and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User size={16} />
                    <span className="text-sm">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings size={16} className="mr-2" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Çıkış Yap
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm" variant="outline">
                  Giriş Yap
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-arch-gray hover:text-arch-black"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-100">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-sm transition-colors ${
                    isActive(item.href)
                      ? 'text-arch-black font-medium bg-gray-50'
                      : 'text-arch-gray hover:text-arch-black hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-3 py-2 border-t border-gray-100 mt-4">
                <LanguageSwitcher />
                
                {user ? (
                  <div className="mt-3 space-y-2">
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <Link to="/admin" className="block">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full justify-start mb-2"
                      >
                        <Settings size={16} className="mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                    <Button 
                      onClick={handleSignOut} 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start"
                    >
                      <LogOut size={16} className="mr-2" />
                      Çıkış Yap
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" className="block mt-3">
                    <Button size="sm" variant="outline" className="w-full">
                      Giriş Yap
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
