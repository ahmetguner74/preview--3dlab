
import React from 'react';
import { Button } from "@/components/ui/button";

interface ProjectSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="w-64 flex-shrink-0">
      <div className="bg-white p-4 rounded-md shadow-sm mb-4">
        <ul className="space-y-1">
          <li>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-2 font-normal"
              onClick={() => onTabChange("genel")}
            >
              <span className="truncate">Gösterge Paneli</span>
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-2 font-normal"
              onClick={() => onTabChange("genel")}
            >
              <span className="truncate">Projeler</span>
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-2 font-normal"
            >
              <span className="truncate">Mesajlar</span>
            </Button>
          </li>
          <li>
            <Button 
              variant="ghost" 
              className="w-full justify-start px-2 font-normal"
            >
              <span className="truncate">Ayarlar</span>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectSidebar;
