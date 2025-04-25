
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PanoramaUploader from "./PanoramaUploader";
import SceneList from "./SceneList";
import PanoramaViewer from "./PanoramaViewer";

const PanoramaTool = () => {
  const [activeTab, setActiveTab] = useState("scenes");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [selectedScene, setSelectedScene] = useState<any>(null);
  
  const handleUploadComplete = () => {
    // Sahne listesini yenile
    setRefreshTrigger(prev => prev + 1);
    // Sahneleri görüntüle tabına geç
    setActiveTab("scenes");
  };
  
  const handleViewScene = (scene: any) => {
    setSelectedScene(scene);
    setActiveTab("viewer");
  };

  return (
    <div className="container mx-auto my-8 p-4">
      <h1 className="text-3xl font-bold mb-6">Panorama Yönetimi</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="scenes">Sahneler</TabsTrigger>
          <TabsTrigger value="upload">Yeni Ekle</TabsTrigger>
          {selectedScene && <TabsTrigger value="viewer">Önizleme</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="scenes" className="space-y-4">
          <SceneList 
            refreshTrigger={refreshTrigger} 
            onViewScene={handleViewScene}
          />
        </TabsContent>
        
        <TabsContent value="upload">
          <PanoramaUploader onUploadComplete={handleUploadComplete} />
        </TabsContent>
        
        <TabsContent value="viewer">
          <PanoramaViewer sceneData={selectedScene} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PanoramaTool;
