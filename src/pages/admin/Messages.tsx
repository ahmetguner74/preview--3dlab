
import React, { useState, useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { MessageCircle, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowLeftCircle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";

interface ChatMessage {
  id: string;
  name: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

const Messages = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        )
      );
    } catch (error) {
      console.error('Mesaj okundu olarak işaretlenemedi:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
      
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
    } catch (error) {
      console.error('Mesaj silinemedi:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

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
        
        <main className="flex-1 flex flex-col pt-8 px-4">
          <div className="max-w-4xl w-full mx-auto">
            <p className="text-lg text-gray-700 mb-4">{t("adminMessageInfo")}</p>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
                <p className="mt-2">Mesajlar yükleniyor...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                {t("noMessagesYet")}
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`bg-white rounded shadow border border-gray-100 p-4 hover:bg-gray-50 transition ${
                      !msg.is_read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-semibold text-arch-black mb-2">
                          <MessageCircle size={18} />
                          <span>{msg.name}</span>
                          {!msg.is_read && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Yeni</span>
                          )}
                          <span className="ml-auto text-xs text-gray-400">{formatDate(msg.created_at)}</span>
                        </div>
                        <div className="text-sm text-gray-600 whitespace-pre-wrap">{msg.message}</div>
                      </div>
                      
                      <div className="flex gap-2">
                        {!msg.is_read && (
                          <Button
                            onClick={() => markAsRead(msg.id)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Check size={16} />
                          </Button>
                        )}
                        <Button
                          onClick={() => deleteMessage(msg.id)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Messages;
