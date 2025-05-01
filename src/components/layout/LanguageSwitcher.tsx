
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const {
    i18n
  } = useTranslation();
  
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  return (
    <div className="flex items-center gap-2 bg-transparent">
      <button 
        onClick={() => changeLang("tr")} 
        className={`rounded-full px-2 py-1 font-medium text-sm flex items-center gap-1 ${i18n.language === "tr" ? "bg-yellow-100 text-yellow-700" : "hover:bg-gray-100"}`}
      >
        <span className="text-xs">🇹🇷</span>
        <span>TR</span>
      </button>
      <button 
        onClick={() => changeLang("en")} 
        className={`rounded-full px-2 py-1 font-medium text-sm flex items-center gap-1 ${i18n.language === "en" ? "bg-yellow-100 text-yellow-700" : "hover:bg-gray-100"}`}
      >
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
