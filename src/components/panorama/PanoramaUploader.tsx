
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
  const [initialView, setInitialView] = useState({
    yaw: 0,
    pitch: 0,
    fov: 90
  });

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
        initialYaw: initialView.yaw,
        initialPitch: initialView.pitch,
        initialFov: initialView.fov,
      });

      toast.success("Panorama başarıyla yüklendi!");
      
      // Form temizle
      setFile(null);
      setSceneName("");
      setInitialView({ yaw: 0, pitch: 0, fov: 90 });
      
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
      
      <div className="grid grid-cols-3 gap-2">
        <div>
          <Label htmlFor="yaw">Başlangıç Yaw</Label>
          <Input
            id="yaw"
            type="number"
            value={initialView.yaw}
            onChange={(e) => setInitialView({...initialView, yaw: Number(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="pitch">Başlangıç Pitch</Label>
          <Input
            id="pitch"
            type="number"
            value={initialView.pitch}
            onChange={(e) => setInitialView({...initialView, pitch: Number(e.target.value)})}
          />
        </div>
        <div>
          <Label htmlFor="fov">Başlangıç FOV</Label>
          <Input
            id="fov"
            type="number"
            value={initialView.fov}
            onChange={(e) => setInitialView({...initialView, fov: Number(e.target.value)})}
          />
        </div>
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
