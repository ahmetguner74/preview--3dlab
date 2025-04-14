
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from '@/types/project';

interface GeneralTabProps {
  project: Partial<Project>;
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string, fieldName: string) => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({
  project,
  isEditing,
  onInputChange,
  onSelectChange,
}) => {
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="bg-white p-6 rounded-md shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-medium mb-1">Genel Bilgiler</h2>
        <p className="text-sm text-gray-500">Projenin temel bilgilerini buradan düzenleyebilirsiniz.</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Proje Başlığı <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            name="title"
            value={project.title || ''}
            onChange={onInputChange}
            placeholder="Proje başlığını girin"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">
            SEO URL <span className="text-gray-400">(Boş bırakırsanız, başlıktan otomatik oluşturulacaktır.)</span>
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">/project/</span>
            <Input
              id="slug"
              name="slug"
              value={project.slug || ''}
              onChange={onInputChange}
              placeholder="proje-url-adresi"
              pattern="[a-z0-9-]+"
              title="Sadece küçük harfler, sayılar ve tire (-) kullanabilirsiniz"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Boş bırakırsanız, başlıktan otomatik oluşturulacaktır.
          </p>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Kısa Açıklama <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="description"
            name="description"
            value={project.description || ''}
            onChange={onInputChange}
            placeholder="Proje hakkında kısa bir açıklama yazın"
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Kategori <span className="text-red-500">*</span>
            </label>
            <Select 
              value={project.category || ''} 
              onValueChange={(value) => onSelectChange(value, 'category')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Kategori seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mimari">Mimari</SelectItem>
                <SelectItem value="ic-mimari">İç Mimari</SelectItem>
                <SelectItem value="restorasyon">Restorasyon</SelectItem>
                <SelectItem value="peyzaj">Peyzaj</SelectItem>
                <SelectItem value="kentsel-tasarim">Kentsel Tasarım</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-1">
              Durum
            </label>
            <Select 
              value={project.status || 'taslak'} 
              onValueChange={(value) => onSelectChange(value, 'status')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="taslak">Taslak</SelectItem>
                <SelectItem value="yayinda">Yayında</SelectItem>
                <SelectItem value="arsiv">Arşiv</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">
            Etiketler
          </label>
          <div className="flex items-center mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Etiket ekleyin"
              className="mr-2"
            />
            <Button 
              type="button" 
              onClick={handleAddTag} 
              variant="default"
            >
              Ekle
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-100 text-gray-800 px-2 py-1 text-sm rounded-md flex items-center"
              >
                {tag}
                <button 
                  type="button" 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length === 0 && (
              <span className="text-sm text-gray-500">Henüz etiket eklenmemiş.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralTab;
