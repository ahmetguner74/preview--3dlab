
import { useState, useEffect } from "react";
import { fetchAllScenes, deleteScene } from "./SupabaseService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface SceneListProps {
  onViewScene?: (scene: any) => void;
  refreshTrigger: number;
}

const SceneList = ({ onViewScene, refreshTrigger }: SceneListProps) => {
  const [scenes, setScenes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScenes();
  }, [refreshTrigger]);

  const loadScenes = async () => {
    try {
      setLoading(true);
      const data = await fetchAllScenes();
      setScenes(data);
    } catch (error) {
      console.error("Sahneler yüklenirken hata oluştu:", error);
      toast.error("Sahneler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteScene(id);
      setScenes(scenes.filter(scene => scene.id !== id));
      toast.success("Sahne başarıyla silindi!");
    } catch (error) {
      console.error("Sahne silinemedi:", error);
      toast.error("Sahne silinirken bir hata oluştu.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (scenes.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>Henüz hiç panorama sahnesi eklenmemiş.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {scenes.map((scene) => (
        <Card key={scene.id} className="overflow-hidden">
          <div className="aspect-square relative">
            <img 
              src={scene.image_url} 
              alt={scene.title} 
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base">{scene.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <p className="text-sm text-gray-500 line-clamp-1">
              {new Date(scene.created_at).toLocaleDateString('tr-TR')}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            {onViewScene && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onViewScene(scene)}
              >
                <Eye className="h-4 w-4 mr-1" /> Görüntüle
              </Button>
            )}
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-1" /> Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Bu sahneyi silmek istiyor musunuz?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Bu işlem geri alınamaz. Sahne kalıcı olarak silinecektir.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(scene.id)}>
                    Evet, Sil
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default SceneList;
