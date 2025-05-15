
import React from 'react';
import { Cloud } from 'lucide-react';
import FileUploadBox from '@/components/admin/FileUploadBox';
import { toast } from "sonner";
import { upload3DModel } from '@/utils/project3DModels';

interface PointCloudUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  onPointCloudAdded: () => void;
}

const PointCloudUploader: React.FC<PointCloudUploaderProps> = ({
  projectId,
  isEditing,
  onPointCloudAdded
}) => {
  const handlePointCloudUpload = async (file: File) => {
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      console.log(`Nokta bulutu yükleme başlatılıyor: ${file.name}`);
      const modelUrl = await upload3DModel(file, projectId!, 'point_cloud');
      if (modelUrl) {
        toast.success('Nokta bulutu başarıyla yüklendi');
        onPointCloudAdded();
      } else {
        toast.error('Nokta bulutu yüklenirken bir hata oluştu');
        console.error('Nokta bulutu URL alınamadı');
      }
    } catch (error) {
      console.error('Nokta bulutu yüklenirken hata:', error);
      toast.error('Nokta bulutu yüklenirken bir hata oluştu');
    }
  };

  return (
    <FileUploadBox 
      onFileSelected={handlePointCloudUpload}
      title="Nokta Bulutu Dosyası Yükle"
      description="LAZ, LAS, XYZ, PTS formatları desteklenir."
      icon={<Cloud className="mx-auto h-12 w-12 text-gray-400" />}
      allowedTypes={['laz', 'las', 'xyz', 'pts']}
    />
  );
};

export default PointCloudUploader;
