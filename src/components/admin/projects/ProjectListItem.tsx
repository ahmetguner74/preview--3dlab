
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '@/types/project';
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface ProjectListItemProps {
  project: Project;
  onToggleVisibility: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectListItem: React.FC<ProjectListItemProps> = ({ 
  project, 
  onToggleVisibility, 
  onDelete 
}) => {
  const getStatusBadgeClass = (status: ProjectStatus) => {
    switch(status) {
      case 'taslak': 
        return 'bg-yellow-100 text-yellow-800';
      case 'yayinda': 
        return 'bg-green-100 text-green-800';
      case 'arsiv': 
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.id.substring(0, 8)}...
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900">{project.title}</div>
        <div className="text-sm text-gray-500">{project.slug}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {project.category || '-'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(project.status)}`}>
          {project.status === 'taslak' ? 'Taslak' : 
           project.status === 'yayinda' ? 'Yayında' : 'Arşiv'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(project.updated_at).toLocaleDateString('tr-TR')}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => onToggleVisibility(project)}
          className="inline-flex items-center text-blue-600 hover:text-blue-900 mr-3"
          title={project.visible ? 'Gizle' : 'Göster'}
        >
          {project.visible ? 
            <EyeOff size={16} className="mr-1" /> : 
            <Eye size={16} className="mr-1" />
          }
          <span className="hidden sm:inline">
            {project.visible ? 'Gizle' : 'Göster'}
          </span>
        </button>
        <Link
          to={`/admin/projects/${project.id}/edit`}
          className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mr-3"
          title="Düzenle"
        >
          <Pencil size={16} className="mr-1" />
          <span className="hidden sm:inline">Düzenle</span>
        </Link>
        <button
          onClick={() => onDelete(project.id)}
          className="inline-flex items-center text-red-600 hover:text-red-900"
          title="Sil"
        >
          <Trash2 size={16} className="mr-1" />
          <span className="hidden sm:inline">Sil</span>
        </button>
      </td>
    </tr>
  );
};
