
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProjectFormHeaderProps {
  isEditing: boolean;
  saving: boolean;
  onSave: () => void;
}

const ProjectFormHeader: React.FC<ProjectFormHeaderProps> = ({ 
  isEditing, 
  saving, 
  onSave 
}) => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
      <div className="flex items-center">
        <Button 
          onClick={() => navigate('/admin/projects')}
          variant="ghost"
          size="sm"
          className="mr-4"
        >
          <ArrowLeft size={18} />
          <span className="ml-2">Siteye Dön</span>
        </Button>
        <h1 className="text-2xl font-semibold">
          {isEditing ? 'Proje Düzenle' : 'Yeni Proje Oluştur'}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/admin/projects')}
          disabled={saving}
        >
          İptal
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Eye size={16} className="mr-1" />
          Önizle
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onSave}
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2"></span>
              Kaydediliyor...
            </>
          ) : (
            <>
              <Save size={16} className="mr-1" />
              Kaydet
            </>
          )}
        </Button>
      </div>
    </header>
  );
};

export default ProjectFormHeader;
