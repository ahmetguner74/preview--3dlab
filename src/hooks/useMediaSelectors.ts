
import { useState } from 'react';

export const useMediaSelectors = () => {
  const handleThreeDModelSelect = (models: {url: string, type: string}[], modelUrl: string) => {
    const newModels = [...models];
    const selectedModel = newModels.find(m => m.url === modelUrl && m.type === '3d_model');
    const otherModels = newModels.filter(m => m.url !== modelUrl || m.type !== '3d_model');
    
    if (selectedModel) {
      return [selectedModel, ...otherModels];
    }
    return newModels;
  };
  
  const handlePointCloudSelect = (models: {url: string, type: string}[], modelUrl: string) => {
    const newModels = [...models];
    const selectedModel = newModels.find(m => m.url === modelUrl && m.type === 'point_cloud');
    const otherModels = newModels.filter(m => m.url !== modelUrl || m.type !== 'point_cloud');
    
    if (selectedModel) {
      return [selectedModel, ...otherModels];
    }
    return newModels;
  };

  return {
    handleThreeDModelSelect,
    handlePointCloudSelect
  };
};
