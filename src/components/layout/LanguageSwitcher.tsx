import React from "react";
import { useTranslation } from "react-i18next";
const LanguageSwitcher: React.FC = () => {
  const {
    i18n
  } = useTranslation();
  const changeLang = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  return <div className="flex items-center gap-2">
      <button onClick={() => changeLang("tr")} className="bg-red-600 hover:bg-red-500">
        TR
      </button>
      <button onClick={() => changeLang("en")} className="bg-blue-500 hover:bg-blue-400">
        EN
      </button>
    </div>;
};
export default LanguageSwitcher;