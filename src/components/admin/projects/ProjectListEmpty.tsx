
import React from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

interface ProjectListEmptyProps {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
}

export const ProjectListEmpty: React.FC<ProjectListEmptyProps> = ({ 
  searchTerm, 
  categoryFilter, 
  statusFilter 
}) => {
  const isFiltering = searchTerm || categoryFilter !== 'all' || statusFilter !== 'all';
  
  return (
    <tr>
      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
        {isFiltering ? 
          'Arama kriterlerine uygun proje bulunamadı' : 
          'Henüz hiç proje eklenmemiş'}
        
        {!isFiltering && (
          <div className="mt-4">
            <Link 
              to="/admin/projects/new"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              İlk Projeyi Ekle
            </Link>
          </div>
        )}
      </td>
    </tr>
  );
};
