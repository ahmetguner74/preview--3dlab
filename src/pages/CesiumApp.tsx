
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CesiumViewer from '@/components/cesium/CesiumViewer';
import { supabase } from '@/integrations/supabase/client';

const CesiumApp: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectParam = searchParams.get('project');
  const [testProjectId, setTestProjectId] = useState<string | null>(null);

  useEffect(() => {
    // Test projesi ID'sini bul
    const findTestProject = async () => {
      try {
        const { data, error } = await supabase
          .from('cesium_projects')
          .select('id, title')
          .eq('visible', true)
          .eq('status', 'yayinda');

        if (error) throw error;
        
        // "test" adını içeren projeyi bul
        const testProject = data?.find(p => 
          p.title.toLowerCase().includes('test')
        );
        
        if (testProject) {
          setTestProjectId(testProject.id);
          console.log('Test projesi bulundu:', testProject.title, testProject.id);
        } else {
          console.log('Test projesi bulunamadı');
        }
      } catch (error) {
        console.error('Test projesi aranırken hata:', error);
      }
    };

    findTestProject();
  }, []);

  return (
    <Layout>
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <CesiumViewer 
          className="w-full h-full" 
          projectId={projectParam || testProjectId || undefined}
          autoLoadProject={true}
        />
      </div>
    </Layout>
  );
};

export default CesiumApp;
