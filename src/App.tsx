
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./lib/i18n";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import Contact from "./pages/Contact";
import TourDetail from "./pages/TourDetail";
import Maps from "./pages/Maps";
import Auth from "./pages/Auth";
import CesiumMap from "./pages/CesiumMap";
import Cesium3d from "./pages/Cesium3d";
import Cesium4D from "./pages/Cesium4D";
import NotFound from "./pages/NotFound";
import SiteSettings from "./pages/admin/SiteSettings";
import ProjectList from "./pages/admin/ProjectList";
import ProjectForm from "./pages/admin/ProjectForm";
import CoverImages from "./pages/admin/CoverImages";
import AboutContent from "./pages/admin/AboutContent";
import Messages from "./pages/admin/Messages";
import Settings from "./pages/admin/Settings";
import MapServices from "./pages/admin/MapServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/project/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/maps" element={<Maps />} />
            <Route path="/cesium" element={<CesiumMap />} />
            <Route path="/cesium3d" element={<Cesium3d />} />
            <Route path="/cesium4d" element={<Cesium4D />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/projects" element={<ProjectList />} />
            <Route path="/admin/projects/new" element={<ProjectForm />} />
            <Route path="/admin/projects/:id" element={<ProjectForm />} />
            <Route path="/admin/site-settings" element={<SiteSettings />} />
            <Route path="/admin/cover-images" element={<CoverImages />} />
            <Route path="/admin/about-content" element={<AboutContent />} />
            <Route path="/admin/messages" element={<Messages />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/map-services" element={<MapServices />} />
            <Route path="/admin/cesium" element={<CesiumMap />} />
            <Route path="/tour/:slug" element={<TourDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
