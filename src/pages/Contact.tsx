
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Mail, Phone } from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the data to a server or Supabase
    console.log("Form submitted:", formData);
    toast({
      title: "Message sent",
      description: "We'll get back to you as soon as possible.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <Layout>
      <section className="pt-16 md:pt-24 pb-16">
        <div className="arch-container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-display font-light mb-8">Get In Touch</h1>
            <p className="text-lg text-arch-gray">
              We'd love to hear from you. Reach out to discuss your project or just to say hello.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Address</h3>
              <p className="text-arch-gray">
                123 Architecture St.<br />
                City, Country
              </p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <p className="text-arch-gray">
                <a href="mailto:info@architecture.com" className="hover:text-arch-black transition-colors">
                  info@architecture.com
                </a>
              </p>
            </div>
            
            <div className="text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-arch-light-gray flex items-center justify-center mb-4">
                <Phone size={24} />
              </div>
              <h3 className="text-lg font-medium mb-2">Phone</h3>
              <p className="text-arch-gray">
                <a href="tel:+123456789" className="hover:text-arch-black transition-colors">
                  +12 345 6789
                </a>
              </p>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm mb-2">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm mb-2">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm mb-2">Subject</label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm mb-2">Message</label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="text-center pt-4">
                <Button 
                  type="submit"
                  className="bg-arch-black text-white hover:bg-arch-gray px-8 py-6 text-sm uppercase tracking-wider"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
          
          {/* Map Placeholder - Would be replaced with an actual map component */}
          <div className="mt-16 h-80 bg-arch-light-gray flex items-center justify-center">
            <p className="text-arch-gray">Map would be displayed here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
