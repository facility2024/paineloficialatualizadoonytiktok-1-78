import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Heart, Eye, Share2, DollarSign, Users, Rocket, UserPlus } from 'lucide-react';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { supabase } from '@/integrations/supabase/client';

export const AdminStats = () => {
  const { stats: realTimeStats, isLoading } = useRealTimeStats();
  
  const [stats, setStats] = useState([
    {
      title: 'Total de Conteúdos',
      value: '0',
      icon: 'gif',
      gifSrc: '/src/assets/novo-conteudo.gif',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      shortTitle: 'Total'
    },
    {
      title: 'Total de Curtidas',
      value: '0',
      icon: Heart,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      shortTitle: 'Likes'
    },
    {
      title: 'Views Hoje',
      value: '0',
      icon: Eye,
      color: 'text-success',
      bgColor: 'bg-success/10',
      shortTitle: 'Views'
    },
    {
      title: 'Views Ativas',
      value: '0',
      icon: Eye,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      shortTitle: 'Ativas'
    },
    {
      title: 'Views Totais',
      value: '0',
      icon: Eye,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      shortTitle: 'Totais'
    },
    {
      title: 'Compartilhamentos',
      value: '0',
      icon: Share2,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      shortTitle: 'Shares'
    },
    {
      title: 'Receita Mensal',
      value: 'R$ 0',
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
      shortTitle: 'Receita'
    },
    {
      title: 'Seguidores',
      value: '0',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      shortTitle: 'Seguidores'
    },
    {
      title: 'Total de Usuários',
      value: '0',
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      shortTitle: 'Usuários'
    },
    {
      title: 'Novos Hoje',
      value: '0',
      icon: UserPlus,
      color: 'text-success',
      bgColor: 'bg-success/10',
      shortTitle: 'Novos'
    }
  ]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };


  // Atualizar stats quando os dados em tempo real mudarem
  useEffect(() => {
    if (!isLoading && realTimeStats) {
      // Calcular receita estimada baseada em views e likes
      const estimatedRevenue = (realTimeStats.viewsToday + realTimeStats.totalLikes) * 0.01;
      
      setStats(prev => [
        { ...prev[0], value: formatNumber(realTimeStats.totalContent) }, // Total de Conteúdos (24 modelos)
        { ...prev[1], value: formatNumber(realTimeStats.totalLikes) },   // Total de Curtidas (148)
        { ...prev[2], value: formatNumber(realTimeStats.viewsToday) },   // Views Hoje
        { ...prev[3], value: formatNumber(realTimeStats.activeViews) },  // Views Ativas (última hora)
        { ...prev[4], value: formatNumber(realTimeStats.totalViews) },   // Views Totais (1017)
        { ...prev[5], value: formatNumber(realTimeStats.totalShares) },  // Compartilhamentos (11)
        { ...prev[6], value: `R$ ${formatNumber(estimatedRevenue)}` },   // Receita Estimada
        { ...prev[7], value: formatNumber(realTimeStats.totalFollowers) }, // Seguidores (85)
        { ...prev[8], value: formatNumber(realTimeStats.totalUsers) },   // Total de Usuários (6 reais)
        { ...prev[9], value: formatNumber(realTimeStats.newUsersToday) } // Novos Hoje (6)
      ]);

      console.log('📊 DADOS REAIS DO BANCO:', {
        'Total de Modelos': realTimeStats.totalContent,
        'Total de Curtidas': realTimeStats.totalLikes,
        'Views Hoje': realTimeStats.viewsToday,
        'Views Ativas (1h)': realTimeStats.activeViews,
        'Views Totais': realTimeStats.totalViews,
        'Compartilhamentos': realTimeStats.totalShares,
        'Seguidores': realTimeStats.totalFollowers,
        'Total de Usuários': realTimeStats.totalUsers,
        'Novos Usuários Hoje': realTimeStats.newUsersToday,
        'Usuários Online': realTimeStats.totalOnlineUsers
      });
    }
  }, [realTimeStats, isLoading]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 bg-gradient-card border-border/50">
            <CardContent className="p-2 sm:p-3 lg:p-4">
              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start space-y-1 sm:space-y-0 sm:space-x-2">
                <div className={`flex-shrink-0 p-1.5 sm:p-2 rounded-lg ${stat.bgColor} animate-bounce`}>
                  {stat.icon === 'gif' ? (
                    <img 
                      src={stat.gifSrc} 
                      alt={stat.title}
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 object-contain animate-pulse"
                    />
                  ) : (
                    <Icon className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${stat.color} animate-pulse`} />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-medium text-muted-foreground mb-0.5 leading-tight">
                    <span className="hidden lg:inline">{stat.title}</span>
                    <span className="hidden sm:inline lg:hidden">{stat.shortTitle}</span>
                    <span className="sm:hidden">{stat.shortTitle}</span>
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-foreground leading-tight">
                    {stat.value}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};