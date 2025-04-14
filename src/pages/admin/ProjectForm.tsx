
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types/project';
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Trash, Image, Cube, Settings, Plus } from 'lucide-react';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
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

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined && id !== 'new';

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("genel");
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);

  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    slug: '',
    description: '',
    location: '',
    category: '',
    year: '',
    client: '',
    area: '',
    architect: '',
    status: 'taslak',
    visible: false
  });

  useEffect(() => {
    if (isEditing) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProject(data || {});
    } catch (error) {
      console.error('Proje yüklenirken hata:', error);
      toast.error('Proje yüklenirken bir hata oluştu');
      navigate('/admin/projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'title' && !isEditing) {
      // Başlık değiştiğinde otomatik slug oluştur (sadece yeni projeler için)
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9ğüşiöç]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
        
      setProject((prev) => ({ ...prev, title: value, slug }));
    } else {
      setProject((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string, fieldName: string) => {
    setProject((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setProject((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project.title || !project.slug) {
      toast.error('Başlık ve URL alanları zorunludur');
      return;
    }
    
    try {
      setSaving(true);
      
      if (isEditing) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...project,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
          
        if (error) throw error;
        toast.success('Proje başarıyla güncellendi');
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            title: project.title!,
            slug: project.slug!,
            description: project.description,
            location: project.location,
            category: project.category,
            year: project.year,
            client: project.client,
            area: project.area,
            architect: project.architect,
            status: project.status,
            visible: project.visible
          });
          
        if (error) {
          // Slug benzersizlik hatası kontrolü
          if (error.code === '23505' && error.details?.includes('slug')) {
            toast.error('Bu URL zaten kullanılıyor. Lütfen başka bir URL seçin.');
            return;
          }
          throw error;
        }
        
        toast.success('Proje başarıyla oluşturuldu');
      }
      
      navigate('/admin/projects');
    } catch (error) {
      console.error('Proje kaydedilirken hata:', error);
      toast.error('Proje kaydedilemedi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
        <p className="mt-2">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
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
            onClick={handleSubmit}
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

      <div className="flex gap-6">
        <div className="w-64 flex-shrink-0">
          <div className="bg-white p-4 rounded-md shadow-sm mb-4">
            <ul className="space-y-1">
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                  onClick={() => setActiveTab("genel")}
                >
                  <span className="truncate">Gösterge Paneli</span>
                </Button>
              </li>
              <li>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start px-2 font-normal"
                  onClick={() => setActiveTab("genel")}
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
        
        <div className="flex-1">
          <Tabs defaultValue="genel" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-gray-100 mb-6">
              <TabsTrigger value="genel">Genel</TabsTrigger>
              <TabsTrigger value="icerik">İçerik</TabsTrigger>
              <TabsTrigger value="medya">Medya</TabsTrigger>
              <TabsTrigger value="nokta-bulutu">Nokta Bulutu</TabsTrigger>
              <TabsTrigger value="3d-model">3D Model</TabsTrigger>
              <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
            </TabsList>
            
            {/* GENEL SEKMESİ */}
            <TabsContent value="genel" className="bg-white p-6 rounded-md shadow-sm">
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
                    onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                      onValueChange={(value) => handleSelectChange(value, 'category')}
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
                      onValueChange={(value) => handleSelectChange(value, 'status')}
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
            </TabsContent>
            
            {/* İÇERİK SEKMESİ */}
            <TabsContent value="icerik" className="bg-white p-6 rounded-md shadow-sm">
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    placeholder="Mimar adı"
                  />
                </div>
              </div>
            </TabsContent>
            
            {/* MEDYA SEKMESİ */}
            <TabsContent value="medya" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
                <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Ana Görsel</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button variant="default">
                        <Plus size={16} className="mr-1" /> Ana Görsel Yükle
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF formatları desteklenir. Maksimum 5MB.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Galeri Görselleri</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <Button variant="default">
                        <Plus size={16} className="mr-1" /> Görsel Ekle
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      Birden fazla görsel ekleyebilirsiniz. Sürükleyerek sıralayabilirsiniz.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {/* Burada yüklenmiş görseller listelenecek */}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Video</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                    <div className="mt-2">
                      <Button variant="default">
                        <Plus size={16} className="mr-1" /> Video Ekle
                      </Button>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      YouTube veya Vimeo video URL'si ekleyebilirsiniz.
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Before/After Görselleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button variant="default">
                          <Plus size={16} className="mr-1" /> Öncesi
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-2">
                        <Button variant="default">
                          <Plus size={16} className="mr-1" /> Sonrası
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* NOKTA BULUTU SEKMESİ */}
            <TabsContent value="nokta-bulutu" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">Nokta Bulutu</h2>
                <p className="text-sm text-gray-500">Projeye ait nokta bulutu verilerini buradan yükleyebilirsiniz.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Cube className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="default">
                    <Plus size={16} className="mr-1" /> Nokta Bulutu Yükle
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  PLY, XYZ, PTS formatları desteklenir. Yüklenen dosyalar Potree ile görüntülenecektir.
                </p>
              </div>
            </TabsContent>
            
            {/* 3D MODEL SEKMESİ */}
            <TabsContent value="3d-model" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">3D Model</h2>
                <p className="text-sm text-gray-500">Projeye ait 3D modelleri buradan yükleyebilirsiniz.</p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                <Cube className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Button variant="default">
                    <Plus size={16} className="mr-1" /> 3D Model Yükle
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir.
                </p>
              </div>
            </TabsContent>
            
            {/* AYARLAR SEKMESİ */}
            <TabsContent value="ayarlar" className="bg-white p-6 rounded-md shadow-sm">
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
                    onChange={handleCheckboxChange}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
