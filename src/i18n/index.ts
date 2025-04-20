import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
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
      "Return to Home": "Ana Sayfa'ya Dön",
      "Page not found": "Sayfa Bulunamadı",
      "Oops! Page not found": "Oops! Sayfa bulunamadı",
      "Next": "İleri",
      "Previous": "Geri",
      "Messages": "Mesajlar",
      "Settings": "Ayarlar",
      "Coming Soon!": "Çok Yakında!",
      "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.":
        "Bu sayfa çok yakında iletişim formundan gelen mesajları gösterecek. Buradan tüm site mesajlarını görüntüleyebilir, yanıtlayabilir ve yönetebilirsiniz.",
      "No messages have been received yet.": "Henüz mesaj gelmedi.",
      "Return to Dashboard": "Gösterge Paneline Dön",
      "Site general settings, user roles, and application preferences will be managed here in the next versions. Today, you can adjust contact information from 'Site Ayarları' in the sidebar.":
        "Sitenin genel ayarları, kullanıcı rolleri ve uygulama tercihleri bir sonraki sürümlerde burada yönetilecek. Bugün için yan menüdeki 'Site Ayarları' bölümünden iletişim bilgilerini ayarlayabilirsiniz.",
      "Nothing to edit here right now.": "Şu anda burada düzenlenecek bir şey yok.",
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
      "Return to Home": "Return to Home",
      "Page not found": "Page not found",
      "Oops! Page not found": "Oops! Page not found",
      "Next": "Next",
      "Previous": "Previous",
      "Messages": "Messages",
      "Settings": "Settings",
      "Coming Soon!": "Coming Soon!",
      "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.":
        "This page will soon display messages received from contact forms. Here you can view, reply, and manage all site messages.",
      "No messages have been received yet.": "No messages have been received yet.",
      "Return to Dashboard": "Return to Dashboard",
      "Site general settings, user roles, and application preferences will be managed here in upcoming versions. For now, you can adjust contact information from 'Site Ayarları' in the sidebar.":
        "Site general settings, user roles, and application preferences will be managed here in upcoming versions. For now, you can adjust contact information from 'Site Ayarları' in the sidebar.",
      "Nothing to edit here right now.": "Nothing to edit here right now.",
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
