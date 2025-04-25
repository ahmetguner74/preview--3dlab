
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import PanoramaUploader from '../PanoramaUploader';

interface GeneralTabProps {
  title: string;
  setTitle: (title: string) => void;
  tourId?: string;
  onUploadComplete: () => void;
}

const GeneralTab: React.FC<GeneralTabProps> = ({ 
  title, 
  setTitle, 
  tourId,
  onUploadComplete 
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label className="block text-sm font-medium mb-1">Başlık</Label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Panorama başlığı"
        />
      </div>
      
      <div>
        <Label className="block text-sm font-medium mb-2">Panorama Görseli</Label>
        {tourId ? (
          <PanoramaUploader 
            tourId={tourId}
            onComplete={onUploadComplete}
          />
        ) : (
          <Alert>
            <AlertDescription>
              Panorama yükleyebilmek için önce turu kaydetmeniz gerekmektedir.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default GeneralTab;
