
import { supabase } from '@/integrations/supabase/client';
import JSZip from 'jszip';

export interface ProcessedTileset {
  tilesetUrl: string;
  allFilesUploaded: boolean;
  missingFiles: string[];
  processedFiles: string[];
}

// ZIP dosyasını işle ve tüm dosyaları yükle
export const processZipFile = async (
  zipFile: File, 
  projectId: string
): Promise<ProcessedTileset> => {
  const zip = new JSZip();
  const zipContents = await zip.loadAsync(zipFile);
  
  // Benzersiz klasör adı oluştur
  const timestamp = Date.now();
  const folderName = `project-${projectId}-${timestamp}`;
  
  console.log(`ZIP dosyası işleniyor: ${zipFile.name}, hedef klasör: ${folderName}`);
  
  const uploadedFiles: string[] = [];
  const failedFiles: string[] = [];
  let tilesetJsonContent: any = null;
  let tilesetJsonPath = '';
  
  // Önce tüm dosyaları listele
  const fileList: { path: string; file: JSZip.JSZipObject }[] = [];
  zipContents.forEach((relativePath, file) => {
    if (!file.dir) {
      fileList.push({ path: relativePath, file });
    }
  });
  
  console.log(`ZIP içinde ${fileList.length} dosya bulundu:`, fileList.map(f => f.path));
  
  // tileset.json dosyasını bul ve oku
  for (const { path, file } of fileList) {
    if (path.toLowerCase().includes('tileset.json')) {
      tilesetJsonPath = path;
      const content = await file.async('text');
      try {
        tilesetJsonContent = JSON.parse(content);
        console.log('tileset.json bulundu ve parse edildi:', path);
        break;
      } catch (error) {
        console.error('tileset.json parse hatası:', error);
        throw new Error(`tileset.json formatı geçersiz: ${error.message}`);
      }
    }
  }
  
  if (!tilesetJsonContent) {
    throw new Error('ZIP dosyası içinde tileset.json bulunamadı');
  }
  
  // Tüm dosyaları yükle
  for (const { path, file } of fileList) {
    try {
      const blob = await file.async('blob');
      const filePath = `${folderName}/${path}`;
      
      console.log(`Dosya yükleniyor: ${path} -> ${filePath}`);
      
      const { error } = await supabase.storage
        .from('cesium-files')
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (error) {
        console.error(`Dosya yükleme hatası ${path}:`, error);
        failedFiles.push(path);
      } else {
        uploadedFiles.push(path);
        console.log(`Dosya başarıyla yüklendi: ${path}`);
      }
    } catch (error) {
      console.error(`Dosya işleme hatası ${path}:`, error);
      failedFiles.push(path);
    }
  }
  
  if (failedFiles.length > 0) {
    throw new Error(`Bazı dosyalar yüklenemedi: ${failedFiles.join(', ')}`);
  }
  
  // tileset.json dosya yollarını güncelle
  const updatedTilesetContent = updateTilesetPaths(tilesetJsonContent, folderName);
  
  // Güncellenmiş tileset.json'ı yükle
  const updatedTilesetBlob = new Blob([JSON.stringify(updatedTilesetContent, null, 2)], {
    type: 'application/json'
  });
  
  const updatedTilesetPath = `${folderName}/${tilesetJsonPath}`;
  
  const { error: tilesetError } = await supabase.storage
    .from('cesium-files')
    .upload(updatedTilesetPath, updatedTilesetBlob, {
      cacheControl: '3600',
      upsert: true // Mevcut dosyayı güncelle
    });
  
  if (tilesetError) {
    throw new Error(`Güncellenmiş tileset.json yüklenemedi: ${tilesetError.message}`);
  }
  
  // Tileset URL'ini oluştur
  const { data: urlData } = supabase.storage
    .from('cesium-files')
    .getPublicUrl(updatedTilesetPath);
  
  console.log('Tüm dosyalar başarıyla yüklendi, tileset URL:', urlData.publicUrl);
  
  return {
    tilesetUrl: urlData.publicUrl,
    allFilesUploaded: true,
    missingFiles: [],
    processedFiles: uploadedFiles
  };
};

// tileset.json içindeki dosya yollarını güncelle
const updateTilesetPaths = (tilesetContent: any, folderName: string): any => {
  // Supabase public URL'ini doğru formatta oluştur
  const baseUrl = `https://lcxyrthrzviksmksfvmz.supabase.co/storage/v1/object/public/cesium-files/${folderName}`;
  
  const updatePaths = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    
    if (Array.isArray(obj)) {
      return obj.map(updatePaths);
    }
    
    const updated = { ...obj };
    
    // content.uri alanını güncelle
    if (updated.content && updated.content.uri) {
      const originalUri = updated.content.uri;
      if (!originalUri.startsWith('http')) {
        // Slash'ı normalize et
        const cleanUri = originalUri.startsWith('./') ? originalUri.substring(2) : originalUri;
        updated.content.uri = `${baseUrl}/${cleanUri}`;
        console.log(`URI güncellendi: ${originalUri} -> ${updated.content.uri}`);
      }
    }
    
    // texture alanlarını güncelle
    if (updated.texture) {
      const originalTexture = updated.texture;
      if (typeof originalTexture === 'string' && !originalTexture.startsWith('http')) {
        const cleanTexture = originalTexture.startsWith('./') ? originalTexture.substring(2) : originalTexture;
        updated.texture = `${baseUrl}/${cleanTexture}`;
        console.log(`Texture güncellendi: ${originalTexture} -> ${updated.texture}`);
      }
    }
    
    // images alanlarını güncelle
    if (updated.images && typeof updated.images === 'object') {
      Object.keys(updated.images).forEach(key => {
        const imagePath = updated.images[key];
        if (typeof imagePath === 'string' && !imagePath.startsWith('http')) {
          const cleanImagePath = imagePath.startsWith('./') ? imagePath.substring(2) : imagePath;
          updated.images[key] = `${baseUrl}/${cleanImagePath}`;
          console.log(`Image güncellendi: ${imagePath} -> ${updated.images[key]}`);
        }
      });
    }
    
    // uri alanlarını güncelle (doğrudan uri property'si olan objeler için)
    if (updated.uri && typeof updated.uri === 'string' && !updated.uri.startsWith('http')) {
      const originalUri = updated.uri;
      const cleanUri = originalUri.startsWith('./') ? originalUri.substring(2) : originalUri;
      updated.uri = `${baseUrl}/${cleanUri}`;
      console.log(`Direct URI güncellendi: ${originalUri} -> ${updated.uri}`);
    }
    
    // Diğer alanları recursively işle
    Object.keys(updated).forEach(key => {
      if (key !== 'content' && key !== 'texture' && key !== 'images' && key !== 'uri') {
        updated[key] = updatePaths(updated[key]);
      }
    });
    
    return updated;
  };
  
  return updatePaths(tilesetContent);
};

// Tek dosya için basit yükleme (tileset.json olmayan dosyalar için)
export const processSingleFile = async (
  file: File,
  projectId: string
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `project-${projectId}-${timestamp}-${file.name}`;
  
  console.log(`Tek dosya yükleniyor: ${file.name} -> ${fileName}`);
  
  const { data, error } = await supabase.storage
    .from('cesium-files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) {
    throw new Error(`Dosya yüklenemedi: ${error.message}`);
  }
  
  const { data: urlData } = supabase.storage
    .from('cesium-files')
    .getPublicUrl(data.path);
  
  console.log('Tek dosya başarıyla yüklendi:', urlData.publicUrl);
  return urlData.publicUrl;
};
