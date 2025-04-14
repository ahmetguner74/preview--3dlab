
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface ProjectFilterProps {
  searchTerm: string;
  categoryFilter: string;
  statusFilter: string;
  categories: (string | null)[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
  searchTerm,
  categoryFilter,
  statusFilter,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange
}) => {
  return (
    <div className="p-4 border-b border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Proje ara..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div>
        <Select value={categoryFilter} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Kategoriler</SelectItem>
            {categories.map((category, index) => (
              <SelectItem key={index} value={category || 'undefined'}>
                {category || 'Kategorisiz'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Durum" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tüm Durumlar</SelectItem>
            <SelectItem value="taslak">Taslak</SelectItem>
            <SelectItem value="yayinda">Yayında</SelectItem>
            <SelectItem value="arsiv">Arşiv</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
