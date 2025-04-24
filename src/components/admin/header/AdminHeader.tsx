
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle, LogOut, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminHeaderProps {
  title: string;
  onRefresh?: () => Promise<void>;
  refreshing?: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ title, onRefresh, refreshing }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-600 flex items-center hover:text-arch-black">
          <ArrowLeftCircle size={20} className="mr-2" />
          <span className="text-sm">Siteye Dön</span>
        </Link>
        <h1 className="text-xl font-medium">{title}</h1>
      </div>
      
      <div>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh} 
            disabled={refreshing}
            className="mr-4"
          >
            {refreshing ? (
              <Loader2 size={16} className="animate-spin mr-2" />
            ) : (
              <RefreshCw size={16} className="mr-2" />
            )}
            Yenile
          </Button>
        )}
        <button className="flex items-center text-gray-600 hover:text-arch-black">
          <span className="text-sm mr-2">Çıkış Yap</span>
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
