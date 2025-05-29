
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CesiumProject } from '@/types/cesium';
import { Globe } from 'lucide-react';

interface CesiumProjectSelectorProps {
  projects: CesiumProject[];
  selectedProjectId?: string;
  onProjectSelect: (projectId: string) => void;
  loading?: boolean;
}

const CesiumProjectSelector: React.FC<CesiumProjectSelectorProps> = ({
  projects,
  selectedProjectId,
  onProjectSelect,
  loading = false
}) => {
  if (loading) {
    return (
      <Card className="absolute top-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Globe size={20} />
            Proje Seçimi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="absolute top-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Globe size={20} />
          Proje Seçimi
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Select value={selectedProjectId} onValueChange={onProjectSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Bir proje seçin..." />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                <div>
                  <div className="font-medium">{project.title}</div>
                  {project.description && (
                    <div className="text-sm text-gray-500 truncate">
                      {project.description}
                    </div>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {projects.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            <Globe size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Henüz proje eklenmemiş</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CesiumProjectSelector;
