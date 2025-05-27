
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, FolderOpen, Settings, Image, FileText, MessageSquare, Cog, Map } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      path: '/admin', 
      icon: Home, 
      label: 'Dashboard',
      exact: true 
    },
    { 
      path: '/admin/projects', 
      icon: FolderOpen, 
      label: 'Projeler' 
    },
    { 
      path: '/admin/map-services', 
      icon: Map, 
      label: 'Harita Servisleri' 
    },
    { 
      path: '/admin/site-settings', 
      icon: Settings, 
      label: 'Site Ayarları' 
    },
    { 
      path: '/admin/cover-images', 
      icon: Image, 
      label: 'Kapak Görselleri' 
    },
    { 
      path: '/admin/about-content', 
      icon: FileText, 
      label: 'Hakkımızda İçeriği' 
    },
    { 
      path: '/admin/messages', 
      icon: MessageSquare, 
      label: 'Mesajlar' 
    },
    { 
      path: '/admin/settings', 
      icon: Cog, 
      label: 'Genel Ayarlar' 
    }
  ];

  return (
    <div className="w-64 flex-shrink-0 bg-gray-800 text-white py-4">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav>
        <ul>
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);
            
            return (
              <li key={item.path} className="mb-1">
                <NavLink
                  to={item.path}
                  className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
                    isActive ? 'bg-gray-700 font-medium' : ''
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
