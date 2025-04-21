
import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";

const demoMessages = [
  { id: 1, name: "Ali", body: "Merhaba, teklif almak istiyorum.", date: "2024-04-21 10:00" },
  { id: 2, name: "John", body: "Hello! I'm interested in your services.", date: "2024-04-20 12:30" },
  { id: 3, name: "Elif", body: "Projeleriniz çok güzel.", date: "2024-04-19 19:20" },
];

const Messages = () => {
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
            <h1 className="text-xl font-medium">{t("messages")}</h1>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center pt-8 px-4">
          <div className="max-w-2xl w-full">
            <p className="text-lg text-gray-700 mb-4">{t("adminMessageInfo")}</p>
            <div className="space-y-4">
              {demoMessages.map(msg => (
                <div key={msg.id} className="bg-white rounded shadow border border-gray-100 p-4 flex flex-col gap-1 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-2 font-semibold text-arch-black">
                    <MessageCircle size={18} />
                    <span>{msg.name}</span>
                    <span className="ml-auto text-xs text-gray-400">{msg.date}</span>
                  </div>
                  <div className="text-sm text-gray-600">{msg.body}</div>
                </div>
              ))}
              {demoMessages.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                  {t("noMessagesYet")}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
