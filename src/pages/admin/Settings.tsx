
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
              <span className="text-sm">{t("Return to Dashboard")}</span>
            </Link>
            <h1 className="text-xl font-medium">{t("Settings")}</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow p-8 flex flex-col items-center">
            <Settings size={48} className="text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">{t("Coming Soon!")}</h2>
            <p className="text-gray-500 mb-2 text-center">
              {t("Site general settings, user roles, and application preferences will be managed here in the next versions. Today, you can adjust contact information from 'Site Ayarları' in the sidebar.")}
            </p>
            <p className="text-xs text-gray-400 text-center mt-2">
              {t("Nothing to edit here right now.")}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;
