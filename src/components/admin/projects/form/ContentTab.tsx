
import React from 'react';
import { Input } from "@/components/ui/input";
import { Project } from '@/types/project';

interface ContentTabProps {
  project: Partial<Project>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContentTab: React.FC<ContentTabProps> = ({ project, onInputChange }) => {
  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">İçerik Bilgileri</h2>
        <p className="text-sm text-gray-500">Projenin detaylı bilgilerini buradan düzenleyebilirsiniz.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Konum
          </label>
          <Input
            id="location"
            name="location"
            value={project.location || ''}
            onChange={onInputChange}
            placeholder="Örn: İstanbul, Türkiye"
          />
        </div>
        
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">
            Yıl
          </label>
          <Input
            id="year"
            name="year"
            value={project.year || ''}
            onChange={onInputChange}
            placeholder="Örn: 2023"
          />
        </div>
        
        <div>
          <label htmlFor="client" className="block text-sm font-medium mb-1">
            Müşteri
          </label>
          <Input
            id="client"
            name="client"
            value={project.client || ''}
            onChange={onInputChange}
            placeholder="Müşteri adı"
          />
        </div>
        
        <div>
          <label htmlFor="area" className="block text-sm font-medium mb-1">
            Alan
          </label>
          <Input
            id="area"
            name="area"
            value={project.area || ''}
            onChange={onInputChange}
            placeholder="Örn: 250 m²"
          />
        </div>
        
        <div>
          <label htmlFor="architect" className="block text-sm font-medium mb-1">
            Mimar
          </label>
          <Input
            id="architect"
            name="architect"
            value={project.architect || ''}
            onChange={onInputChange}
            placeholder="Mimar adı"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentTab;
