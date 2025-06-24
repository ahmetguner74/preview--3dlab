
import React, { useState, useEffect } from 'react';
import { X, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface YouTubePopupProps {
  videoUrl: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const YouTubePopup: React.FC<YouTubePopupProps> = ({ videoUrl, isOpen, onClose }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && videoUrl) {
      setIsVideoLoaded(true);
    } else {
      setIsVideoLoaded(false);
    }
  }, [isOpen, videoUrl]);

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&showinfo=0&modestbranding=1` : '';
  };

  if (!videoUrl || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Container */}
      <div className="relative z-10 w-full max-w-4xl mx-4 bg-white rounded-lg shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="bg-arch-black text-white p-4 flex items-center justify-between">
          <h3 className="text-lg font-medium">Video İzle</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>
        
        {/* Video Container */}
        <div className="relative aspect-video bg-black">
          {isVideoLoaded ? (
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white">
                <Play size={48} className="mx-auto mb-4 opacity-60" />
                <p>Video yükleniyor...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default YouTubePopup;
