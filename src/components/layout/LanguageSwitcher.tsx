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
      <button onClick={() => changeLang("tr")} className="rounded-full font-medium text-justify mx-[4px] text-lg bg-transparent">
        TR
      </button>
      <button onClick={() => changeLang("en")} className="rounded-full text-lg bg-transparent">
        EN
      </button>
    </div>;
};
export default LanguageSwitcher;