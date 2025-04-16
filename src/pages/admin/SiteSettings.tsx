
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftCircle } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SiteSettings = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Üst Menü */}
        <header className="bg-white border-b border-gray-200 h-14 flex items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-gray-600 flex items-center hover:text-arch-black">
              <ArrowLeftCircle size={20} className="mr-2" />
              <span className="text-sm">Gösterge Paneline Dön</span>
            </Link>
            <h1 className="text-xl font-medium">Site Ayarları</h1>
          </div>
        </header>
        
        {/* Ana İçerik */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6">Genel Site Ayarları</h2>
            
            {loading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                <p className="mt-2 text-gray-600">Veriler yükleniyor...</p>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-blue-800">
                    Kapak görsellerini yönetmek için 
                    <Link to="/admin/cover-images" className="font-medium underline ml-1">
                      Kapak Görselleri
                    </Link> 
                    sayfasını ziyaret edin.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">İletişim Bilgileri</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-posta Adresi</Label>
                        <Input id="email" placeholder="info@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" placeholder="+90 212 123 4567" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="address">Adres</Label>
                      <Input id="address" placeholder="İstanbul, Türkiye" />
                    </div>
                    
                    <Button>Kaydet</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Sosyal Medya</h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="instagram">Instagram</Label>
                        <Input id="instagram" placeholder="@kullaniciadi" />
                      </div>
                      <div>
                        <Label htmlFor="facebook">Facebook</Label>
                        <Input id="facebook" placeholder="sayfaadi" />
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input id="twitter" placeholder="@kullaniciadi" />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" placeholder="/company/sirketadi" />
                      </div>
                    </div>
                    
                    <Button>Kaydet</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SiteSettings;
