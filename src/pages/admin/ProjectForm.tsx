
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// İçe aktarılan bileşenler
import ProjectFormHeader from '@/components/admin/projects/form/ProjectFormHeader';
import ProjectSidebar from '@/components/admin/projects/form/ProjectSidebar';
import GeneralTab from '@/components/admin/projects/form/GeneralTab';
import ContentTab from '@/components/admin/projects/form/ContentTab';
import MediaTab from '@/components/admin/projects/form/MediaTab';
import PointCloudTab from '@/components/admin/projects/form/PointCloudTab';
import ModelTab from '@/components/admin/projects/form/ModelTab';
import SettingsTab from '@/components/admin/projects/form/SettingsTab';

// Custom hooks
import { useTabState } from '@/hooks/useTabState';
import { useProjectForm } from '@/hooks/useProjectForm';

const ProjectForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = id !== undefined && id !== 'new';
  
  // Tab yönetimi hook'u
  const { activeTab, handleTabChange } = useTabState("nokta-bulutu"); // Varsayılan olarak nokta-bulutu sekmesi açılacak
  
  // Proje form hook'u
  const { 
    loading,
    saving,
    project,
    projectImages,
    projectVideos,
    project3DModels,
    setProjectImages,
    setProjectVideos,
    setProject3DModels,
    handleInputChange,
    handleSelectChange,
    handleCheckboxChange,
    handleThumbnailUpdate,
    handleSubmit
  } = useProjectForm({
    projectId: id,
    isEditing
  });

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
        <p className="mt-2">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <ProjectFormHeader 
        isEditing={isEditing} 
        saving={saving} 
        onSave={handleSubmit}
        project={project}
      />

      <div className="flex gap-6">
        <ProjectSidebar 
          activeTab={activeTab} 
          onTabChange={handleTabChange} 
        />
        
        <div className="flex-1">
          <Tabs 
            defaultValue="nokta-bulutu" 
            value={activeTab} 
            onValueChange={handleTabChange} 
            className="w-full"
          >
            <TabsList className="bg-gray-100 mb-6">
              <TabsTrigger value="nokta-bulutu">Nokta Bulutu</TabsTrigger>
              <TabsTrigger value="genel">Genel</TabsTrigger>
              <TabsTrigger value="icerik">İçerik</TabsTrigger>
              <TabsTrigger value="medya">Medya</TabsTrigger>
              <TabsTrigger value="3d-model">3D Model</TabsTrigger>
              <TabsTrigger value="ayarlar">Ayarlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nokta-bulutu">
              <PointCloudTab 
                projectId={id}
                isEditing={isEditing}
                project3DModels={project3DModels}
                setProject3DModels={setProject3DModels}
              />
            </TabsContent>
            
            <TabsContent value="genel">
              <GeneralTab 
                project={project}
                isEditing={isEditing}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
              />
            </TabsContent>
            
            <TabsContent value="icerik">
              <ContentTab 
                project={project}
                onInputChange={handleInputChange}
              />
            </TabsContent>
            
            <TabsContent value="medya">
              <MediaTab 
                projectId={id}
                isEditing={isEditing}
                projectImages={projectImages}
                projectVideos={projectVideos}
                setProjectImages={setProjectImages}
                setProjectVideos={setProjectVideos}
                thumbnail={project.thumbnail}
                onThumbnailUpdated={handleThumbnailUpdate}
              />
            </TabsContent>
            
            <TabsContent value="3d-model">
              <ModelTab 
                projectId={id}
                isEditing={isEditing}
                project3DModels={project3DModels}
                setProject3DModels={setProject3DModels}
              />
            </TabsContent>
            
            <TabsContent value="ayarlar">
              <SettingsTab 
                project={project}
                onCheckboxChange={handleCheckboxChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
