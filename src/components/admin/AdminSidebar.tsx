
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Image,
  Settings,
  MessageSquare,
  LogOut,
  Home,
  Users,
  Layers
} from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col">
      {/* Logo ve marka */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/admin" className="flex items-center">
          <div className="font-display text-xl font-bold text-yellow-400 mr-2">3D</div>
          <div className="font-display text-lg font-bold">DİJİTAL</div>
        </Link>
      </div>
      
      {/* Menü öğeleri */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          <li>
            <Link 
              to="/admin" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin') && !isActive('/admin/projects') && !isActive('/admin/about-content') && !isActive('/admin/cover-images')
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={18} className="mr-3" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin/projects" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin/projects') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={18} className="mr-3" />
              <span>Projeler</span>
            </Link>
          </li>

          <li>
            <Link 
              to="/admin/about-content" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin/about-content') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={18} className="mr-3" />
              <span>Hakkımızda</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin/cover-images" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin/cover-images') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Image size={18} className="mr-3" />
              <span>Kapak Görselleri</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/yolo" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/yolo') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Layers size={18} className="mr-3" />
              <span>YOLOv8 İşleme</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin/messages" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin/messages') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <MessageSquare size={18} className="mr-3" />
              <span>Mesajlar</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/admin/settings" 
              className={`flex items-center px-3 py-2 rounded-md text-sm ${
                isActive('/admin/settings') 
                ? 'bg-gray-100 text-gray-900 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Settings size={18} className="mr-3" />
              <span>Ayarlar</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      {/* Alt menü */}
      <div className="p-4 border-t border-gray-200">
        <ul className="space-y-1">
          <li>
            <Link 
              to="/" 
              target="_blank" 
              className="flex items-center px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50"
            >
              <Home size={18} className="mr-3" />
              <span>Siteye Git</span>
            </Link>
          </li>
          
          <li>
            <button className="flex w-full items-center px-3 py-2 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              <LogOut size={18} className="mr-3" />
              <span>Çıkış Yap</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
