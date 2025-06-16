
-- Authentication için user profiles tablosu oluşturma
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLS politikaları
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Yeni kullanıcı kaydında otomatik profile oluşturma
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Admin kontrolü için fonksiyon güncelleme
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = $1 AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cesium projelerinde admin kontrolü için RLS
ALTER TABLE public.cesium_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published cesium projects"
ON public.cesium_projects FOR SELECT
USING (visible = true AND status = 'yayinda');

CREATE POLICY "Admins can manage cesium projects"
ON public.cesium_projects FOR ALL
USING (public.is_admin(auth.uid()));

-- Cesium katmanları için RLS
ALTER TABLE public.cesium_layers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cesium layers with project access"
ON public.cesium_layers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.cesium_projects cp
    WHERE cp.id = cesium_layers.project_id
    AND (cp.visible = true OR public.has_project_access(auth.uid(), cp.id))
  )
);

CREATE POLICY "Admins can manage cesium layers"
ON public.cesium_layers FOR ALL
USING (public.is_admin(auth.uid()));

-- Cesium dosyaları için RLS
ALTER TABLE public.cesium_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cesium files with project access"
ON public.cesium_files FOR SELECT
USING (
  project_id IS NULL OR 
  EXISTS (
    SELECT 1 FROM public.cesium_projects cp
    WHERE cp.id = cesium_files.project_id
    AND (cp.visible = true OR public.has_project_access(auth.uid(), cp.id))
  )
);

CREATE POLICY "Admins can manage cesium files"
ON public.cesium_files FOR ALL
USING (public.is_admin(auth.uid()));
