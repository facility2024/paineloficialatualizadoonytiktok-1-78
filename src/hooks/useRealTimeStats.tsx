import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RealTimeStats {
  totalContent: number;
  totalLikes: number;
  viewsToday: number;
  totalShares: number;
  totalFollowers: number;
  activeUsers: number;
  onlineUsersByState: { [state: string]: number };
  totalOnlineUsers: number;
  totalViews: number;
  activeViews: number;
  totalUsers: number;
  newUsersToday: number;
}

export const useRealTimeStats = () => {
  const [stats, setStats] = useState<RealTimeStats>({
    totalContent: 0,
    totalLikes: 0,
    viewsToday: 0,
    totalShares: 0,
    totalFollowers: 0,
    activeUsers: 0,
    onlineUsersByState: {},
    totalOnlineUsers: 0,
    totalViews: 0,
    activeViews: 0,
    totalUsers: 0,
    newUsersToday: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  
  // Refs para controlar intervalos e evitar duplicações
  const statsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const cleanupIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  const isFetching = useRef(false);
  const lastFetchTime = useRef(0);

  const fetchRealTimeStats = async () => {
    // Evitar múltiplas chamadas simultâneas
    const now = Date.now();
    if (isFetching.current || (now - lastFetchTime.current) < 5000) {
      return;
    }
    
    isFetching.current = true;
    lastFetchTime.current = now;
    
    try {
      console.log('🔄 Buscando dados reais do banco de dados...');
      
      // Usar Promise.all para executar queries em paralelo e reduzir tempo total
      const [
        contentResult,
        likesResult,
        viewsTodayResult,
        totalViewsResult,
        sharesResult,
        followersResult,
        activeUsersResult,
        onlineUsersResult,
        usersDataResult
      ] = await Promise.all([
        // Buscar total de conteúdos (modelos ativos)
        supabase
          .from('models')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Buscar total de curtidas ativas
        supabase
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Buscar views de hoje
        (() => {
          const today = new Date().toISOString().split('T')[0];
          return supabase
            .from('video_views')
            .select('*', { count: 'exact', head: true })
            .gte('created_at', today);
        })(),
        
        // Buscar total de views
        supabase
          .from('video_views')
          .select('*', { count: 'exact', head: true }),
        
        // Buscar total de compartilhamentos
        supabase
          .from('video_shares')
          .select('*', { count: 'exact', head: true }),
        
        // Buscar total de seguidores ativos
        supabase
          .from('model_followers')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true),
        
        // Buscar usuários ativos (última hora)
        (() => {
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
          return supabase
            .from('user_sessions')
            .select('*', { count: 'exact', head: true })
            .eq('is_active', true)
            .gte('last_activity_at', oneHourAgo);
        })(),
        
        // Buscar usuários online por estado (últimos 5 minutos)
        (() => {
          const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
          return supabase
            .from('online_users')
            .select('location_state')
            .eq('is_online', true)
            .gte('last_seen_at', fiveMinutesAgo)
            .not('location_state', 'is', null);
        })(),
        
        // Buscar dados combinados de usuários
        (() => {
          const today = new Date().toISOString().split('T')[0];
          return Promise.all([
            // Total de usuários bonus
            supabase
              .from('bonus_users')
              .select('*', { count: 'exact', head: true }),
            // Total de usuários gamificação  
            supabase
              .from('gamification_users')
              .select('*', { count: 'exact', head: true }),
            // Novos usuários bonus hoje
            supabase
              .from('bonus_users')
              .select('*', { count: 'exact', head: true })
              .gte('created_at', today),
            // Novos usuários gamificação hoje
            supabase
              .from('gamification_users')
              .select('*', { count: 'exact', head: true })
              .gte('created_at', today)
          ]);
        })()
      ]);

      // Processar dados dos usuários
      const [bonusUsersResult, gamificationUsersResult, newBonusUsersResult, newGamificationUsersResult] = usersDataResult;
      
      const totalUsers = (bonusUsersResult.count || 0) + (gamificationUsersResult.count || 0);
      const newUsersToday = (newBonusUsersResult.count || 0) + (newGamificationUsersResult.count || 0);

      // Processar dados de usuários online por estado
      let onlineUsersByState: { [state: string]: number } = {};
      let totalOnlineUsers = 0;

      if (onlineUsersResult.data && onlineUsersResult.data.length > 0) {
        onlineUsersResult.data.forEach((row: any) => {
          if (row.location_state) {
            onlineUsersByState[row.location_state] = (onlineUsersByState[row.location_state] || 0) + 1;
          }
        });
        totalOnlineUsers = Object.values(onlineUsersByState).reduce((sum, count) => sum + count, 0);
      }

      const newStats = {
        totalContent: contentResult.count || 0,
        totalLikes: likesResult.count || 0,
        viewsToday: viewsTodayResult.count || 0,
        totalShares: sharesResult.count || 0,
        totalFollowers: followersResult.count || 0,
        activeUsers: totalOnlineUsers || 0,
        onlineUsersByState,
        totalOnlineUsers,
        totalViews: totalViewsResult.count || 0,
        activeViews: activeUsersResult.count || 0,
        totalUsers,
        newUsersToday
      };

      setStats(newStats);

      console.log('📊 Real-time stats atualizadas:', newStats);

    } catch (error) {
      console.error('❌ Erro ao buscar estatísticas em tempo real:', error);
    } finally {
      setIsLoading(false);
      isFetching.current = false;
    }
  };

  const trackUserActivity = async (userId: string, location?: { state?: string; city?: string; country?: string }) => {
    try {
      // Detectar tipo de dispositivo
      const userAgent = navigator.userAgent;
      let deviceType = 'desktop';
      
      if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        if (/iPad/i.test(userAgent)) {
          deviceType = 'tablet';
        } else {
          deviceType = 'mobile';
        }
      } else if (/Tablet/i.test(userAgent)) {
        deviceType = 'tablet';
      }

      const now = new Date().toISOString();
      const clientIP = await getClientIP();

      // 1. Registrar/atualizar sessão do usuário
      const sessionToken = crypto.randomUUID();
      const { error: sessionError } = await supabase
        .from('user_sessions')
        .upsert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
          last_activity_at: now,
          location_state: location?.state || 'São Paulo',
          location_city: location?.city || 'São Paulo',
          location_country: location?.country || 'BR',
          user_agent: userAgent,
          ip_address: clientIP,
          device_type: deviceType,
          started_at: now,
          device_info: { type: deviceType, userAgent }
        }, {
          onConflict: 'user_id'
        });

      if (sessionError && sessionError.code !== '42P10') {
        console.error('❌ Erro ao registrar sessão:', sessionError);
      }

      // 2. Registrar/atualizar usuário online
      const { error: onlineError } = await supabase
        .from('online_users')
        .upsert({
          user_id: userId,
          is_online: true,
          last_seen_at: now,
          location_state: location?.state || 'São Paulo',
          location_city: location?.city || 'São Paulo',
          location_country: location?.country || 'BR',
          ip_address: clientIP,
          device_type: deviceType,
          user_agent: userAgent
        }, {
          onConflict: 'user_id'
        });

      if (onlineError && onlineError.code !== '42P10') {
        console.error('❌ Erro ao registrar usuário online:', onlineError);
      }

      // 3. Registrar evento de analytics
      await supabase
        .from('analytics_events')
        .insert({
          user_id: userId,
          event_name: 'user_activity',
          event_category: 'engagement',
          page_url: window.location.href,
          user_agent: userAgent,
          device_type: deviceType,
          ip_address: clientIP,
          region: location?.state,
          city: location?.city,
          country: location?.country || 'BR'
        });

      console.log('✅ Atividade registrada:', {
        userId,
        deviceType,
        location: location?.state || 'São Paulo',
        ip: clientIP
      });

    } catch (error) {
      console.error('❌ Erro ao rastrear atividade:', error);
    }
  };

  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  };

  // Limpeza de usuários inativos
  const cleanupInactiveUsers = async () => {
    try {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      
      // Marcar usuários como offline se não tiveram atividade nos últimos 5 minutos
      await supabase
        .from('online_users')
        .update({ is_online: false })
        .lt('last_seen_at', fiveMinutesAgo);

      // Marcar sessões como inativas
      await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .lt('last_activity_at', fiveMinutesAgo);

      console.log('🧹 Limpeza de usuários inativos executada');
    } catch (error) {
      console.error('❌ Erro na limpeza de usuários inativos:', error);
    }
  };

  // Configurar atualizações automáticas APENAS UMA VEZ
  useEffect(() => {
    if (!isInitialized.current) {
      console.log('🚀 Inicializando sistema de stats em tempo real...');
      isInitialized.current = true;

      // Buscar dados iniciais
      fetchRealTimeStats();

      // Executar limpeza inicial
      cleanupInactiveUsers();

      // Atualizar stats a cada 45 segundos (reduzido frequência para evitar sobrecarga)
      statsIntervalRef.current = setInterval(fetchRealTimeStats, 45000);

      // Limpar usuários inativos a cada 5 minutos
      cleanupIntervalRef.current = setInterval(cleanupInactiveUsers, 300000);

      // REMOVER real-time subscriptions para evitar updates em cascata
      // As atualizações automáticas por intervalo são suficientes

      return () => {
        console.log('🧹 Limpando recursos do useRealTimeStats...');
        if (statsIntervalRef.current) {
          clearInterval(statsIntervalRef.current);
          statsIntervalRef.current = null;
        }
        if (cleanupIntervalRef.current) {
          clearInterval(cleanupIntervalRef.current);
          cleanupIntervalRef.current = null;
        }
        isInitialized.current = false;
      };
    }
  }, []);

  return {
    stats,
    isLoading,
    fetchRealTimeStats,
    trackUserActivity
  };
};
