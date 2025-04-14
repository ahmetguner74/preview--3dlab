
import React from 'react';

interface PointCloudLoadingProps {
  isLoading: boolean;
}

const PointCloudLoading: React.FC<PointCloudLoadingProps> = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
      <p className="mt-2 text-sm">Nokta bulutu yükleniyor...</p>
    </div>
  );
};

export default PointCloudLoading;
