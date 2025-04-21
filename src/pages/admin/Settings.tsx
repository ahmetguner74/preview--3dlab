
import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const SettingsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">{t("returnDashboard")}</span>
            </Link>
            <h1 className="text-xl font-medium">{t("settings")}</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center pt-8 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow p-8 flex flex-col items-center gap-4">
            <Settings size={48} className="text-blue-500 mb-2" />
            <h2 className="text-2xl font-semibold mb-2">{t("generalSettings")}</h2>
            <div className="flex flex-col gap-2 w-full">
              <label className="font-semibold">{t("siteLanguage")}</label>
              <select disabled className="border px-3 py-2 rounded text-gray-400 cursor-not-allowed bg-gray-50">
                <option>Türkçe</option>
                <option>English</option>
              </select>
              <p className="text-xs text-gray-400">{t("languageChangeInfo")}</p>
            </div>
            <div className="flex flex-col gap-2 w-full mt-4">
              <label className="font-semibold">{t("adminDemoSettings")}</label>
              <input type="text" disabled value="demo@example.com" className="border px-3 py-2 rounded text-gray-400 bg-gray-50" />
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              {t("adminSettingsInfo")}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
