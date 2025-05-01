
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
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
  en: {
    translation: {
      "projects": "Projects",
      "about": "About",
      "contact": "Contact",
      "admin": "Admin",
      "video": "Video",
      "3D Model": "3D Model",
      "Point Cloud": "Point Cloud",
      "Gallery": "Gallery",
      "Before / After": "Before / After",
      "View Projects": "View Projects",
      "viewProjects": "View Projects",
      "youtubeWatch": "Watch on YouTube",
      "youtubeInfo": "A promo or feature video of our technology or project is played here automatically.",
      "heroTitle": "3D DIGITIZATION WORKSHOP",
      "heroSubtitle": "We digitize your data with a professional approach.",
      // ABOUT
      "aboutDescription": "We work with objects of different complexity from historical buildings to modern complexes.",
      "aboutResult": "As a result of the work, laser scanning point clouds, photogrammetric model, orthophoto plans and measured restoration drawings are delivered to you.",
      "learnMore": "Learn more about our studio",
      "chatTitle": "Leave Us a Message",
      "chatInputName": "Your Name",
      "chatInputMessage": "Your message...",
      "chatSend": "Send",
      "chatDisclaimer": "Your message can be viewed by site admin.",
      "chatButtonOpen": "Leave a message",
      "Messages": "Messages",
      "messages": "Messages",
      "Settings": "Settings",
      "settings": "Settings",
      "Coming Soon!": "Coming Soon!",
      "Return to Dashboard": "Return to Dashboard",
      "returnDashboard": "Return to Dashboard",
      "No messages have been received yet.": "No messages have been received yet.",
      "noMessagesYet": "No messages have been received yet.",
      "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.":
        "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.",
      "adminMessageInfo": "Recent messages from site visitors appear below. You can reply by contacting via email.",
      "generalSettings": "General Settings",
      "siteLanguage": "Site Language",
      "languageChangeInfo": "Language change is currently disabled for demo purposes.",
      "adminDemoSettings": "Demo Admin Setting",
      "adminSettingsInfo": "More settings and customization will be available here soon.",
      // Footer
      "footerDescription": "Creating modern, sustainable architectural solutions.",
      "footerAddress": "123 Architecture St.",
      "footerCity": "Istanbul, Turkey",
      "footerPrivacy": "Privacy Policy",
      "footerTerms": "Terms of Service",
      "footerRights": "All rights reserved.",
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
