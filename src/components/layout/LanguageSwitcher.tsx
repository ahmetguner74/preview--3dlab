
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div className="flex items-center gap-2 ml-4">
      <button
        className={`px-2 py-1 rounded transition-all duration-300 ${
          i18n.language === "tr" 
            ? "font-bold bg-yellow-400 text-arch-black" 
            : "hover:bg-yellow-400/20"
        }`}
        onClick={() => changeLang("tr")}
      >
        TR
      </button>
      <button
        className={`px-2 py-1 rounded transition-all duration-300 ${
          i18n.language === "en" 
            ? "font-bold bg-yellow-400 text-arch-black" 
            : "hover:bg-yellow-400/20"
        }`}
        onClick={() => changeLang("en")}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
