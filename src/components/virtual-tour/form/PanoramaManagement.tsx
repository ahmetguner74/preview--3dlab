
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PanoramaEditor from '@/components/virtual-tour/PanoramaEditor';
import PanoramaList from './PanoramaList';
import PanoramaUploader from '@/components/virtual-tour/PanoramaUploader';

interface PanoramaManagementProps {
  tourId: string;
  panoramas: any[];
  onPanoramaAdded: () => void;
}

const PanoramaManagement: React.FC<PanoramaManagementProps> = ({ 
  tourId, 
  panoramas,
  onPanoramaAdded 
}) => {
  const [showPanoramaEditor, setShowPanoramaEditor] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Panoramalar</h2>
        <Button onClick={() => setShowPanoramaEditor(true)}>
          Panorama Ekle
        </Button>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-medium mb-3">Panorama Yükle</h3>
        <PanoramaUploader 
          tourId={tourId}
          onComplete={() => {
            onPanoramaAdded();
            toast.success('Panoramalar başarıyla yüklendi');
          }}
        />
      </div>

      <PanoramaList 
        panoramas={panoramas}
        onRefresh={onPanoramaAdded}
      />

      {showPanoramaEditor && (
        <PanoramaEditor
          tourId={tourId}
          onSave={async (data) => {
            try {
              const { error } = await supabase
                .from('tour_panoramas')
                .insert({
                  tour_id: tourId,
                  title: data.title,
                  image_url: data.image_url,
                  initial_view: data.initial_view,
                  sort_order: panoramas.length
                });

              if (error) throw error;
              toast.success('Panorama başarıyla eklendi');
              setShowPanoramaEditor(false);
              onPanoramaAdded();
            } catch (error) {
              console.error('Panorama eklenirken hata:', error);
              toast.error('Panorama eklenemedi');
            }
          }}
        />
      )}
    </div>
  );
};

export default PanoramaManagement;
