
// YOLOv8 API ile iletişim kurma işlevleri

export interface YoloProcessingOptions {
  confidence?: number;
  iouThreshold?: number;
  modelType?: 'detect' | 'segment' | 'classify';
}

/**
 * Görüntüyü YOLOv8 API'ye gönderir ve işlenmiş görüntüyü döndürür
 */
export const processImageWithYolo = async (
  imageFile: File, 
  options: YoloProcessingOptions = {}
): Promise<string> => {
  try {
    // Form verisi hazırla
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Opsiyonları ekle
    if (options.confidence) {
      formData.append('confidence', options.confidence.toString());
    }
    
    if (options.iouThreshold) {
      formData.append('iou_threshold', options.iouThreshold.toString());
    }
    
    if (options.modelType) {
      formData.append('model_type', options.modelType);
    }
    
    // API URL'sini ortam değişkeninden al veya varsayılan kullan
    const apiUrl = process.env.REACT_APP_YOLO_API_URL || 'http://localhost:8000/process-image';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Bilinmeyen hata');
      throw new Error(`API hatası (${response.status}): ${errorText}`);
    }
    
    // API'den dönen görüntüyü blob olarak al
    const blob = await response.blob();
    
    // Blob'u URL'ye dönüştür
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Görüntü işleme hatası:', error);
    throw error;
  }
};
