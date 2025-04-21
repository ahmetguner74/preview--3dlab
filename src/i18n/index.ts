
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      // --- NAV, HERO, BUTONS ---
      "Projects": "Projeler",
      "About": "Hakkımızda",
      "Contact": "İletişim",
      "Admin": "Yönetim",
      "Video": "Video",
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
    },
  },
  en: {
    translation: {
      "Projects": "Projects",
      "About": "About",
      "Contact": "Contact",
      "Admin": "Admin",
      "Video": "Video",
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
