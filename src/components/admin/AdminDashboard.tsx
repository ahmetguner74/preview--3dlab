
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RefreshCw, 
  FileText, 
  Eye, 
  Users, 
  MessageSquare, 
  Plus,
  Calendar
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminDashboardProps {
  projectCount: number;
  featuredCount: number;
  visitorCount: number;
  messageCount: number;
  recentProjects: any[];
  loading: boolean;
}

export const AdminDashboard = ({
  projectCount,
  featuredCount,
  visitorCount,
  messageCount,
  recentProjects,
  loading
}: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      {/* Başlık ve Eylemler */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Yönetim Paneli</h1>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            size="sm"
            className="flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Yenile
          </Button>
          <Button className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Yeni Proje
          </Button>
        </div>
      </div>
      
      {/* Bilgi Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projeler Kartı */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <CardTitle className="text-lg font-medium">Projeler</CardTitle>
              <div className="bg-blue-50 p-2 rounded-md">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div className="text-4xl font-semibold mb-2">{projectCount}</div>
            <p className="text-sm text-gray-500">Toplam proje sayısı</p>
            <Link to="/admin/projects" className="text-blue-600 text-sm mt-3 inline-block hover:underline">
              Projeleri Görüntüle
            </Link>
          </CardContent>
        </Card>
        
        {/* Öne Çıkan Kartı */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <CardTitle className="text-lg font-medium">Öne Çıkan</CardTitle>
              <div className="bg-green-50 p-2 rounded-md">
                <Eye className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="text-4xl font-semibold mb-2">{featuredCount}</div>
            <p className="text-sm text-gray-500">Öne çıkarılmış projeler</p>
            <Link to="#" className="text-green-600 text-sm mt-3 inline-block hover:underline">
              Yönet
            </Link>
          </CardContent>
        </Card>
        
        {/* Ziyaretler Kartı */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <CardTitle className="text-lg font-medium">Ziyaretler</CardTitle>
              <div className="bg-purple-50 p-2 rounded-md">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <div className="text-4xl font-semibold mb-2">{visitorCount}</div>
            <p className="text-sm text-gray-500">Bu ay toplam ziyaret</p>
            <span className="text-purple-600 text-sm mt-3 inline-block">
              İstatistikleri görüntüle
            </span>
          </CardContent>
        </Card>
        
        {/* Mesajlar Kartı */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <CardTitle className="text-lg font-medium">Mesajlar</CardTitle>
              <div className="bg-orange-50 p-2 rounded-md">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <div className="text-4xl font-semibold mb-2">{messageCount}</div>
            <p className="text-sm text-gray-500">Okunmamış mesaj sayısı</p>
            <Link to="#" className="text-orange-600 text-sm mt-3 inline-block hover:underline">
              Mesajları Görüntüle
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Son Projeler ve Son Mesajlar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Son Projeler */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Son Projeler</CardTitle>
              <Button variant="ghost" size="sm">
                Tümünü Gör
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recentProjects.length > 0 ? (
              <div className="space-y-4">
                {recentProjects.map((project: any) => (
                  <div key={project.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-md mr-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-xs text-gray-500">
                          {project.status === 'taslak' ? 'Taslak' : 
                           project.status === 'yayinda' ? 'Yayında' : 'Arşiv'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(project.created_at).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Henüz proje bulunmuyor.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {}}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Yeni Proje Ekle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Son Mesajlar */}
        <Card>
          <CardHeader className="pb-3 border-b">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg font-medium">Son Mesajlar</CardTitle>
              <Button variant="ghost" size="sm">
                Mesajları Yönet
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="text-center py-8 text-gray-500">
              <p>Henüz mesaj bulunmuyor.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
