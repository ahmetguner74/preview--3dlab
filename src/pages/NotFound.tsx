
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-6xl font-bold text-arch-black mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Sayfa Bulunamadı</h2>
          <p className="text-gray-600 mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
          <Link to="/">
            <Button className="bg-arch-black text-white hover:bg-arch-gray">
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
