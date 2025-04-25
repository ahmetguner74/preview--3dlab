
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadPanoramaImage, addSceneRecord } from "./SupabaseService";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface PanoramaUploaderProps {
  onUploadComplete: () => void;
}

const PanoramaUploader = ({ onUploadComplete }: PanoramaUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [sceneName, setSceneName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !sceneName) {
      toast.error("Lütfen bir görsel ve sahne adı girin");
      return;
    }

    try {
      setUploading(true);
      
      // Görsel yükle
      const uploadResult = await uploadPanoramaImage(file);
      
      // Sahne kaydı oluştur
      await addSceneRecord({
        name: sceneName,
        imageUrl: uploadResult.publicUrl,
        initialYaw: 0,
        initialPitch: 0,
        initialFov: 1.5708,
        hotspots: [],
      });

      toast.success("Panorama başarıyla yüklendi!");
      
      // Form temizle
      setFile(null);
      setSceneName("");
      
      // Yükleme tamamlandığında callback fonksiyonu çağır
      onUploadComplete();
    } catch (error) {
      console.error("Panorama yükleme hatası:", error);
      toast.error("Panorama yüklenemedi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-white">
      <div>
        <Label htmlFor="scene-name">Sahne Adı</Label>
        <Input
          id="scene-name"
          type="text"
          placeholder="Salon, Mutfak vb."
          value={sceneName}
          onChange={(e) => setSceneName(e.target.value)}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="panorama-file">Panorama Görsel</Label>
        <Input
          id="panorama-file"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
        {file && (
          <p className="text-xs text-gray-500 mt-1">{file.name} ({Math.round(file.size / 1024)} KB)</p>
        )}
      </div>

      <Button 
        onClick={handleUpload} 
        disabled={uploading || !file || !sceneName}
        className="w-full"
      >
        {uploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Yükleniyor...
          </>
        ) : "Panoramayı Yükle"}
      </Button>
    </div>
  );
};

export default PanoramaUploader;
