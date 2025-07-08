import React, { useEffect, useRef } from 'react';

const Cesium4D = () => {
  const cesiumContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cesium CSS yükle
    const cesiumCSS = document.createElement('link');
    cesiumCSS.href = 'https://cesium.com/downloads/cesiumjs/releases/1.116/Build/Cesium/Widgets/widgets.css';
    cesiumCSS.rel = 'stylesheet';
    document.head.appendChild(cesiumCSS);

    // Cesium JS yükle
    const cesiumScript = document.createElement('script');
    cesiumScript.src = 'https://cesium.com/downloads/cesiumjs/releases/1.116/Build/Cesium/Cesium.js';
    cesiumScript.onload = () => {
      if (cesiumContainerRef.current && window.Cesium) {
        // Cesium Ion Access Token ayarla
        window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4MmU0NWY0YS0yYWI4LTRhNTItYmEwYy1iZGYyNmFhNjhlNmYiLCJpZCI6NDE3MTMsImlhdCI6MTc1MTk2ODM1N30.aC6ckiNsyVO_pd3gm2nHMl8Kn6PcmqaoKCpZngNrIY';
        
        // Cesium Viewer oluştur
        const viewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          terrainProvider: window.Cesium.createWorldTerrain(),
          timeline: false,
          animation: false,
          homeButton: true,
          sceneModePicker: true,
          baseLayerPicker: true,
          navigationHelpButton: true,
          fullscreenButton: true,
          geocoder: true,
          infoBox: true,
          selectionIndicator: true,
        });

        // Dünya görünümüne ayarla
        viewer.camera.setView({
          destination: window.Cesium.Cartesian3.fromDegrees(35.0, 39.0, 10000000.0),
        });
      }
    };
    document.head.appendChild(cesiumScript);

    // Cleanup function
    return () => {
      document.head.removeChild(cesiumCSS);
      document.head.removeChild(cesiumScript);
    };
  }, []);

  return (
    <div className="cesium4d-container" style={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div 
        ref={cesiumContainerRef}
        style={{ width: '100%', height: '100vh' }}
      />
    </div>
  );
};

// Cesium types için global window interface
declare global {
  interface Window {
    Cesium: any;
  }
}

export default Cesium4D;