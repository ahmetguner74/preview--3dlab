
// YOLOv8 API ile iletişim kurma işlevleri

export interface YoloProcessingOptions {
  confidence?: number;
  iouThreshold?: number;
  modelType?: 'detect' | 'segment' | 'classify';
}

export interface YoloApiResponse {
  boxes?: number[][];
  scores?: number[];
  classes?: number[] | string[];
  result_jpg?: string;
  error?: string;
}

/**
 * Görüntüyü YOLOv8 API'ye gönderir ve yanıtı döndürür
 */
export const processImageWithYolo = async (
  imageFile: File, 
  options: YoloProcessingOptions = {}
): Promise<YoloApiResponse> => {
  try {
    // Form verisi hazırla
    const formData = new FormData();
    formData.append('file', imageFile); // API'nin beklediği parametre adı: file
    
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
    
    // API URL'i
    const apiUrl = 'https://c9e0-176-240-248-164.ngrok-free.app/predict/';
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Bilinmeyen hata');
      throw new Error(`API hatası (${response.status}): ${errorText}`);
    }
    
    // API'den dönen JSON yanıtını al
    const jsonResponse = await response.json();
    
    // Base64 resim varsa onu URL'ye dönüştür
    if (jsonResponse.result_jpg) {
      const imageUrl = `data:image/jpeg;base64,${jsonResponse.result_jpg}`;
      return { 
        ...jsonResponse,
        result_jpg: imageUrl
      };
    }
    
    return jsonResponse;
  } catch (error) {
    console.error('Görüntü işleme hatası:', error);
    throw error;
  }
};
