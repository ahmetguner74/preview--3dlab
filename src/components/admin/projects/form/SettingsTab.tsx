
import React from 'react';
import { Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Project } from '@/types/project';

interface SettingsTabProps {
  project: Partial<Project>;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SettingsTab: React.FC<SettingsTabProps> = ({ project, onCheckboxChange }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Proje Ayarları</h2>
        <p className="text-sm text-gray-500">Projenin görünürlük ve diğer ayarlarını buradan düzenleyebilirsiniz.</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="visible"
            name="visible"
            checked={project.visible}
            onChange={onCheckboxChange}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="visible" className="ml-2 block text-sm text-gray-900">
            Ana sayfada görünür
          </label>
        </div>
        
        <div>
          <Button 
            variant="destructive" 
            className="mt-8"
            onClick={() => {
              if (confirm('Projeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!')) {
                // Silme işlemi burada gerçekleştirilecek
              }
            }}
          >
            <Trash size={16} className="mr-1" /> Projeyi Sil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
