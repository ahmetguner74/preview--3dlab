
import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { CesiumNote } from '@/types/cesiumFiles';

interface CesiumNotesManagerProps {
  projectId: string;
  onNoteSelect?: (note: CesiumNote) => void;
}

const CesiumNotesManager: React.FC<CesiumNotesManagerProps> = ({
  projectId,
  onNoteSelect
}) => {
  const [notes, setNotes] = useState<CesiumNote[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<CesiumNote[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [editingNote, setEditingNote] = useState<CesiumNote | null>(null);
  const [noteForm, setNoteForm] = useState({
    title: '',
    description: '',
    latitude: 0,
    longitude: 0,
    height: 0
  });

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  useEffect(() => {
    filterNotes();
  }, [notes, searchTerm]);

  const fetchNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('cesium_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
    } catch (error) {
      console.error('Notlar yüklenirken hata:', error);
      toast.error('Notlar yüklenirken hata oluştu');
    }
  };

  const filterNotes = () => {
    if (!searchTerm) {
      setFilteredNotes(notes);
    } else {
      const filtered = notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNotes(filtered);
    }
  };

  const handleSaveNote = async () => {
    try {
      if (!noteForm.title.trim()) {
        toast.error('Not başlığı gereklidir');
        return;
      }

      if (editingNote) {
        // Güncelleme
        const { error } = await supabase
          .from('cesium_notes')
          .update({
            title: noteForm.title,
            description: noteForm.description || null,
            latitude: noteForm.latitude,
            longitude: noteForm.longitude,
            height: noteForm.height
          })
          .eq('id', editingNote.id);

        if (error) throw error;
        toast.success('Not güncellendi');
      } else {
        // Yeni not
        const { error } = await supabase
          .from('cesium_notes')
          .insert([{
            project_id: projectId,
            title: noteForm.title,
            description: noteForm.description || null,
            latitude: noteForm.latitude,
            longitude: noteForm.longitude,
            height: noteForm.height
          }]);

        if (error) throw error;
        toast.success('Not eklendi');
      }

      setShowNoteDialog(false);
      setEditingNote(null);
      resetForm();
      fetchNotes();
    } catch (error) {
      console.error('Not kaydedilirken hata:', error);
      toast.error('Not kaydedilemedi');
    }
  };

  const handleEditNote = (note: CesiumNote) => {
    setEditingNote(note);
    setNoteForm({
      title: note.title,
      description: note.description || '',
      latitude: note.latitude,
      longitude: note.longitude,
      height: note.height || 0
    });
    setShowNoteDialog(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Bu notu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cesium_notes')
        .delete()
        .eq('id', noteId);

      if (error) throw error;
      
      toast.success('Not silindi');
      fetchNotes();
    } catch (error) {
      console.error('Not silinirken hata:', error);
      toast.error('Not silinemedi');
    }
  };

  const resetForm = () => {
    setNoteForm({
      title: '',
      description: '',
      latitude: 0,
      longitude: 0,
      height: 0
    });
  };

  const formatCoordinates = (lat: number, lng: number) => {
    return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin size={20} />
              Proje Notları ({filteredNotes.length})
            </CardTitle>
            <Button
              onClick={() => {
                setEditingNote(null);
                resetForm();
                setShowNoteDialog(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus size={16} />
              Yeni Not
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Arama */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Notlarda ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Not Listesi */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin size={48} className="mx-auto mb-4 opacity-50" />
              <p>{searchTerm ? 'Arama sonucu bulunamadı' : 'Bu proje için henüz not eklenmemiş'}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredNotes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => onNoteSelect?.(note)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-grow min-w-0">
                      <h4 className="font-medium truncate" title={note.title}>
                        {note.title}
                      </h4>
                      {note.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {note.description}
                        </p>
                      )}
                      <div className="text-xs text-gray-500 mt-2 flex items-center gap-4">
                        <span>📍 {formatCoordinates(note.latitude, note.longitude)}</span>
                        {note.height !== 0 && (
                          <span>⬆️ {note.height?.toFixed(2)}m</span>
                        )}
                        <span>📅 {new Date(note.created_at).toLocaleDateString('tr-TR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditNote(note);
                        }}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(note.id);
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Not Ekleme/Düzenleme Dialog */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNote ? 'Not Düzenle' : 'Yeni Not Ekle'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <Input
                value={noteForm.title}
                onChange={(e) => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Not başlığı"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Açıklama</label>
              <Textarea
                value={noteForm.description}
                onChange={(e) => setNoteForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Not açıklaması"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Enlem</label>
                <Input
                  type="number"
                  step="any"
                  value={noteForm.latitude}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, latitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="39.9334"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Boylam</label>
                <Input
                  type="number"
                  step="any"
                  value={noteForm.longitude}
                  onChange={(e) => setNoteForm(prev => ({ ...prev, longitude: parseFloat(e.target.value) || 0 }))}
                  placeholder="32.8597"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Yükseklik (metre)</label>
              <Input
                type="number"
                step="any"
                value={noteForm.height}
                onChange={(e) => setNoteForm(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNoteDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleSaveNote}>
              {editingNote ? 'Güncelle' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CesiumNotesManager;
