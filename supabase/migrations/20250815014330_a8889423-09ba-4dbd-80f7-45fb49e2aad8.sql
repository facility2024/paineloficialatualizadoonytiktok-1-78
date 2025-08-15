-- Criar nova tabela de shares mais segura
DROP TABLE IF EXISTS shares CASCADE;

CREATE TABLE public.video_shares (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Identificação do usuário
  user_id UUID,
  session_id TEXT,
  
  -- Dados do vídeo/modelo
  video_id UUID REFERENCES public.videos(id),
  model_id UUID REFERENCES public.models(id),
  
  -- Dados do compartilhamento
  platform TEXT NOT NULL DEFAULT 'native', -- native, whatsapp, facebook, etc
  share_method TEXT DEFAULT 'web_share_api',
  
  -- Metadados de segurança
  ip_address INET,
  user_agent TEXT,
  device_type TEXT DEFAULT 'mobile',
  
  -- Analytics
  shared_url TEXT,
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  
  -- Configurações
  is_active BOOLEAN DEFAULT true
);

-- Habilitar RLS
ALTER TABLE public.video_shares ENABLE ROW LEVEL SECURITY;

-- Política para permitir inserção pública (como likes e comments)
CREATE POLICY "Public can insert video shares" 
ON public.video_shares 
FOR INSERT 
WITH CHECK (true);

-- Política para admins visualizarem
CREATE POLICY "Admins can view all video shares" 
ON public.video_shares 
FOR SELECT 
USING (is_admin());

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_video_shares_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at
CREATE TRIGGER update_video_shares_updated_at
  BEFORE UPDATE ON public.video_shares
  FOR EACH ROW
  EXECUTE FUNCTION update_video_shares_updated_at();

-- Índices para performance
CREATE INDEX idx_video_shares_video_id ON public.video_shares(video_id);
CREATE INDEX idx_video_shares_model_id ON public.video_shares(model_id);
CREATE INDEX idx_video_shares_created_at ON public.video_shares(created_at);
CREATE INDEX idx_video_shares_platform ON public.video_shares(platform);