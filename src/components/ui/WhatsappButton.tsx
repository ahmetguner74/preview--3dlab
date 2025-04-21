
import React from "react";
import { icons } from "lucide-react";

const WhatsappButton = () => {
  // Direkt telefon numarası kullanılacak.
  const phone = "+905313553274";
  const Whatsapp = icons["whatsapp"]; // Lucide'den iconu bu şekilde alıyoruz

  return (
    <a
      href={`https://wa.me/${phone.replace(/^\+/, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-40 flex items-center gap-2 bg-green-500 hover:bg-green-600 transition-colors rounded-full px-4 py-3 shadow-lg animate-fade-in"
      style={{ marginBottom: 72 }} // Chat ile üst üste binmesin diye
      title="WhatsApp ile iletişim"
    >
      <Whatsapp size={24} className="text-white" />
      <span className="hidden sm:block text-white font-bold">WhatsApp</span>
    </a>
  );
};
export default WhatsappButton;

