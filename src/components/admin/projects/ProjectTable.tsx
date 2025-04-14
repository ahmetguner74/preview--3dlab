
import React from 'react';
import { Project } from '@/types/project';
import { ProjectListItem } from './ProjectListItem';
import { ProjectListEmpty } from './ProjectListEmpty';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
} from "@/components/ui/table";

interface ProjectTableProps {
  projects: Project[];
  loading: boolean;
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  onToggleVisibility: (project: Project) => void;
  onDelete: (id: string) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({
  projects,
  loading,
  searchTerm,
  categoryFilter,
  statusFilter,
  onToggleVisibility,
  onDelete
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 text-left text-gray-500 uppercase text-xs">
            <TableHead className="px-6 py-3 font-medium">ID</TableHead>
            <TableHead className="px-6 py-3 font-medium">Başlık</TableHead>
            <TableHead className="px-6 py-3 font-medium">Kategori</TableHead>
            <TableHead className="px-6 py-3 font-medium">Durum</TableHead>
            <TableHead className="px-6 py-3 font-medium">Son Güncelleme</TableHead>
            <TableHead className="px-6 py-3 font-medium text-right">İşlemler</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <td colSpan={6} className="px-6 py-12 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
                <p className="mt-2">Yükleniyor...</p>
              </td>
            </TableRow>
          ) : projects.length === 0 ? (
            <ProjectListEmpty 
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              statusFilter={statusFilter}
            />
          ) : (
            projects.map((project) => (
              <ProjectListItem
                key={project.id}
                project={project}
                onToggleVisibility={onToggleVisibility}
                onDelete={onDelete}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
