
import React from 'react';
import EnhancedMapServiceForm from './EnhancedMapServiceForm';
import { MapService, CreateMapServiceRequest } from '@/types/mapService';

interface MapServiceFormProps {
  service?: MapService;
  onSubmit: (data: CreateMapServiceRequest) => void;
  onCancel: () => void;
  loading?: boolean;
}

const MapServiceForm: React.FC<MapServiceFormProps> = (props) => {
  return <EnhancedMapServiceForm {...props} />;
};

export default MapServiceForm;
