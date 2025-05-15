
import React from 'react';
import { Info } from 'lucide-react';

const PointCloudInfoMessage: React.FC = () => {
  return (
    <div className="mb-6 bg-blue-50 border border-blue-200 p-4 rounded flex">
      <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
      <div>
        <p className="text-sm text-blue-700">
          Artık hem dosya yükleme, URL ekleme hem de doğrudan iframe kodu yapıştırarak Agisoft Cloud gibi servislerdeki nokta bulutlarını ekleyebilirsiniz.
        </p>
      </div>
    </div>
  );
};

export default PointCloudInfoMessage;
