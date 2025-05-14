
/// <reference types="vite/client" />

// Cesium modülleri için tip tanımlamaları
declare module 'cesium' {
  export const Ion: any;
  export const createWorldTerrainAsync: () => Promise<any>;
  export const createOsmBuildingsAsync: () => Promise<any>;
  export class Cartesian3 {
    static fromDegrees(longitude: number, latitude: number, height?: number): Cartesian3;
  }
  export class Viewer {
    scene: any;
    camera: any;
    terrainProvider: any;
    destroy(): void;
  }
}

declare module 'resium' {
  export const Viewer: React.ComponentType<any>;
  export const Globe: React.ComponentType<any>;
  export const CameraFlyTo: React.ComponentType<any>;
}
