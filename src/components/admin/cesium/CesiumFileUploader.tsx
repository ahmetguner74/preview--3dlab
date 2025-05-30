
import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { uploadFileToStorage } from '@/utils/fileStorage';
import { CesiumFile } from '@/types/cesiumFiles';
import FileUploadBox from '@/components/admin/FileUploadBox';

interface CesiumFileUploaderProps {
  projectId: string;
  onFilesChange: () => void;
}

const CesiumFileUploader: React.FC<CesiumFileUploaderProps> = ({
  projectId,
  onFilesChange
}) => {
  const [files, setFiles] = useState<CesiumFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  React.useEffect(() => {
    fetchFiles();
  }, [projectId]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('cesium_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setFiles(data?.map(file => ({
        ...file,
        file_type: file.file_type as CesiumFile['file_type'],
        upload_status: file.upload_status as CesiumFile['upload_status'],
        metadata: (file.metadata as Record<string, any>) || {}
      })) || []);
    } catch (error) {
      console.error('Dosyalar yüklenirken hata:', error);
      toast.error('Dosyalar yüklenirken hata oluştu');
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      // Dosya türünü belirle
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let fileType: CesiumFile['file_type'];
      
      switch (fileExt) {
        case '3tz':
          fileType = '3tz';
          break;
        case 'json':
          fileType = 'json';
          break;
        case 'b3dm':
          fileType = 'b3dm';
          break;
        case 'las':
          fileType = 'las';
          break;
        case 'laz':
          fileType = 'laz';
          break;
        default:
          if (file.name.includes('tileset')) {
            fileType = 'tileset';
          } else {
            throw new Error('Desteklenmeyen dosya türü');
          }
      }

      // Veritabanına dosya kaydını ekle
      const { data: fileRecord, error: dbError } = await supabase
        .from('cesium_files')
        .insert([{
          project_id: projectId,
          file_name: file.name,
          file_path: '',
          file_type: fileType,
          file_size: file.size,
          upload_status: 'uploading',
          metadata: {
            originalName: file.name,
            uploadStarted: new Date().toISOString()
          }
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      setUploadProgress(25);

      // Dosyayı storage'a yükle
      const fileUrl = await uploadFileToStorage(file, 'cesium-files');
      
      if (!fileUrl) {
        throw new Error('Dosya yükleme başarısız');
      }

      setUploadProgress(75);

      // Dosya kaydını güncelle
      const { error: updateError } = await supabase
        .from('cesium_files')
        .update({
          file_path: fileUrl,
          upload_status: 'completed',
          metadata: {
            ...fileRecord.metadata,
            uploadCompleted: new Date().toISOString(),
            fileUrl: fileUrl
          }
        })
        .eq('id', fileRecord.id);

      if (updateError) throw updateError;

      setUploadProgress(100);
      toast.success(`${file.name} başarıyla yüklendi`);
      fetchFiles();
      onFilesChange();
    } catch (error: any) {
      console.error('Dosya yükleme hatası:', error);
      toast.error(`Dosya yüklenemedi: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const deleteFile = async (fileId: string) => {
    if (!window.confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('cesium_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;
      
      toast.success('Dosya silindi');
      fetchFiles();
      onFilesChange();
    } catch (error) {
      console.error('Dosya silinirken hata:', error);
      toast.error('Dosya silinemedi');
    }
  };

  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case '3tz':
        return '🏗️';
      case 'tileset':
      case 'json':
        return '📄';
      case 'b3dm':
        return '🏠';
      case 'las':
      case 'laz':
        return '☁️';
      default:
        return '📁';
    }
  };

  const getFileTypeName = (fileType: string) => {
    switch (fileType) {
      case '3tz':
        return '3D Tiles Archive';
      case 'tileset':
        return 'Tileset JSON';
      case 'json':
        return 'JSON Dosyası';
      case 'b3dm':
        return 'Batched 3D Model';
      case 'las':
        return 'LAS Nokta Bulutu';
      case 'laz':
        return 'LAZ Nokta Bulutu';
      default:
        return 'Bilinmeyen';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500"><CheckCircle size={12} className="mr-1" />Tamamlandı</Badge>;
      case 'uploading':
        return <Badge className="bg-blue-500"><Loader2 size={12} className="mr-1 animate-spin" />Yükleniyor</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle size={12} className="mr-1" />Başarısız</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Dosya Yükleme Alanı */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload size={20} />
            Dosya Yükleme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadBox
            onFileSelected={handleFileUpload}
            title="Cesium Dosyalarını Yükle"
            description="Sürükle-bırak veya tıklayarak dosya seç (.3tz, .json, .b3dm, .las, .laz)"
            allowedTypes={['3tz', 'json', 'b3dm', 'las', 'laz']}
            maxSizeMB={100}
            isUploading={uploading}
            icon={<FileText className="h-12 w-12 text-gray-400" />}
          />
          
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Yükleniyor...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dosya Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText size={20} />
            Yüklenen Dosyalar ({files.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {files.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>Bu proje için henüz dosya yüklenmemiş</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-grow min-w-0">
                    <span className="text-2xl">{getFileTypeIcon(file.file_type)}</span>
                    <div className="min-w-0 flex-grow">
                      <div className="font-medium truncate" title={file.file_name}>
                        {file.file_name}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-2">
                        <span>{getFileTypeName(file.file_type)}</span>
                        {file.file_size && (
                          <span>• {(file.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(file.upload_status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CesiumFileUploader;
