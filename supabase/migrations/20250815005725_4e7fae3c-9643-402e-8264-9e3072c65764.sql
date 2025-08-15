-- Habilitar RLS e criar políticas para gamification_users
ALTER TABLE public.gamification_users ENABLE ROW LEVEL SECURITY;

-- Política para permitir usuários inserirem seus próprios dados
CREATE POLICY "Users can insert their own gamification data" 
ON public.gamification_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own gamification data" 
ON public.gamification_users 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own gamification data" 
ON public.gamification_users 
FOR UPDATE 
USING (true);

-- Habilitar RLS e criar políticas para analytics_events
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de eventos analíticos
CREATE POLICY "Anyone can insert analytics events" 
ON public.analytics_events 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view analytics events" 
ON public.analytics_events 
FOR SELECT 
USING (true);

-- Habilitar RLS e criar políticas para video_views
ALTER TABLE public.video_views ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção de visualizações de vídeo
CREATE POLICY "Anyone can insert video views" 
ON public.video_views 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view video views" 
ON public.video_views 
FOR SELECT 
USING (true);