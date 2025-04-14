
import React from 'react';
import { NavLink } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-arch-light-gray">
      <div className="arch-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4">ARCHITECTURE</h3>
            <p className="text-sm text-arch-gray max-w-xs">
              Creating modern, sustainable architectural solutions with a focus on aesthetics and functionality.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/" className="text-sm hover:text-arch-gray transition-colors">Projects</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-sm hover:text-arch-gray transition-colors">About</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-sm hover:text-arch-gray transition-colors">Contact</NavLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <address className="not-italic">
              <p className="text-sm mb-2">123 Architecture St.</p>
              <p className="text-sm mb-2">City, Country</p>
              <p className="text-sm mb-2">
                <a href="mailto:info@architecture.com" className="hover:text-arch-gray transition-colors">
                  info@architecture.com
                </a>
              </p>
              <p className="text-sm">
                <a href="tel:+123456789" className="hover:text-arch-gray transition-colors">
                  +12 345 6789
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-arch-gray mb-4 md:mb-0">
            © {year} Architecture. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:text-arch-gray transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm hover:text-arch-gray transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
