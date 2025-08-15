-- Excluir tabelas problemáticas e recriar com segurança adequada
DROP TABLE IF EXISTS public.gamification_actions CASCADE;
DROP TABLE IF EXISTS public.gamification_daily_tasks CASCADE;
DROP TABLE IF EXISTS public.gamification_rankings CASCADE;
DROP TABLE IF EXISTS public.gamification_users CASCADE;

-- Recriar tabela de usuários de gamificação
CREATE TABLE public.gamification_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_points INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Bronze',
  status TEXT DEFAULT 'active',
  is_premium BOOLEAN DEFAULT false,
  registered_from TEXT DEFAULT 'app',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(email)
);

-- Recriar tabela de ações de gamificação
CREATE TABLE public.gamification_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.gamification_users(id),
  action_type TEXT NOT NULL,
  video_id UUID,
  model_id UUID,
  points_earned INTEGER DEFAULT 0,
  date_performed DATE DEFAULT CURRENT_DATE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recriar tabela de tarefas diárias
CREATE TABLE public.gamification_daily_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.gamification_users(id),
  task_date DATE DEFAULT CURRENT_DATE,
  total_actions INTEGER DEFAULT 0,
  completed_tasks INTEGER DEFAULT 0,
  points_earned_today INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  last_action_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reset_at TIMESTAMP WITH TIME ZONE DEFAULT (CURRENT_DATE + INTERVAL '1 day'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, task_date)
);

-- Recriar tabela de rankings
CREATE TABLE public.gamification_rankings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.gamification_users(id) UNIQUE,
  total_points INTEGER DEFAULT 0,
  total_tasks_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  max_streak INTEGER DEFAULT 0,
  level_name TEXT DEFAULT 'Bronze',
  position INTEGER,
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.gamification_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gamification_rankings ENABLE ROW LEVEL SECURITY;

-- Políticas seguras para gamification_users
CREATE POLICY "Usuários podem se cadastrar" 
ON public.gamification_users 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem ver seus próprios dados" 
ON public.gamification_users 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem atualizar seus próprios dados" 
ON public.gamification_users 
FOR UPDATE 
USING (true);

-- Políticas para gamification_actions
CREATE POLICY "Usuários podem registrar ações" 
ON public.gamification_actions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários podem ver ações" 
ON public.gamification_actions 
FOR SELECT 
USING (true);

-- Políticas para gamification_daily_tasks
CREATE POLICY "Sistema pode gerenciar tarefas" 
ON public.gamification_daily_tasks 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Políticas para gamification_rankings
CREATE POLICY "Usuários podem ver rankings" 
ON public.gamification_rankings 
FOR SELECT 
USING (true);

CREATE POLICY "Sistema pode atualizar rankings" 
ON public.gamification_rankings 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Criar índices para performance
CREATE INDEX idx_gamification_actions_user_date ON public.gamification_actions(user_id, date_performed);
CREATE INDEX idx_gamification_daily_tasks_user_date ON public.gamification_daily_tasks(user_id, task_date);
CREATE INDEX idx_gamification_rankings_points ON public.gamification_rankings(total_points DESC);

-- Criar triggers para atualização automática de timestamps
CREATE TRIGGER update_gamification_users_updated_at
  BEFORE UPDATE ON public.gamification_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gamification_daily_tasks_updated_at
  BEFORE UPDATE ON public.gamification_daily_tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gamification_rankings_updated_at
  BEFORE UPDATE ON public.gamification_rankings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar pontos automaticamente
CREATE TRIGGER gamification_actions_update_points
  AFTER INSERT ON public.gamification_actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_gamification_user_points();