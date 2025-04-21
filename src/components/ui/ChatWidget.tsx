
import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const ChatWidget = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Basit demo mesaj bırakma formu.
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end select-none">
      {open ? (
        <div className="bg-white border border-gray-200 rounded-lg shadow-xl w-80 max-w-[90vw] animate-fade-in">
          <div className="flex items-center justify-between px-4 py-2 border-b font-semibold text-arch-black">
            <span>{t("chatTitle")}</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-red-500 px-1 rounded transition-colors">&times;</button>
          </div>
          <div className="p-4">
            <form autoComplete="off" className="flex flex-col gap-2">
              <input className="border px-3 py-2 rounded" type="text" placeholder={t("chatInputName")} name="name" />
              <textarea className="border px-3 py-2 rounded min-h-[40px]" placeholder={t("chatInputMessage")} name="message" />
              <button className="bg-arch-black text-white px-4 py-2 rounded hover:bg-arch-gray transition-colors font-semibold mt-1" type="submit">
                {t("chatSend")}
              </button>
            </form>
            <p className="mt-2 text-xs text-gray-400">{t("chatDisclaimer")}</p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 shadow-xl px-4 py-2 font-bold rounded-full animate-fade-in"
        >
          <MessageCircle size={20} className="text-arch-black" />
          <span className="text-arch-black">{t("chatButtonOpen")}</span>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
