import React from "react";
import { useTranslation } from "react-i18next";
const LanguageSwitcher: React.FC = () => {
  const {
    i18n
  } = useTranslation();
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return <div className="flex items-center gap-2 bg-transparent">
      <button onClick={() => changeLang("tr")} className="bg-zinc-50">
        <span className="text-xs">🇹🇷</span>
        <span>TR</span>
      </button>
      <button onClick={() => changeLang("en")} className="bg-zinc-100">
        <span className="text-xs">🇬🇧</span>
        <span>EN</span>
      </button>
    </div>;
};
export default LanguageSwitcher;