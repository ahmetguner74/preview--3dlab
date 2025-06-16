
import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
      <Button
        onClick={() => changeLang("tr")}
        variant={currentLang === "tr" ? "default" : "ghost"}
        size="sm"
        className={`text-xs px-2 py-1 h-7 ${
          currentLang === "tr" 
            ? "bg-white shadow-sm" 
            : "bg-transparent hover:bg-white/50"
        }`}
      >
        <span className="mr-1">🇹🇷</span>
        TR
      </Button>
      <Button
        onClick={() => changeLang("en")}
        variant={currentLang === "en" ? "default" : "ghost"}
        size="sm"
        className={`text-xs px-2 py-1 h-7 ${
          currentLang === "en" 
            ? "bg-white shadow-sm" 
            : "bg-transparent hover:bg-white/50"
        }`}
      >
        <span className="mr-1">🇬🇧</span>
        EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
