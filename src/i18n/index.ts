
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  tr: {
    translation: {
      // Sabit arayüz metinleri 
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
      // ... diğer metinler (gerektikçe eklenecek)
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
      // ... diğer metinler (gerektikçe eklenecek)
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
