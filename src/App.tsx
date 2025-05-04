
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Admin from "./pages/Admin";
import ProjectList from "./pages/admin/ProjectList";
import ProjectForm from "./pages/admin/ProjectForm";
import SiteSettings from "./pages/admin/SiteSettings";
import CoverImages from "./pages/admin/CoverImages";
import Messages from "./pages/admin/Messages";
import SettingsPage from "./pages/admin/Settings";
import AboutContent from "./pages/admin/AboutContent";
import NotFound from "./pages/NotFound";
import WhatsappButton from "./components/ui/WhatsappButton";
import "./i18n";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project/:slug" element={<ProjectDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/projects" element={<ProjectList />} />
          <Route path="/admin/projects/new" element={<ProjectForm />} />
          <Route path="/admin/projects/:id/edit" element={<ProjectForm />} />
          <Route path="/admin/site-settings" element={<SiteSettings />} />
          <Route path="/admin/cover-images" element={<CoverImages />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/about-content" element={<AboutContent />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsappButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
