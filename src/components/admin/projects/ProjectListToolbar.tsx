
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, RefreshCw } from 'lucide-react';

interface ProjectListToolbarProps {
  onRefresh: () => void;
}

export const ProjectListToolbar: React.FC<ProjectListToolbarProps> = ({ onRefresh }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h2 className="text-xl font-medium">Projeler</h2>
      <div className="flex space-x-3">
        <button 
          onClick={onRefresh}
          className="bg-white text-gray-700 border border-gray-300 rounded-md px-4 py-2 flex items-center hover:bg-gray-50"
        >
          <RefreshCw size={16} className="mr-2" />
          Yenile
        </button>
        <Link 
          to="/admin/projects/new"
          className="bg-blue-600 text-white rounded-md px-4 py-2 flex items-center hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Yeni Proje
        </Link>
      </div>
    </div>
  );
};
