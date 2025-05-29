
import React, { useEffect, useRef } from 'react';
import {
  Viewer,
  Terrain,
  createWorldTerrain,
  Ion,
  Cartesian3,
  Color,
  HeightReference
} from '@cesium/engine';
import 'cesium/Build/Cesium/Widgets/widgets.css';

interface CesiumViewerProps {
  className?: string;
}

const CesiumViewer: React.FC<CesiumViewerProps> = ({ className = "h-full w-full" }) => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Cesium Ion token - Production'da environment variable'dan alınmalı
    Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQzYjYtYTQ0OS1kMWFjYmFkNjc5YzciLCJpZCI6NTc3MzMsImlhdCI6MTYyNzg0NTE4Mn0.XcKpgANiY19MC4bdFUPB2qVhFUdcCRAKyzvs6IjQLJY';

    // Viewer oluştur
    const viewer = new Viewer(cesiumContainer.current, {
      terrain: createWorldTerrain(),
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false,
      vrButton: false,
      geocoder: false,
      infoBox: true,
      selectionIndicator: true
    });

    // Başlangıç konumu (Türkiye)
    viewer.camera.setView({
      destination: Cartesian3.fromDegrees(35.2433, 38.9637, 1000000)
    });

    viewerRef.current = viewer;

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, []);

  return <div ref={cesiumContainer} className={className} />;
};

export default CesiumViewer;
