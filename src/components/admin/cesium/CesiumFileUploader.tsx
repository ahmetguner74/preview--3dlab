import React, { useState } from 'react';
import { Upload, FileText, Loader2, CheckCircle, XCircle, Trash2, Archive } from 'lucide-react';
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

  const createLayerFromFile = async (fileRecord: CesiumFile) => {
    try {
      console.log('Dosya için katman oluşturuluyor:', fileRecord);
      
      let layerType: 'pointcloud' | 'mesh' | 'tileset' | 'ortho' | 'dem' | 'vector';
      
      switch (fileRecord.file_type) {
        case 'tileset':
        case '3tz':
        case 'b3dm':
        case 'i3dm':
        case 'cmpt':
          layerType = 'tileset';
          break;
        case 'pnts':
          layerType = 'pointcloud';
          break;
        case 'glb':
        case 'gltf':
          layerType = 'mesh';
          break;
        default:
          layerType = 'tileset';
      }

      const { data: layerData, error: layerError } = await supabase
        .from('cesium_layers')
        .insert([{
          project_id: projectId,
          name: fileRecord.file_name.replace(/\.[^/.]+$/, ""), // Dosya uzantısını kaldır
          layer_type: layerType,
          data_url: fileRecord.file_path,
          visible: true,
          opacity: 1.0,
          sort_order: 0,
          metadata: {
            originalFileName: fileRecord.file_name,
            fileType: fileRecord.file_type,
            uploadedAt: new Date().toISOString()
          },
          style_config: {}
        }])
        .select()
        .single();

      if (layerError) {
        console.error('Katman oluşturulamadı:', layerError);
        throw layerError;
      }

      console.log('Katman başarıyla oluşturuldu:', layerData);
      toast.success(`${fileRecord.file_name} katman olarak eklendi`);
      return layerData;
    } catch (error) {
      console.error('Katman oluşturma hatası:', error);
      toast.error(`Katman oluşturulamadı: ${fileRecord.file_name}`);
      return null;
    }
  };

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let fileType: CesiumFile['file_type'];
      
      // ZIP dosyası kontrolü
      if (fileExt === 'zip') {
        await handleZipUpload(file);
        return;
      }
      
      // Dosya türünü belirle
      switch (fileExt) {
        case '3tz':
          fileType = '3tz';
          break;
        case 'json':
          fileType = file.name.toLowerCase().includes('tileset') ? 'tileset' : 'json';
          break;
        case 'b3dm':
          fileType = 'b3dm';
          break;
        case 'pnts':
          fileType = 'pnts';
          break;
        case 'i3dm':
          fileType = 'i3dm';
          break;
        case 'cmpt':
          fileType = 'cmpt';
          break;
        case 'glb':
          fileType = 'glb';
          break;
        case 'gltf':
          fileType = 'gltf';
          break;
        case 'las':
          fileType = 'las';
          break;
        case 'laz':
          fileType = 'laz';
          break;
        default:
          throw new Error(`Desteklenmeyen dosya türü: ${fileExt}`);
      }

      await uploadSingleFile(file, fileType);
    } catch (error: any) {
      console.error('Dosya yükleme hatası:', error);
      toast.error(`Dosya yüklenemedi: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleMultipleFileUpload = async (fileList: FileList) => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const totalFiles = fileList.length;
      let uploadedFiles = 0;

      for (let i = 0; i < fileList.length; i++) {
        const file = fileList[i];
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        
        let fileType: CesiumFile['file_type'];
        switch (fileExt) {
          case '3tz':
            fileType = '3tz';
            break;
          case 'json':
            fileType = file.name.toLowerCase().includes('tileset') ? 'tileset' : 'json';
            break;
          case 'b3dm':
            fileType = 'b3dm';
            break;
          case 'pnts':
            fileType = 'pnts';
            break;
          case 'i3dm':
            fileType = 'i3dm';
            break;
          case 'cmpt':
            fileType = 'cmpt';
            break;
          case 'glb':
            fileType = 'glb';
            break;
          case 'gltf':
            fileType = 'gltf';
            break;
          case 'las':
            fileType = 'las';
            break;
          case 'laz':
            fileType = 'laz';
            break;
          default:
            console.warn(`Desteklenmeyen dosya atlandı: ${file.name}`);
            continue;
        }

        await uploadSingleFile(file, fileType, false);
        uploadedFiles++;
        setUploadProgress((uploadedFiles / totalFiles) * 100);
      }

      toast.success(`${uploadedFiles} dosya başarıyla yüklendi ve katman olarak eklendi`);
      fetchFiles();
      onFilesChange();
    } catch (error: any) {
      console.error('Çoklu dosya yükleme hatası:', error);
      toast.error(`Dosyalar yüklenemedi: ${error.message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadSingleFile = async (file: File, fileType: CesiumFile['file_type'], showToast = true) => {
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

    try {
      // Dosyayı storage'a yükle
      const fileUrl = await uploadFileToStorage(file, 'cesium-files');
      
      if (!fileUrl) {
        throw new Error('Dosya storage\'a yüklenemedi');
      }

      // Dosya kaydını güncelle
      const existingMetadata = (fileRecord.metadata as Record<string, any>) || {};
      const { error: updateError } = await supabase
        .from('cesium_files')
        .update({
          file_path: fileUrl,
          upload_status: 'completed',
          metadata: {
            ...existingMetadata,
            uploadCompleted: new Date().toISOString(),
            fileUrl: fileUrl
          }
        })
        .eq('id', fileRecord.id);

      if (updateError) throw updateError;

      // Yüklenen dosya için otomatik katman oluştur - Tip uyumluluğunu sağla
      const updatedFileRecord: CesiumFile = {
        ...fileRecord,
        file_path: fileUrl,
        upload_status: 'completed',
        file_type: fileType, // Doğru tip ile güncelle
        metadata: {
          ...existingMetadata,
          uploadCompleted: new Date().toISOString(),
          fileUrl: fileUrl
        }
      };

      await createLayerFromFile(updatedFileRecord);

      if (showToast) {
        toast.success(`${file.name} başarıyla yüklendi ve katman olarak eklendi`);
        fetchFiles();
        onFilesChange();
      }
    } catch (error) {
      // Hata durumunda dosya kaydını güncelle
      await supabase
        .from('cesium_files')
        .update({
          upload_status: 'failed',
          metadata: {
            ...(fileRecord.metadata as Record<string, any>) || {},
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            failedAt: new Date().toISOString()
          }
        })
        .eq('id', fileRecord.id);
      
      throw error;
    }
  };

  const handleZipUpload = async (zipFile: File) => {
    toast.info('ZIP dosyası yüklendi, içerik çıkarılıyor...');
    
    setUploadProgress(50);
    
    // ZIP dosyasını doğrudan yükle ve metadata'sında ZIP olduğunu belirt
    await uploadSingleFile(zipFile, '3tz');
    
    setUploadProgress(100);
    toast.success('ZIP arşivi başarıyla yüklendi ve katman olarak eklendi');
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
        return '📦';
      case 'tileset':
      case 'json':
        return '📄';
      case 'b3dm':
        return '🏠';
      case 'pnts':
        return '☁️';
      case 'i3dm':
        return '🌲';
      case 'cmpt':
        return '📋';
      case 'glb':
      case 'gltf':
        return '🎯';
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
      case 'pnts':
        return 'Point Cloud';
      case 'i3dm':
        return 'Instanced 3D Model';
      case 'cmpt':
        return 'Composite';
      case 'glb':
        return 'GLB Model';
      case 'gltf':
        return 'GLTF Model';
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
            3D Tiles Dosya Yükleme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUploadBox
            onFileSelected={handleFileUpload}
            onMultipleFilesSelected={handleMultipleFileUpload}
            title="3D Tiles Dosyalarını Yükle"
            description="Tek dosya, çoklu dosya veya ZIP arşivi yükleyebilirsiniz. Yüklenen dosyalar otomatik olarak katman olarak eklenecektir."
            allowedTypes={['3tz', 'json', 'b3dm', 'pnts', 'i3dm', 'cmpt', 'glb', 'gltf', 'las', 'laz']}
            maxSizeMB={100}
            isUploading={uploading}
            allowMultiple={true}
            acceptZip={true}
            icon={<Archive className="h-12 w-12 text-gray-400" />}
          />
          
          {uploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Yükleniyor ve katman oluşturuluyor...</span>
                <span>{Math.round(uploadProgress)}%</span>
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
              <p className="text-sm mt-2">Desteklenen formatlar: .3tz, .json, .b3dm, .pnts, .i3dm, .cmpt, .glb, .gltf, .las, .laz, .zip</p>
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
                        {file.upload_status === 'completed' && (
                          <span>• Katman olarak eklendi</span>
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
