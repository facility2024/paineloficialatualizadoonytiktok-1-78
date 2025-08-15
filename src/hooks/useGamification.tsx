import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GamificationUser {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  total_points: number;
  current_streak: number;
  level_name: string;
}

interface ActionResult {
  success: boolean;
  message: string;
  actions_today?: number;
  remaining_actions?: number;
  hours_remaining?: number;
  completion_message?: string;
}

export const useGamification = () => {
  const [user, setUser] = useState<GamificationUser | null>(null);
  const [dailyActionsCount, setDailyActionsCount] = useState(0);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Registrar usuário na gamificação
  const registerUser = async (name: string, email: string, whatsapp?: string) => {
    try {
      setIsLoading(true);
      
      // Verificar se já existe
      const { data: existingUser } = await supabase
        .from('gamification_users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        setUser(existingUser);
        setIsRegistered(true);
        toast({
          title: "Bem-vindo de volta!",
          description: `Olá, ${existingUser.name}! Você já está cadastrado na gamificação.`,
        });
        return;
      }

      // Criar novo usuário
      const { data: newUser, error } = await supabase
        .from('gamification_users')
        .insert({
          name,
          email,
          whatsapp: whatsapp || null,
          registered_from: 'tiktok_app'
        })
        .select()
        .single();

      if (error) throw error;

      setUser(newUser);
      setIsRegistered(true);
      
      toast({
        title: "Cadastro realizado!",
        description: `Parabéns, ${name}! Você agora pode ganhar pontos realizando ações no app.`,
      });

    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      toast({
        title: "Erro no cadastro",
        description: "Não foi possível realizar o cadastro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Registrar ação do usuário
  const trackAction = async (actionType: 'like' | 'comment' | 'share' | 'view' | 'message', videoId?: string, modelId?: string): Promise<ActionResult> => {
    if (!user) {
      return {
        success: false,
        message: 'Usuário não cadastrado na gamificação'
      };
    }

    try {
      // Obter IP e User Agent
      const getClientIP = async () => {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          return data.ip;
        } catch (error) {
          console.error('Erro ao obter IP:', error);
          return 'unknown';
        }
      };

      const ipAddress = await getClientIP();
      const userAgent = navigator.userAgent;

      // Chamar função do Supabase para registrar ação
      const { data, error } = await supabase.rpc('register_gamification_action', {
        p_user_id: user.id,
        p_action_type: actionType,
        p_video_id: videoId || null,
        p_model_id: modelId || null,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error) throw error;

      const result = data as unknown as ActionResult;
      
      // Atualizar contador local
      if (result.success) {
        setDailyActionsCount(result.actions_today || 0);
        
        // Se completou as 3 ações, mostrar mensagem especial
        if (result.actions_today === 3) {
          const hoursRemaining = Math.floor((24 - new Date().getHours()));
          toast({
            title: "🎉 Parabéns!",
            description: `Parabéns, ${user.name}! Você completou as 3 tarefas com excelência. Agora faltam ${hoursRemaining} horas para realizar novas tarefas. Você acaba de conquistar 1 ponto!`,
            duration: 8000,
          });
        } else {
          toast({
            title: "Ação registrada!",
            description: `${actionType} registrado. Ações hoje: ${result.actions_today}/3`,
          });
        }
      } else {
        // Limite atingido
        toast({
          title: "Limite diário atingido",
          description: result.completion_message || `Você já completou suas 3 ações diárias. Volte em ${result.hours_remaining} horas para novas tarefas.`,
          duration: 5000,
        });
      }

      return result;

    } catch (error) {
      console.error('Erro ao registrar ação:', error);
      return {
        success: false,
        message: 'Erro ao registrar ação'
      };
    }
  };

  // Buscar dados do usuário
  const fetchUserData = async (email: string) => {
    try {
      const { data: userData } = await supabase
        .from('gamification_users')
        .select('*')
        .eq('email', email)
        .single();

      if (userData) {
        setUser(userData);
        setIsRegistered(true);

        // Buscar ações de hoje
        const today = new Date().toISOString().split('T')[0];
        const { data: actionsData } = await supabase
          .from('gamification_actions')
          .select('*')
          .eq('user_id', userData.id)
          .eq('date_performed', today);

        setDailyActionsCount(actionsData?.length || 0);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  };

  // Verificar status do usuário
  const getUserStatus = () => {
    if (!user) return null;
    
    return {
      name: user.name,
      email: user.email,
      points: user.total_points,
      level: user.level_name,
      streak: user.current_streak,
      dailyActions: dailyActionsCount,
      canPerformActions: dailyActionsCount < 3
    };
  };

  return {
    user,
    isRegistered,
    isLoading,
    dailyActionsCount,
    registerUser,
    trackAction,
    fetchUserData,
    getUserStatus
  };
};