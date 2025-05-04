
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = useTranslation();
  
  return (
    <footer className="py-12 bg-black text-white">
      <div className="arch-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">3D DİJİTAL</h3>
            <p className="text-sm text-gray-400 max-w-xs">
              {t("footerDescription")}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">{t("projects")}</h3>
            <ul className="space-y-2">
              <li>
                <NavLink to="/projects" className="text-sm hover:text-gray-400 transition-colors">{t("projects")}</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-sm hover:text-gray-400 transition-colors">{t("about")}</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-sm hover:text-gray-400 transition-colors">{t("contact")}</NavLink>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4 text-white">{t("contact")}</h3>
            <address className="not-italic">
              <p className="text-sm mb-2 text-gray-400">{t("footerAddress")}</p>
              <p className="text-sm mb-2 text-gray-400">{t("footerCity")}</p>
              <p className="text-sm mb-2">
                <a href="mailto:info@3ddigital.com" className="hover:text-gray-400 transition-colors">
                  info@3ddigital.com
                </a>
              </p>
              <p className="text-sm">
                <a href="tel:+902121234567" className="hover:text-gray-400 transition-colors">
                  +90 212 123 4567
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">
            © {year} 3D Digital. {t("footerRights")}
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-sm hover:text-gray-400 transition-colors">{t("footerPrivacy")}</a>
            <a href="#" className="text-sm hover:text-gray-400 transition-colors">{t("footerTerms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
