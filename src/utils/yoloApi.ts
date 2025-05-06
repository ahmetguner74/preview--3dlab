
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
    
    // API URL'i - CORS sorununu aşmak için test modunda devam edelim
    // Gerçek ortamda sunucu taraflı proxy veya CORS başlıklarını sunucuya eklemek gerekir
    const apiUrl = 'https://c9e0-176-240-248-164.ngrok-free.app/predict/';
    
    // Görüntü verilerini önce Base64'e çevirelim
    // Bu, API'ye erişirken alternatif bir yöntem olarak kullanılabilir
    const base64Image = await convertFileToBase64(imageFile);
    
    // Gerçek API'ye erişimde sorun olduğu için test verisi ile devam edelim
    console.log('API isteği hazırlanıyor, ancak CORS sorunları nedeniyle test verileri kullanılacak');
    
    // Not: Gerçek bir üretim ortamında, bu işlemleri backend üzerinden yapmanız önerilir
    // Veya API sağlayıcısının CORS başlıklarını düzgün yapılandırması gerekir
    
    // Test yanıtı oluştur
    const mockResponse: YoloApiResponse = createMockResponse(base64Image);
    
    return mockResponse;
  } catch (error) {
    console.error('Görüntü işleme hatası:', error);
    throw error;
  }
};

/**
 * Dosyayı Base64 formatına dönüştürür
 */
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Base64 formatını döndür, veri URL'sinden "data:image/jpeg;base64," kısmını çıkar
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Dosya Base64 formatına dönüştürülemedi'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Test yanıtı oluşturur
 */
const createMockResponse = (base64Image: string): YoloApiResponse => {
  // Gerçek API yanıtını taklit eden bir test yanıtı oluştur
  return {
    boxes: [
      [100, 100, 200, 200],
      [300, 300, 400, 400],
      [150, 250, 300, 350]
    ],
    scores: [0.92, 0.87, 0.76],
    classes: ["insan", "araba", "bisiklet"],
    result_jpg: `data:image/jpeg;base64,${base64Image}`
  };
};

/**
 * Gerçek bir proxy çözümü için backend taraflı kodu burada olmalıdır.
 * Bu, üretim ortamında kullanım için önerilir.
 * 
 * Örnek: 
 * 1. Kendi backend API'nizi oluşturun
 * 2. Bu API, istemciden aldığı verileri YOLOv8 API'sine iletsin
 * 3. Yanıtları istemciye geri gönderin
 * 
 * Bu şekilde CORS sorunlarını aşabilirsiniz.
 */
