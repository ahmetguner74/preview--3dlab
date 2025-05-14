
import React, { useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, useLoader } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, useGLTF, useProgress, Html } from '@react-three/drei';

// Yükleme göstergesi bileşeni
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
        <div className="mt-2 text-sm">{progress.toFixed(0)}% yükleniyor</div>
      </div>
    </Html>
  );
}

// GLB/GLTF Model bileşeni
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { camera } = useThree();
  
  useEffect(() => {
    // Model yüklendiğinde kamerayı modele odakla
    const box = new THREE.Box3().setFromObject(scene);
    const center = new THREE.Vector3();
    box.getCenter(center);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    const maxDim = Math.max(size.x, size.y, size.z);
    
    // Kamera tipini kontrol et ve ona göre ayarla
    if (camera instanceof THREE.PerspectiveCamera) {
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
      
      // Biraz daha iyi bir görünüm için uzaklığı artır
      cameraZ *= 1.5;
      
      camera.position.z = cameraZ;
      
      // Y ekseninde biraz aşağıda başla (modele daha iyi açıdan bakmak için)
      camera.position.y = center.y;
    } else {
      // OrthographicCamera veya başka bir kamera tipi için
      camera.position.z = maxDim * 2;
      camera.position.y = center.y;
    }
    
    // Kamerayı modelin merkezine doğrult
    camera.lookAt(center);
    
    // Kamera değişikliklerini uygula
    camera.updateProjectionMatrix();
  }, [scene, camera]);

  return <primitive object={scene} dispose={null} />;
}

interface ThreeModelViewerProps {
  modelUrl: string;
  backgroundColor?: string;
}

const ThreeModelViewer: React.FC<ThreeModelViewerProps> = ({ 
  modelUrl,
  backgroundColor = '#f5f5f5'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isError, setIsError] = useState(false);

  // Sketchfab iframe kodunu kontrol et
  if (modelUrl.includes('<iframe') && modelUrl.includes('sketchfab.com')) {
    // iframe kodunu güvenli bir şekilde göster
    return (
      <div 
        className="w-full h-full min-h-[400px]" 
        dangerouslySetInnerHTML={{ __html: modelUrl }}
      />
    );
  }

  // Model URL'sinin geçerli bir GLB/GLTF dosyası olup olmadığını kontrol et
  const isValidModelUrl = (): boolean => {
    if (!modelUrl) return false;
    const extension = modelUrl.split('.').pop()?.toLowerCase();
    return extension === 'glb' || extension === 'gltf';
  };

  // Fab.com URL'sini kontrol et
  if (modelUrl.startsWith('https://fab.com/')) {
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

  return (
    <div className="w-full h-full min-h-[400px] relative">
      {isValidModelUrl() ? (
        <Canvas
          ref={canvasRef}
          shadows
          dpr={[1, 2]}
          style={{ background: backgroundColor }}
          gl={{ preserveDrawingBuffer: true }}
        >
          {/* Burada PerspectiveCamera kullanımını düzelttik */}
          <PerspectiveCamera 
            makeDefault 
            position={[0, 0, 5]} 
            fov={50} 
          />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={<Loader />}>
            <Model url={modelUrl} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
          {isError ? (
            <div className="text-center">
              <p>Model yüklenemedi.</p>
              <p className="text-sm">Desteklenen formatlar: GLB, GLTF</p>
            </div>
          ) : (
            <div className="text-center">
              <p>Geçerli bir 3D model URL'si belirtilmedi.</p>
              <p className="text-sm">Desteklenen formatlar: GLB, GLTF</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ThreeModelViewer;
