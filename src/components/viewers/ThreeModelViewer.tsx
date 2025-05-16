
import React from 'react';

interface ThreeModelViewerProps {
  modelUrl: string;
  backgroundColor?: string;
}

const ThreeModelViewer: React.FC<ThreeModelViewerProps> = ({ modelUrl, backgroundColor = '#f5f5f5' }) => {
  // Sketchfab iframe kodunu kontrol et
  if (modelUrl?.includes('<iframe') && modelUrl?.includes('sketchfab.com')) {
    return (
      <div 
        className="w-full h-full min-h-[400px]" 
        dangerouslySetInnerHTML={{ __html: modelUrl }}
      />
    );
  }
  
  // Fab.com URL'sini kontrol et
  if (modelUrl?.startsWith('https://fab.com/')) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center flex-col">
        <iframe 
          src={`${modelUrl.replace('https://fab.com/', 'https://embed.fab.com/')}`}
          className="w-full h-full min-h-[400px] border-0"
          title="Fab.com 3D Model"
          allow="fullscreen; xr-spatial-tracking"
        />
        <div className="mt-2 text-sm text-center text-gray-500">
          <a 
            href={modelUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:underline"
          >
            Fab.com'da görüntüle
          </a>
        </div>
      </div>
    );
  }
  
  // Three.js yükleme hatası oluştuğundan, geçici olarak basit bir uyarı mesajı göster
  return (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 text-gray-500">
      <div className="text-center">
        <p>3D görüntüleyici geçici olarak devre dışı bırakıldı.</p>
        <p className="text-sm">Teknik ekibimiz bu sorun üzerinde çalışıyor.</p>
      </div>
    </div>
  );
};

export default ThreeModelViewer;
