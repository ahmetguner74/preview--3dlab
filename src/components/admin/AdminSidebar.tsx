
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings,
  LayoutGrid,
  Image
} from 'lucide-react';

export const AdminSidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { 
      icon: LayoutDashboard, 
      label: 'Gösterge Paneli', 
      path: '/admin',
      current: location.pathname === '/admin'
    },
    { 
      icon: FileText, 
      label: 'Projeler', 
      path: '/admin/projects',
      current: location.pathname.includes('/admin/projects')
    },
    { 
      icon: MessageSquare, 
      label: 'Mesajlar', 
      path: '/admin/messages',
      current: location.pathname.includes('/admin/messages')
    },
    { 
      icon: Image, 
      label: 'Site Görselleri', 
      path: '/admin/site-settings',
      current: location.pathname.includes('/admin/site-settings')
    },
    { 
      icon: Settings, 
      label: 'Ayarlar', 
      path: '/admin/settings',
      current: location.pathname.includes('/admin/settings')
    },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex-shrink-0">
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center">
          <LayoutGrid className="h-6 w-6 text-arch-black mr-2" />
          <span className="font-semibold text-xl text-arch-black">Arch</span>
        </Link>
      </div>
      
      <nav className="py-4">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center py-3 px-6 text-sm ${
              item.current 
                ? 'bg-blue-50 text-blue-600 border-l-2 border-blue-600' 
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${item.current ? 'text-blue-600' : 'text-gray-500'}`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
