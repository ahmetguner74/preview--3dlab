
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus, ProjectImage, ProjectVideo, Project3DModel } from '@/types/project';
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Trash, 
  Image, 
  Box, 
  Settings, 
  Plus,
  Video,
  X,
  UploadCloud,
  Link2
} from 'lucide-react';
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
import FileUploadBox from '@/components/admin/FileUploadBox';
import { uploadProjectImage, addProjectVideo, upload3DModel, getProjectImages, getProjectVideos, getProject3DModels } from '@/utils/mediaHelpers';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id !== undefined && id !== 'new';

  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("genel");
  const [newTag, setNewTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [projectVideos, setProjectVideos] = useState<ProjectVideo[]>([]);
  const [project3DModels, setProject3DModels] = useState<Project3DModel[]>([]);

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

      // Projeye ait görselleri, videoları ve 3D modelleri getir
      if (id) {
        const images = await getProjectImages(id);
        const videos = await getProjectVideos(id);
        const models = await getProject3DModels(id);
        
        setProjectImages(images as ProjectImage[]);
        setProjectVideos(videos as ProjectVideo[]);
        setProject3DModels(models as Project3DModel[]);
      }
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

  const handleVideoUrlAdd = async () => {
    if (!videoUrl.trim()) {
      toast.error('Video URL boş olamaz');
      return;
    }
    
    if (!id && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const success = await addProjectVideo(videoUrl, id!);
      if (success) {
        toast.success('Video başarıyla eklendi');
        setVideoUrl('');
        // Yeni video listesini getir
        const videos = await getProjectVideos(id!);
        setProjectVideos(videos as ProjectVideo[]);
      } else {
        toast.error('Video eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Video eklenirken hata:', error);
      toast.error('Video eklenirken bir hata oluştu');
    }
  };

  const handleImageUpload = async (file: File, imageType: 'main' | 'gallery' | 'before' | 'after' = 'gallery') => {
    if (!id && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const imageUrl = await uploadProjectImage(file, id!, imageType);
      if (imageUrl) {
        toast.success('Görsel başarıyla yüklendi');
        // Yeni görsel listesini getir
        const images = await getProjectImages(id!);
        setProjectImages(images as ProjectImage[]);
      } else {
        toast.error('Görsel yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Görsel yüklenirken hata:', error);
      toast.error('Görsel yüklenirken bir hata oluştu');
    }
  };

  const handle3DModelUpload = async (file: File, modelType: '3d_model' | 'point_cloud' = '3d_model') => {
    if (!id && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const modelUrl = await upload3DModel(file, id!, modelType);
      if (modelUrl) {
        toast.success('Model başarıyla yüklendi');
        // Yeni model listesini getir
        const models = await getProject3DModels(id!);
        setProject3DModels(models as Project3DModel[]);
      } else {
        toast.error('Model yüklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Model yüklenirken hata:', error);
      toast.error('Model yüklenirken bir hata oluştu');
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('project_images')
        .delete()
        .eq('id', imageId);
      
      if (error) throw error;
      
      // Güncel görsel listesini getir
      setProjectImages(projectImages.filter(img => img.id !== imageId));
      toast.success('Görsel başarıyla silindi');
    } catch (error) {
      console.error('Görsel silinirken hata:', error);
      toast.error('Görsel silinirken bir hata oluştu');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('project_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      
      // Güncel video listesini getir
      setProjectVideos(projectVideos.filter(video => video.id !== videoId));
      toast.success('Video başarıyla silindi');
    } catch (error) {
      console.error('Video silinirken hata:', error);
      toast.error('Video silinirken bir hata oluştu');
    }
  };

  const handleDelete3DModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('project_3d_models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      // Güncel model listesini getir
      setProject3DModels(project3DModels.filter(model => model.id !== modelId));
      toast.success('Model başarıyla silindi');
    } catch (error) {
      console.error('Model silinirken hata:', error);
      toast.error('Model silinirken bir hata oluştu');
    }
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
        const { data, error } = await supabase
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
          })
          .select();
          
        if (error) {
          if (error.code === '23505' && error.details?.includes('slug')) {
            toast.error('Bu URL zaten kullanılıyor. Lütfen başka bir URL seçin.');
            return;
          }
          throw error;
        }
        
        toast.success('Proje başarıyla oluşturuldu');
        
        // Yeni oluşturulan projenin düzenleme sayfasına git
        if (data && data.length > 0) {
          navigate(`/admin/projects/${data[0].id}/edit`);
        } else {
          navigate('/admin/projects');
        }
      }
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
            
            <TabsContent value="medya" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">Medya Galerisi</h2>
                <p className="text-sm text-gray-500">Proje görsellerini ve videolarını buradan yükleyebilirsiniz.</p>
              </div>
              
              <div className="space-y-6">
                {/* Ana Görsel Yükleme */}
                <div>
                  <h3 className="text-md font-medium mb-2">Ana Görsel</h3>
                  <FileUploadBox 
                    onFileSelected={(file) => handleImageUpload(file, 'main')}
                    title="Ana Görsel Yükle"
                    description="PNG, JPG, GIF formatları desteklenir. Maksimum 5MB."
                    icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                    allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
                  />

                  {/* Ana Görsel Önizleme */}
                  {projectImages.filter(img => img.image_type === 'main').length > 0 && (
                    <div className="mt-4">
                      {projectImages
                        .filter(img => img.image_type === 'main')
                        .map(img => (
                          <div key={img.id} className="relative">
                            <img 
                              src={img.image_url} 
                              alt="Ana görsel" 
                              className="w-full h-48 object-cover rounded-md"
                            />
                            <Button 
                              variant="destructive" 
                              size="icon" 
                              className="absolute top-2 right-2"
                              onClick={() => handleDeleteImage(img.id)}
                            >
                              <X size={16} />
                            </Button>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
                
                {/* Galeri Görselleri Yükleme */}
                <div>
                  <h3 className="text-md font-medium mb-2">Galeri Görselleri</h3>
                  <FileUploadBox 
                    onFileSelected={(file) => handleImageUpload(file, 'gallery')}
                    title="Görsel Ekle"
                    description="Birden fazla görsel ekleyebilirsiniz. Sürükleyerek sıralayabilirsiniz."
                    icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                    allowedTypes={['jpg', 'jpeg', 'png', 'gif']}
                  />

                  {/* Galeri Görselleri Listesi */}
                  {projectImages.filter(img => img.image_type === 'gallery').length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {projectImages
                        .filter(img => img.image_type === 'gallery')
                        .map(img => (
                          <div key={img.id} className="relative group">
                            <img 
                              src={img.image_url} 
                              alt="Galeri görseli" 
                              className="w-full h-24 object-cover rounded-md"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleDeleteImage(img.id)}
                              >
                                <X size={14} />
                              </Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
                
                {/* Video Ekleme */}
                <div>
                  <h3 className="text-md font-medium mb-2">Video</h3>
                  <div className="flex gap-2 mb-4">
                    <Input 
                      placeholder="YouTube veya Vimeo video URL'si"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                    <Button onClick={handleVideoUrlAdd}>
                      <Plus size={16} className="mr-1" /> Ekle
                    </Button>
                  </div>

                  {/* Video Listesi */}
                  {projectVideos.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {projectVideos.map(video => (
                        <div key={video.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <Video className="h-5 w-5 mr-2 text-gray-500" />
                            <a 
                              href={video.video_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm truncate max-w-md"
                            >
                              {video.video_url}
                            </a>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteVideo(video.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Before/After Görselleri */}
                <div>
                  <h3 className="text-md font-medium mb-2">Before/After Görselleri</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <FileUploadBox 
                        onFileSelected={(file) => handleImageUpload(file, 'before')}
                        title="Öncesi Görseli"
                        description="Önceki durumu gösteren görsel"
                        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                        allowedTypes={['jpg', 'jpeg', 'png']}
                      />
                      
                      {/* Before Görsel Önizleme */}
                      {projectImages.filter(img => img.image_type === 'before').length > 0 && (
                        <div className="mt-4">
                          {projectImages
                            .filter(img => img.image_type === 'before')
                            .map(img => (
                              <div key={img.id} className="relative">
                                <img 
                                  src={img.image_url} 
                                  alt="Before görseli" 
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute top-2 right-2"
                                  onClick={() => handleDeleteImage(img.id)}
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <FileUploadBox 
                        onFileSelected={(file) => handleImageUpload(file, 'after')}
                        title="Sonrası Görseli"
                        description="Mevcut durumu gösteren görsel"
                        icon={<Image className="mx-auto h-12 w-12 text-gray-400" />}
                        allowedTypes={['jpg', 'jpeg', 'png']}
                      />
                      
                      {/* After Görsel Önizleme */}
                      {projectImages.filter(img => img.image_type === 'after').length > 0 && (
                        <div className="mt-4">
                          {projectImages
                            .filter(img => img.image_type === 'after')
                            .map(img => (
                              <div key={img.id} className="relative">
                                <img 
                                  src={img.image_url} 
                                  alt="After görseli" 
                                  className="w-full h-32 object-cover rounded-md"
                                />
                                <Button 
                                  variant="destructive" 
                                  size="icon" 
                                  className="absolute top-2 right-2"
                                  onClick={() => handleDeleteImage(img.id)}
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            ))
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="nokta-bulutu" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">Nokta Bulutu</h2>
                <p className="text-sm text-gray-500">Projeye ait nokta bulutu verilerini buradan yükleyebilirsiniz.</p>
              </div>
              
              <FileUploadBox 
                onFileSelected={(file) => handle3DModelUpload(file, 'point_cloud')}
                title="Nokta Bulutu Yükle"
                description="PLY, XYZ, PTS formatları desteklenir. Yüklenen dosyalar Potree ile görüntülenecektir."
                icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
                allowedTypes={['ply', 'xyz', 'pts']}
              />

              {/* Nokta Bulutu Listesi */}
              {project3DModels.filter(model => model.model_type === 'point_cloud').length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Yüklü Nokta Bulutu Dosyaları</h3>
                  <div className="space-y-2">
                    {project3DModels
                      .filter(model => model.model_type === 'point_cloud')
                      .map(model => (
                        <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <Box className="h-5 w-5 mr-2 text-gray-500" />
                            <a 
                              href={model.model_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm truncate max-w-md"
                            >
                              {model.model_url.split('/').pop()}
                            </a>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete3DModel(model.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="3d-model" className="bg-white p-6 rounded-md shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl font-medium mb-1">3D Model</h2>
                <p className="text-sm text-gray-500">Projeye ait 3D modelleri buradan yükleyebilirsiniz.</p>
              </div>
              
              <FileUploadBox 
                onFileSelected={(file) => handle3DModelUpload(file, '3d_model')}
                title="3D Model Yükle"
                description="OBJ, GLTF, GLB formatları desteklenir. Modeller Three.js ile görüntülenecektir."
                icon={<Box className="mx-auto h-12 w-12 text-gray-400" />}
                allowedTypes={['obj', 'gltf', 'glb']}
              />

              {/* 3D Model Listesi */}
              {project3DModels.filter(model => model.model_type === '3d_model').length > 0 && (
                <div className="mt-6">
                  <h3 className="text-md font-medium mb-2">Yüklü 3D Modeller</h3>
                  <div className="space-y-2">
                    {project3DModels
                      .filter(model => model.model_type === '3d_model')
                      .map(model => (
                        <div key={model.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <Box className="h-5 w-5 mr-2 text-gray-500" />
                            <a 
                              href={model.model_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm truncate max-w-md"
                            >
                              {model.model_url.split('/').pop()}
                            </a>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDelete3DModel(model.id)}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      ))
                    }
                  </div>
                </div>
              )}
            </TabsContent>
            
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
