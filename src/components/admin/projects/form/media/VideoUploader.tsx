
import React, { useState } from 'react';
import { Video, Plus, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProjectVideo } from '@/types/project';
import { addProjectVideo } from '@/utils/mediaHelpers';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface VideoUploaderProps {
  projectId: string | undefined;
  isEditing: boolean;
  projectVideos: ProjectVideo[];
  onVideosUpdated: () => Promise<void>;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  projectId,
  isEditing,
  projectVideos,
  onVideosUpdated
}) => {
  const [videoUrl, setVideoUrl] = useState<string>("");

  const validateVideoUrl = (url: string): boolean => {
    // YouTube ve Vimeo URL formatlarını kontrol et
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/).+/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/).+/;
    
    return youtubeRegex.test(url) || vimeoRegex.test(url);
  };

  const handleVideoUrlAdd = async () => {
    if (!videoUrl.trim()) {
      toast.error('Video URL boş olamaz');
      return;
    }
    
    if (!validateVideoUrl(videoUrl)) {
      toast.error('Geçerli bir YouTube veya Vimeo URL\'si girin');
      return;
    }
    
    if (!projectId && !isEditing) {
      toast.error('Önce projeyi kaydetmelisiniz');
      return;
    }
    
    try {
      const success = await addProjectVideo(videoUrl, projectId!);
      if (success) {
        toast.success('Video başarıyla eklendi');
        setVideoUrl('');
        await onVideosUpdated();
      } else {
        toast.error('Video eklenirken bir hata oluştu');
      }
    } catch (error) {
      console.error('Video eklenirken hata:', error);
      toast.error('Video eklenirken bir hata oluştu');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const { error } = await supabase
        .from('project_videos')
        .delete()
        .eq('id', videoId);
      
      if (error) throw error;
      toast.success('Video başarıyla silindi');
      await onVideosUpdated();
    } catch (error) {
      console.error('Video silinirken hata:', error);
      toast.error('Video silinirken bir hata oluştu');
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium mb-2">Video</h3>
      <div className="flex gap-2 mb-4">
        <Input 
          placeholder="YouTube veya Vimeo video URL'si"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <Button onClick={handleVideoUrlAdd}>
          <Plus size={16} className="mr-1" /> Ekle
        </Button>
      </div>

      {projectVideos.length > 0 && (
        <div className="space-y-2 mt-4">
          {projectVideos.map(video => (
            <div key={video.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
              <div className="flex items-center">
                <Video className="h-5 w-5 mr-2 text-gray-500" />
                <a 
                  href={video.video_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm truncate max-w-md"
                >
                  {video.video_url}
                </a>
              </div>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDeleteVideo(video.id)}
              >
                <X size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
