
// YOLOv8 API ile iletişim kurma işlevleri

/**
 * Görüntüyü YOLOv8 API'ye gönderir ve işlenmiş görüntüyü döndürür
 */
export const processImageWithYolo = async (imageFile: File): Promise<string> => {
  try {
    // Form verisi hazırla
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Burada kendi API adresinizi kullanmanız gerekecek
    const response = await fetch('http://localhost:8000/process-image', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
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
