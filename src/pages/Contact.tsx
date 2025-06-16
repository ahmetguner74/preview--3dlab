
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MapPin, Mail, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          name: formData.name,
          message: `Konu: ${formData.subject}\n\nE-posta: ${formData.email}\n\nMesaj: ${formData.message}`
        });

      if (error) throw error;

      toast.success('Mesajınız başarıyla gönderildi!');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      toast.error('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="pt-16 md:pt-24 pb-16">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8">{t('contact')}</h1>
            <p className="text-lg text-arch-gray">
              Projeleriniz hakkında konuşmak için bizimle iletişime geçin.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Adres</h3>
              <p className="text-arch-gray">
                {t('footerAddress')}<br />
                {t('footerCity')}
              </p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">E-posta</h3>
              <p className="text-arch-gray">
                <a href="mailto:info@3ddigital.com" className="hover:text-arch-black transition-colors">
                  info@3ddigital.com
                </a>
              </p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Telefon</h3>
              <p className="text-arch-gray">
                <a href="tel:+905555555555" className="hover:text-arch-black transition-colors">
                  +90 555 555 5555
                </a>
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">Ad Soyad</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">E-posta</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm mb-2">Konu</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm mb-2">Mesaj</label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-arch-black text-white hover:bg-arch-gray px-8 py-6 text-sm uppercase tracking-wider"
                >
                  {isSubmitting ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
