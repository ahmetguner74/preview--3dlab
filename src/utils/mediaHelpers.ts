
// mediaHelpers.ts - Eski kodlar yerine yeni bölünmüş dosyalara referans verir

// Dosya yükleme işlemleri
export { uploadFileToStorage } from './fileStorage';

// Proje görselleri ile ilgili işlemler
export { uploadProjectImage, getProjectImages } from './projectImages';

// Proje videoları ile ilgili işlemler
export { addProjectVideo, getProjectVideos } from './projectVideos';

// 3D modeller ile ilgili işlemler
export { upload3DModel, getProject3DModels } from './project3DModels';

// Site görselleri ile ilgili işlemler
export { getSiteImage, uploadSiteImage } from './siteImages';
