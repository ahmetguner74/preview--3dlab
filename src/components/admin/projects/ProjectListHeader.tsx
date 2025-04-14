
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, LogOut } from 'lucide-react';

interface ProjectListHeaderProps {
  onLogout?: () => void;
}

export const ProjectListHeader: React.FC<ProjectListHeaderProps> = ({ onLogout = () => {} }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
          <ArrowLeftCircle size={20} className="mr-2" />
          <span className="text-sm">Siteye Dön</span>
        </Link>
        <h1 className="text-xl font-medium">Projeler</h1>
      </div>
      
      <div>
        <button onClick={onLogout} className="flex items-center text-gray-600 hover:text-arch-black">
          <span className="text-sm mr-2">Çıkış Yap</span>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};
