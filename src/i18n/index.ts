import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Dil çevirileri
const resources = {
  en: {
    translation: {
      'projects': 'Projects',
      'about': 'About',
      'contact': 'Contact',
      'Global Point Cloud Viewer': 'Global Point Cloud Viewer',
      'Upload and visualize LAS, LAZ or EPT format point cloud data on a 3D globe. Supports WGS84 and UTM coordinate systems.': 'Upload and visualize LAS, LAZ or EPT format point cloud data on a 3D globe. Supports WGS84 and UTM coordinate systems.',
      'Upload': 'Upload',
      'View': 'View',
      'Settings': 'Settings',
      'Coordinate System': 'Coordinate System',
      'Global coordinate system used for GPS': 'Global coordinate system used for GPS',
      'Universal Transverse Mercator projection': 'Universal Transverse Mercator projection',
      'Current Point Cloud': 'Current Point Cloud',
      'Globe Point Cloud': 'Globe Point Cloud', 
      'Dosya seçin veya sürükleyin': 'Select or drag a file',
      'Desteklenen formatlar': 'Supported formats',
      'veya URL belirtin': 'or specify URL',
      'Publicly accessible URL to a point cloud file': 'Publicly accessible URL to a point cloud file',
      'Yakınlaştır': 'Zoom in',
      'Uzaklaştır': 'Zoom out',
      'Döndür': 'Rotate',
      'Arazi': 'Terrain',
      'Katmanlar': 'Layers',
      'Nokta bulutu yükleniyor...': 'Loading point cloud...',
      'Yükleme başarılı': 'Upload successful',
      'Nokta bulutu başarıyla yüklendi.': 'Point cloud uploaded successfully.',
      'Yükle ve Görüntüle': 'Upload and View',
      'Yükleniyor...': 'Loading...',
      'Point Cloud': 'Point Cloud'
    }
  },
  tr: {
    translation: {
      // --- NAV, HERO, BUTONS ---
      "projects": "Projeler",
      "about": "Hakkımızda",
      "contact": "İletişim",
      "admin": "Yönetim",
      "video": "Video",
      "3D Model": "3D Model",
      "Point Cloud": "Nokta Bulutu",
      "Gallery": "Galeri",
      "Before / After": "Öncesi / Sonrası",
      "View Projects": "Projeleri Gör",
      "viewProjects": "Projeleri Gör",
      "youtubeWatch": "YouTube'da İzle",
      "youtubeInfo": "Bu bölümde, projelerimizin veya teknolojimizin tanıtım videosu otomatik olarak oynatılır.",
      // HERO
      "heroTitle": "3D DİJİTALLEŞTİRME ATÖLYESİ",
      "heroSubtitle": "Profesyonel yaklaşımla verilerinizi dijitalleştiriyoruz.",
      // ABOUT
      "aboutDescription": "Tarihi yapılardan modern komplekslere kadar farklı karmaşıklıktaki nesnelerle çalışıyoruz.",
      "aboutResult": "Çalışma sonucunda lazer tarama noktaları bulutu, fotogrametrik model, ortofoto planlar ve ölçülü restorasyon çizimleri tarafınıza teslim edilir.",
      "learnMore": "Stüdyomuz hakkında daha fazla bilgi edinin",
      // Chat / Widget
      "chatTitle": "Bize Mesaj Bırakın",
      "chatInputName": "Adınız",
      "chatInputMessage": "Mesajınız...",
      "chatSend": "Gönder",
      "chatDisclaimer": "Bıraktığınız mesaj yönetici panelinde görülebilir.",
      "chatButtonOpen": "Mesaj bırakın",
      // Admin / Messages / Settings
      "Messages": "Mesajlar",
      "messages": "Mesajlar",
      "Settings": "Ayarlar",
      "settings": "Ayarlar",
      "Coming Soon!": "Çok Yakında!",
      "Return to Dashboard": "Gösterge Paneline Dön",
      "returnDashboard": "Gösterge Paneline Dön",
      "No messages have been received yet.": "Henüz mesaj gelmedi.",
      "noMessagesYet": "Henüz mesaj gelmedi.",
      "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.":
        "Bu sayfa çok yakında iletişim formundan gelen mesajları gösterecek. Buradan tüm site mesajlarını görüntüleyebilir, yanıtlayabilir ve yönetebilirsiniz.",
      "adminMessageInfo": "Ziyaretçilerden gelen son mesajlar aşağıda listelenir. Cevaplamak için e-posta ile iletişime geçebilirsiniz.",
      // Ayarlar
      "generalSettings": "Genel Ayarlar",
      "siteLanguage": "Site Dili",
      "languageChangeInfo": "Dil değişimi şimdilik demo amaçlı devredışı bırakıldı.",
      "adminDemoSettings": "Demo Yönetici Ayarı",
      "adminSettingsInfo": "Daha fazla detay ve özelleştirme çok yakında burada olacak.",
      // Footer
      "footerDescription": "Modern, sürdürülebilir mimari çözümler oluşturuyoruz.",
      "footerAddress": "123 Mimarlık Caddesi",
      "footerCity": "İstanbul, Türkiye", 
      "footerPrivacy": "Gizlilik Politikası",
      "footerTerms": "Kullanım Koşulları",
      "footerRights": "Tüm hakları saklıdır.",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "tr",
  fallbackLng: "tr",
  interpolation: { escapeValue: false },
});

export default i18n;
