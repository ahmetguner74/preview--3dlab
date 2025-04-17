
import React, { useEffect, useState } from 'react';

interface ProjectVideoProps {
  videoUrl: string;
}

const ProjectVideo: React.FC<ProjectVideoProps> = ({ videoUrl }) => {
  const [embeddedUrl, setEmbeddedUrl] = useState<string>('');
  
  useEffect(() => {
    // YouTube ve Vimeo URL'lerini embed formatına dönüştür
    const convertToEmbedUrl = (url: string): string => {
      // YouTube URL'lerini işle
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        // YouTube video ID'sini çıkar
        let videoId = '';
        
        if (url.includes('youtube.com/watch')) {
          // youtube.com/watch?v=VIDEO_ID formatı
          const urlParams = new URLSearchParams(url.split('?')[1]);
          videoId = urlParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
          // youtu.be/VIDEO_ID formatı
          videoId = url.split('youtu.be/')[1];
          // Eğer başka parametreler varsa (örn. ?t=10) kaldır
          videoId = videoId.split('?')[0];
        } else if (url.includes('youtube.com/embed/')) {
          // Zaten embed formatındaysa
          return url;
        }
        
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`;
        }
      }
      
      // Vimeo URL'lerini işle
      if (url.includes('vimeo.com')) {
        // Vimeo ID'sini çıkar
        const vimeoId = url.split('vimeo.com/')[1];
        if (vimeoId) {
          return `https://player.vimeo.com/video/${vimeoId}?autoplay=1&loop=1&muted=1`;
        }
      }
      
      // Desteklenmeyen URL veya zaten embed formatında
      console.log('Video URL formatı tanınmıyor veya zaten embed formatında:', url);
      return url;
    };
    
    setEmbeddedUrl(convertToEmbedUrl(videoUrl));
  }, [videoUrl]);
  
  if (!embeddedUrl) {
    return <div className="p-4 text-center">Video yüklenemedi.</div>;
  }

  return (
    <div className="aspect-w-16 aspect-h-9">
      <iframe 
        src={embeddedUrl}
        className="w-full h-[500px]"
        title="Video Oynatıcı"
        frameBorder="0" 
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      />
    </div>
  );
};

export default ProjectVideo;
