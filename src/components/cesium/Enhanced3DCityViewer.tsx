
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Layers, MapPin, Settings, Eye, EyeOff } from 'lucide-react';
import EnhancedCesiumViewer from './EnhancedCesiumViewer';
import EnhancedLayerManager from './EnhancedLayerManager';
import { useCesiumProjects, useCesiumLayers } from '@/hooks/useCesiumData';
import { CesiumNote } from '@/types/cesiumFiles';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Enhanced3DCityViewerProps {
  projectId?: string;
  showControls?: boolean;
}

const Enhanced3DCityViewer: React.FC<Enhanced3DCityViewerProps> = ({
  projectId,
  showControls = true
}) => {
  const { projects } = useCesiumProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projectId || '');
  const { layers, toggleLayerVisibility, updateLayerOpacity } = useCesiumLayers(selectedProjectId);
  const [notes, setNotes] = useState<CesiumNote[]>([]);
  const [viewerMode, setViewerMode] = useState<'3d' | '2d'>('3d');
  const [showUI, setShowUI] = useState(true);

  useEffect(() => {
    if (selectedProjectId) {
      fetchNotes();
    }
  }, [selectedProjectId]);

  const fetchNotes = async () => {
    if (!selectedProjectId) return;
    
    try {
      const { data, error } = await supabase
        .from('cesium_notes')
        .select('*')
        .eq('project_id', selectedProjectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Notlar yüklenirken hata:', error);
    }
  };

  const handleNoteClick = (note: CesiumNote) => {
    // Viewer'da nota odaklan
    toast.info(`${note.title} notuna odaklanılıyor`);
    console.log('Nota odaklanılıyor:', note);
  };

  const handleLayerLoad = (layerId: string, success: boolean) => {
    if (success) {
      console.log(`Katman başarıyla yüklendi: ${layerId}`);
    } else {
      console.error(`Katman yüklenemedi: ${layerId}`);
      toast.error('Katman yüklenirken hata oluştu');
    }
  };

  const selectedProject = projects.find(p => p.id === selectedProjectId);
  const visibleLayers = layers.filter(layer => layer.visible);

  return (
    <div className="h-full w-full relative bg-gray-900">
      {/* Ana 3D Viewer */}
      <div className="absolute inset-0">
        <EnhancedCesiumViewer
          layers={visibleLayers}
          onLayerLoad={handleLayerLoad}
          className="h-full w-full"
        />
      </div>

      {/* UI Kontrol Panel */}
      {showControls && showUI && (
        <div className="absolute top-4 right-4 w-96 max-h-[calc(100vh-2rem)] overflow-hidden flex flex-col bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-lg">3D Şehir Modeli</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUI(false)}
            >
              <EyeOff size={16} />
            </Button>
          </div>

          <Tabs defaultValue="projects" className="flex-grow flex flex-col">
            <TabsList className="grid w-full grid-cols-3 m-2">
              <TabsTrigger value="projects">Projeler</TabsTrigger>
              <TabsTrigger value="layers">Katmanlar</TabsTrigger>
              <TabsTrigger value="notes">Notlar</TabsTrigger>
            </TabsList>

            <div className="flex-grow overflow-y-auto">
              <TabsContent value="projects" className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Aktif Proje</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Proje seçiniz...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{selectedProject.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge>{selectedProject.status}</Badge>
                        <Badge variant={selectedProject.visible ? "default" : "secondary"}>
                          {selectedProject.visible ? "Görünür" : "Gizli"}
                        </Badge>
                      </div>
                      {selectedProject.description && (
                        <p className="text-sm text-gray-600">{selectedProject.description}</p>
                      )}
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Katmanlar: {layers.length}</div>
                        <div>Notlar: {notes.length}</div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="layers" className="p-4">
                {selectedProjectId ? (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600">
                      {layers.length} katman • {visibleLayers.length} görünür
                    </div>
                    {layers.map((layer) => (
                      <Card key={layer.id} className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{layer.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {layer.layer_type}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs">Görünür</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleLayerVisibility(layer.id, !layer.visible)}
                            >
                              {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                            </Button>
                          </div>
                          {layer.visible && (
                            <div>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Şeffaflık</span>
                                <span>{Math.round(layer.opacity * 100)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={layer.opacity * 100}
                                onChange={(e) => updateLayerOpacity(layer.id, parseInt(e.target.value) / 100)}
                                className="w-full"
                              />
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Layers size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Proje seçin</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="notes" className="p-4 space-y-3">
                {selectedProjectId ? (
                  notes.length > 0 ? (
                    notes.map((note) => (
                      <Card 
                        key={note.id} 
                        className="p-3 cursor-pointer hover:bg-gray-50"
                        onClick={() => handleNoteClick(note)}
                      >
                        <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                        {note.description && (
                          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                            {note.description}
                          </p>
                        )}
                        <div className="text-xs text-gray-500">
                          📍 {note.latitude.toFixed(4)}, {note.longitude.toFixed(4)}
                        </div>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Bu proje için not bulunamadı</p>
                    </div>
                  )
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Proje seçin</p>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}

      {/* UI Göster/Gizle Butonu */}
      {showControls && !showUI && (
        <Button
          className="absolute top-4 right-4"
          onClick={() => setShowUI(true)}
        >
          <Eye size={16} className="mr-2" />
          Kontrolleri Göster
        </Button>
      )}

      {/* Alt Bilgi Çubuğu */}
      {showControls && (
        <div className="absolute bottom-4 left-4 bg-black/75 text-white px-4 py-2 rounded-lg text-sm">
          <div className="flex items-center gap-4">
            <span>🎮 Mouse: Döndür/Yakınlaştır</span>
            <span>🖱️ Sağ Tık: Pan</span>
            <span>⚡ {layers.length} Katman Yüklü</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enhanced3DCityViewer;
