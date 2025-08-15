import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useVideoActions } from '@/hooks/useVideoActions';
import { VideoPlayer } from '@/components/tiktok/VideoPlayer';
import { SideMenu } from '@/components/tiktok/SideMenu';
import { BottomInfo } from '@/components/tiktok/BottomInfo';
import { ProfileScreen } from '@/components/tiktok/ProfileScreen';
import { CommentsScreen } from '@/components/tiktok/CommentsScreen';
import { BonusGift } from '@/components/tiktok/BonusGift';
import { VinylRecord } from '@/components/tiktok/VinylRecord';
import { ActionTracker, useActionTracker } from '@/components/tiktok/ActionTracker';
import { useAppAnalytics } from '@/hooks/useAppAnalytics';
import { useNativeShare } from '@/hooks/useNativeShare';
import { VideoPreviewModal } from '@/components/admin/VideoPreviewModal';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Heart, MessageCircle, Share, User, Search, ChevronUp, ChevronDown } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SearchModal } from '@/components/tiktok/SearchModal';
import { LiveModal } from '@/components/tiktok/LiveModal';
import { PremiumModal } from '@/components/tiktok/PremiumModal';
import useEmblaCarousel from 'embla-carousel-react';
import { VideoCarousel } from '@/components/ui/video-carousel';
import { usePremiumStatus } from '@/hooks/usePremiumStatus';


interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  user_id: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  views_count: number;
  music_name: string;
  is_active: boolean;
  visibility?: 'public' | 'premium';
  created_at: string;
  user: {
    id: string;
    username: string;
    avatar_url: string;
    followers_count: number;
    following_count: number;
    is_online: boolean;
    created_at: string;
  };
}

interface Comment {
  id: string;
  text: string;
  user_id: string;
  video_id: string;
  likes_count: number;
  created_at: string;
  user: {
    username: string;
    avatar_url: string;
  };
}

export const TikTokApp = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [followingModels, setFollowingModels] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [showPremium, setShowPremium] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [selectedVideoForPreview, setSelectedVideoForPreview] = useState<any>(null);
  const [blockedModels, setBlockedModels] = useState<string[]>([]); // Lista de modelos bloqueados
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { checkAndTrackAction } = useActionTracker();
  const { trackLike, trackComment, trackShare, trackView, trackFollow } = useAppAnalytics();
  const { shareVideo: shareVideoNative } = useNativeShare();
  console.log('🎯 DEBUG: Importações do useAppAnalytics:', { trackLike, trackComment, trackShare, trackView, trackFollow });
  const { isPremium, isContentUnlocked, checkPremiumStatus } = usePremiumStatus();

  // Handle action tracking with async support
  const handleActionAttempt = async (actionType: string, userName: string): Promise<boolean> => {
    const currentVideo = videos[currentVideoIndex];
    return await checkAndTrackAction(actionType, currentVideo?.id, currentVideo?.user_id);
  };
  
  // Embla Carousel for vertical swipe - sequência linear sem loop
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    axis: 'y',
    loop: true,
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  const currentVideo = videos[currentVideoIndex];

  // Performance: preconnect to CDN domain once we know it
  useEffect(() => {
    if (!videos.length) return;
    try {
      const url = new URL(videos[0].video_url);
      const origins = [url.origin];
      origins.forEach((origin) => {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = origin;
        preconnect.crossOrigin = 'anonymous';
        document.head.appendChild(preconnect);

        const dns = document.createElement('link');
        dns.rel = 'dns-prefetch';
        dns.href = origin;
        document.head.appendChild(dns);
      });
    } catch {}
  }, [videos]);

  // Performance: preload first video
  useEffect(() => {
    if (!videos.length) return;
    const first = videos[0];
    if (!first?.video_url) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = first.video_url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    return () => link.remove();
  }, [videos]);

  // Smart prefetch: warm up next video (1 ahead)
  useEffect(() => {
    if (!videos.length) return;
    const nextIndex = Math.min(currentVideoIndex + 1, videos.length - 1);
    if (nextIndex === currentVideoIndex) return;
    const nextUrl = videos[nextIndex]?.video_url;
    if (!nextUrl) return;
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.muted = true;
    v.src = nextUrl;
    v.style.position = 'fixed';
    v.style.left = '-9999px';
    v.style.width = '1px';
    v.style.height = '1px';
    document.body.appendChild(v);
    const cleanup = () => { try { v.remove(); } catch {} };
    v.onloadedmetadata = cleanup;
    v.onerror = cleanup;
    const t = window.setTimeout(cleanup, 8000);
    return () => { window.clearTimeout(t); cleanup(); };
  }, [currentVideoIndex, videos]);

  // Update video when carousel slides
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      if (newIndex !== currentVideoIndex) {
        setCurrentVideoIndex(newIndex);
      }
    };

    emblaApi.on('select', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi, currentVideoIndex]);

  useEffect(() => {
    console.log('🚀 INICIALIZANDO APLICATIVO - Carregando dados...');
    loadVideos();
    
    // ✅ REMOVER carregamento periódico para evitar notificações constantes
    
    // 🔄 COMUNICAÇÃO OTIMIZADA EM TEMPO REAL COM PAINEL ADMIN
    console.log('🚀 Configurando comunicação bidirecional admin-app...');
    
    let lastToastTime = 0;
    const TOAST_COOLDOWN = 5000; // 5 segundos entre toasts
    
    const showToast = (title: string, description: string) => {
      const now = Date.now();
      if (now - lastToastTime > TOAST_COOLDOWN) {
        toast({ title, description });
        lastToastTime = now;
      }
    };
    
    // Canal consolidado para todas as mudanças importantes
    const adminChannel = supabase
      .channel('admin-app-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'videos' },
        (payload) => {
          console.log('🎬 ADMIN → APP: Mudança em vídeos:', payload.eventType);
          loadVideos();
          if (payload.eventType === 'INSERT') {
            showToast("📱 Novo Conteúdo!", "Vídeo adicionado pelo admin");
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'models' },
        (payload) => {
          console.log('👤 ADMIN → APP: Mudança em modelos:', payload.eventType);
          loadVideos();
          if (payload.eventType === 'INSERT') {
            showToast("👤 Novo Modelo!", "Perfil adicionado pelo admin");
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts_principais' },
        (payload) => {
          console.log('🏠 ADMIN → APP: Novo post na tela principal');
          loadVideos();
          showToast("🏠 Novo Post!", "Conteúdo adicionado na tela principal");
        }
      )
      .subscribe();

    // Cleanup ao desmontar
    return () => {
      console.log('🔌 Removendo canal de comunicação admin-app...');
      supabase.removeChannel(adminChannel);
    };
  }, []); // REMOVIDO currentVideo da dependência para evitar loop

  useEffect(() => {
    console.log('🔍 DEBUG: useEffect disparado com currentVideo:', currentVideo?.id);
    console.log('🔍 DEBUG: trackView disponível:', typeof trackView);
    
    const registerView = async () => {
      if (currentVideo) {
        console.log('📹 REGISTRANDO VIEW para vídeo:', currentVideo.id);
        try {
          await trackView(currentVideo.id, currentVideo.user.id);
          console.log('✅ VIEW registrada com sucesso!');
        } catch (error) {
          console.error('❌ Erro ao registrar view:', error);
        }
      }
    };
    
    if (currentVideo) {
      loadComments(currentVideo.id);
      checkIfLiked(currentVideo.id);
      checkIfFollowing(currentVideo.user.id);
      registerView();
    }
  }, [currentVideo, trackView]);

  const createExampleData = (): Video[] => {
    return [
      {
        id: '1',
        title: 'Vídeo de Exemplo 1',
        description: 'Este é um vídeo de demonstração',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnail_url: '',
        user_id: 'user1',
        likes_count: 1500,
        comments_count: 150,
        shares_count: 75,
        views_count: 10000,
        music_name: 'Som Original',
        is_active: true,
        visibility: 'public',
        created_at: new Date().toISOString(),
        user: {
          id: 'user1',
          username: 'DemoUser1',
          avatar_url: '',
          followers_count: 1000,
          following_count: 500,
          is_online: true,
          created_at: new Date().toISOString()
        }
      },
      {
        id: '2',
        title: 'Vídeo de Exemplo 2',
        description: 'Outro vídeo de demonstração',
        video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        thumbnail_url: '',
        user_id: 'user2',
        likes_count: 2300,
        comments_count: 220,
        shares_count: 120,
        views_count: 15000,
        music_name: 'Som Original',
        is_active: true,
        visibility: 'public',
        created_at: new Date().toISOString(),
        user: {
          id: 'user2',
          username: 'DemoUser2',
          avatar_url: '',
          followers_count: 2000,
          following_count: 800,
          is_online: false,
          created_at: new Date().toISOString()
        }
      }
    ];
  };

  const loadVideos = async () => {
    try {
      console.log('🚀 ADMIN DEBUG: Carregando vídeos do Supabase...');
      console.log('🔍 ADMIN DEBUG: Timestamp:', new Date().toISOString());
      
      // ✅ QUERY CORRIGIDA: Buscar TODOS os vídeos ativos (ordenar por atualização/publicação)
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('is_active', true)
        .order('updated_at', { ascending: false });

      if (videosError) {
        console.error('❌ ADMIN DEBUG: Erro ao carregar vídeos:', videosError);
        console.error('❌ ADMIN DEBUG: Erro detalhado:', JSON.stringify(videosError, null, 2));
        
        // Se a tabela não existir, criar dados de exemplo
        if (videosError.code === 'PGRST116' || videosError.message?.includes('relation') || videosError.message?.includes('does not exist')) {
          console.log('📝 ADMIN DEBUG: Tabela videos não existe, criando dados de exemplo...');
          const exampleVideos = createExampleData();
          setVideos(exampleVideos);
          setLoading(false);
          toast({
            title: "🔄 Modo Demo",
            description: "Usando dados de exemplo (banco não configurado)",
            duration: 3000,
          });
          return;
        }
        throw videosError;
      }

      console.log('📹 ADMIN DEBUG: Vídeos encontrados:', videosData?.length || 0);
      console.log('📹 ADMIN DEBUG: Dados dos vídeos:', videosData);

      // ✅ QUERY CORRIGIDA: Buscar TODOS os modelos ativos
      const { data: modelsData, error: modelsError } = await supabase
        .from('models')
        .select('*')
        .eq('is_active', true);

      if (modelsError) {
        console.error('❌ ADMIN DEBUG: Erro ao carregar modelos:', modelsError);
        console.error('❌ ADMIN DEBUG: Erro detalhado modelos:', JSON.stringify(modelsError, null, 2));
        
        // Se a tabela models não existir, continuar sem ela
        if (modelsError.code === 'PGRST116' || modelsError.message?.includes('relation') || modelsError.message?.includes('does not exist')) {
          console.log('📝 ADMIN DEBUG: Tabela models não existe, continuando sem ela...');
        }
      }

      console.log('👤 ADMIN DEBUG: Modelos encontrados:', modelsData?.length || 0);
      console.log('👤 ADMIN DEBUG: Dados dos modelos:', modelsData);

      // Normalize and validate video URLs
      const normalizeUrl = (u: string) => {
        const raw = (u || '').trim();
        if (!raw) return '';
        if (!/^https?:\/\//i.test(raw) && /^[\w.-]+\.[\w.-]+/.test(raw)) {
          return `https://${raw}`;
        }
        return raw;
      };
      const isValidVideoUrl = (u: string) => /^https?:\/\//i.test(u);

      // Incluir TODOS os vídeos (single, lista e programados já ativos)
      const feedEligible = (videosData || []);

      const videosWithModels = feedEligible
        ?.map((v) => ({ ...v, video_url: normalizeUrl(v.video_url || '') }))
        .filter((v) => isValidVideoUrl(v.video_url))
        .map(video => {
          const model = modelsData?.find(m => m.id === video.model_id);
          console.log(`🔗 ADMIN DEBUG: Processando vídeo ${video.id} com modelo ${video.model_id}:`, model ? 'ENCONTRADO' : 'NÃO ENCONTRADO');
          
          return {
            ...video,
            user_id: video.model_id || '',
            music_name: video.title || 'Som Original',
            user: model ? {
              id: model.id,
              username: model.username || model.name || 'Usuário',
              avatar_url: model.avatar_url || '',
              followers_count: model.followers_count || 0,
              following_count: 0,
              is_online: model.is_live || false,
              bio: model.bio || '',
              created_at: model.created_at || ''
            } : { 
              id: video.model_id || '', 
              username: video.title || 'Usuário',
              avatar_url: '',
              followers_count: 0,
              following_count: 0,
              is_online: false,
              bio: '',
              created_at: ''
            }
          };
        }) || [];

      // 🔥 SEQUÊNCIA LINEAR: Organizar vídeos por modelo (um vídeo por modelo em sequência)
      const uniqueModelVideos = videosWithModels.reduce((acc: any[], video) => {
        const existingModelIndex = acc.findIndex(v => v.user.id === video.user.id);
        const getSortTime = (v: any) => new Date((v as any).updated_at || (v as any).published_at || (v as any).created_at || 0).getTime();
        
        if (existingModelIndex === -1) {
          // Primeiro vídeo desta modelo - adicionar
          acc.push(video);
        } else {
          // Já existe vídeo desta modelo - pegar o mais recente considerando updated_at/published_at
          if (getSortTime(video) > getSortTime(acc[existingModelIndex])) {
            acc[existingModelIndex] = video;
          }
        }
        
        return acc;
      }, []);

      console.log('✅ ADMIN DEBUG: Vídeos únicos por modelo:', uniqueModelVideos.length);
      console.log('✅ ADMIN DEBUG: Vídeos finais:', uniqueModelVideos);
      
      setVideos(uniqueModelVideos);
      setLoading(false);
      
      if (uniqueModelVideos.length > 0 && currentVideoIndex === 0 && !currentVideo) {
        setCurrentVideoIndex(0);
        console.log('🎯 ADMIN DEBUG: Definindo vídeo inicial:', uniqueModelVideos[0]);
      }
      
      // ✅ Notificação apenas se houver mudança real no número de vídeos
      if (uniqueModelVideos.length !== videos.length) {
        toast({
          title: "✅ Conteúdo Atualizado",
          description: `${uniqueModelVideos.length} vídeos disponíveis`,
          duration: 2000,
        });
      }

    } catch (error) {
      console.error('❌ ADMIN DEBUG: Erro completo ao carregar vídeos:', error);
      setLoading(false);
      toast({
        title: "❌ Erro ao Carregar",
        description: "Falha ao conectar com o banco de dados",
        variant: "destructive"
      });
    }
  };
  // Abrir vídeo selecionado de um perfil na tela principal
  const openSelectedVideo = async (videoId: string) => {
    try {
      const { data: vData, error: vErr } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single();
      if (vErr || !vData) return;

      const { data: model, error: mErr } = await supabase
        .from('models')
        .select('*')
        .eq('id', vData.model_id)
        .single();
      if (mErr) console.warn('Model not found for video:', videoId);

      const normalizeUrl = (u: string) => {
        const raw = (u || '').trim();
        if (!raw) return '';
        if (!/^https?:\/\//i.test(raw) && /^[\w.-]+\.[\w.-]+/.test(raw)) {
          return `https://${raw}`;
        }
        return raw;
      };

      const enrichedVideo: any = {
        ...vData,
        video_url: normalizeUrl(vData.video_url || ''),
        user_id: vData.model_id || '',
        music_name: vData.title || 'Som Original',
        user: model ? {
          id: model.id,
          username: model.username || model.name || 'Usuário',
          avatar_url: model.avatar_url || '',
          followers_count: model.followers_count || 0,
          following_count: 0,
          is_online: model.is_live || false,
          created_at: model.created_at || ''
        } : {
          id: vData.model_id || '',
          username: vData.title || 'Usuário',
          avatar_url: '',
          followers_count: 0,
          following_count: 0,
          is_online: false,
          created_at: ''
        }
      };

      const modelId = enrichedVideo.user?.id;
      const idx = videos.findIndex(v => (v as any).user?.id === modelId);
      if (idx >= 0) {
        const arr = [...videos];
        arr[idx] = enrichedVideo;
        setVideos(arr);
        emblaApi?.scrollTo(idx);
        setCurrentVideoIndex(idx);
      } else {
        const arr = [enrichedVideo, ...videos];
        setVideos(arr);
        emblaApi?.scrollTo(0);
        setCurrentVideoIndex(0);
      }
      setShowProfile(false);
    } catch (e) {
      console.error('Erro ao abrir vídeo selecionado:', e);
    }
  };

  const loadComments = async (videoId: string) => {
    try {
      console.log('💬 LOADING COMMENTS for video:', videoId);
      
      const { data: commentsData, error } = await supabase
        .from('comments')
        .select('*')
        .eq('video_id', videoId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading comments:', error);
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('📝 Comments table não existe, usando array vazio...');
          setComments([]);
          return;
        }
        throw error;
      }

      console.log('💬 Comments loaded:', commentsData?.length || 0);
      
      // Transform the data to match the Comment interface
      const transformedComments = (commentsData || []).map((comment: any) => ({
        id: comment.id,
        text: comment.content || comment.text || '',
        user_id: comment.user_id,
        video_id: comment.video_id,
        likes_count: comment.likes_count || 0,
        created_at: comment.created_at,
        user: {
          username: comment.username || `User ${comment.user_id?.slice(0, 8)}`,
          avatar_url: comment.avatar_url || '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png'
        }
      }));

      setComments(transformedComments);
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      setComments([]);
    }
  };

  const checkIfLiked = async (videoId: string) => {
    try {
      // Use consistent user ID from session
      const currentUserId = localStorage.getItem('session_user_id') || (() => {
        const newId = crypto.randomUUID();
        localStorage.setItem('session_user_id', newId);
        return newId;
      })();
      
      console.log('🔍 CHECKING IF LIKED:');
      console.log('🔍 Video ID:', videoId);
      console.log('🔍 User ID:', currentUserId);
      
      // Check if user has liked this video in database
      const { data, error } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('video_id', videoId)
        .eq('is_active', true)
        .maybeSingle();
      
      if (error) {
        console.error('❌ Error checking like status:', error);
        if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
          console.log('📝 Likes table não existe, usando localStorage...');
          const liked = localStorage.getItem(`liked_${videoId}`);
          setIsLiked(liked === 'true');
          return;
        }
        setIsLiked(false);
        return;
      }
      
      const liked = data ? true : false;
      console.log('🔍 IS LIKED:', liked);
      setIsLiked(liked);
      // Also update localStorage for consistency
      localStorage.setItem(`liked_${videoId}`, liked.toString());
    } catch (error) {
      console.error('Error in checkIfLiked:', error);
      // Fallback to localStorage
      const liked = localStorage.getItem(`liked_${videoId}`);
      setIsLiked(liked === 'true');
    }
  };

  const checkIfFollowing = async (modelId: string) => {
    try {
      // Use consistent user ID from session
      const currentUserId = sessionStorage.getItem('user_id') || (() => {
        const newId = crypto.randomUUID();
        sessionStorage.setItem('user_id', newId);
        return newId;
      })();
      
      console.log('🔍 CHECKING IF FOLLOWING:');
      console.log('🔍 Model ID:', modelId);
      console.log('🔍 User ID:', currentUserId);
      
      const { data, error } = await supabase
        .from('model_followers')
        .select('id')
        .eq('user_id', currentUserId)
        .eq('model_id', modelId)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('❌ Error checking if following:', error);
        setFollowingModels(prev => ({
          ...prev,
          [modelId]: false
        }));
        return;
      }
      
      const following = data ? true : false;
      console.log('🔍 IS FOLLOWING:', following);
      setFollowingModels(prev => ({
        ...prev,
        [modelId]: following
      }));
    } catch (error) {
      console.error('Error in checkIfFollowing:', error);
      setFollowingModels(prev => ({
        ...prev,
        [modelId]: false
      }));
    }
  };


  const toggleLike = async () => {
    if (!currentVideo) return;

    console.log('🔥 TOGGLE LIKE - Iniciando para vídeo:', currentVideo.id);

    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Update local storage
    localStorage.setItem(`liked_${currentVideo.id}`, newLikedState.toString());

    try {
      // Use a consistent user ID for the session
      const currentUserId = localStorage.getItem('session_user_id') || (() => {
        const newId = crypto.randomUUID();
        localStorage.setItem('session_user_id', newId);
        return newId;
      })();
      
      console.log('🔥 TOGGLE LIKE - User ID:', currentUserId, 'Action:', newLikedState ? 'LIKE' : 'UNLIKE');

      if (newLikedState) {
        // Insert like into database
        const { error: insertError } = await supabase
          .from('likes')
          .insert({
            user_id: currentUserId,
            video_id: currentVideo.id,
            model_id: currentVideo.user?.id || currentVideo.user_id || null,
            is_active: true,
            ip_address: null,
            user_agent: navigator.userAgent
          });
        
        if (insertError) {
          console.error('❌ Error inserting like:', insertError);
          // Se erro for de coluna não existir, tentar inserção mais simples
          if (insertError.message?.includes('column') || insertError.code === '42703') {
            console.log('🔧 Tentando inserção simplificada...');
            const { error: simpleError } = await supabase
              .from('likes')
              .insert({
                user_id: currentUserId,
                video_id: currentVideo.id,
                is_active: true
              });
            if (simpleError) throw simpleError;
          } else {
            throw insertError;
          }
        }

        console.log('✅ LIKE registrado no banco de dados');
      } else {
        // Remove like from database
        const { error: deleteError } = await supabase
          .from('likes')
          .delete()
          .match({
            user_id: currentUserId,
            video_id: currentVideo.id
          });
        
        if (deleteError) {
          console.error('Error deleting like:', deleteError);
          throw deleteError;
        }

        console.log('✅ LIKE removido do banco de dados');
      }

      // ✨ IMPORTANTE: Registrar no sistema de analytics
      await trackLike(currentVideo.id, currentVideo.user?.id || '', newLikedState);
      await checkAndTrackAction('like', currentVideo.id, currentVideo.user_id);

      // Update video likes count
      const newCount = Math.max(0, currentVideo.likes_count + (newLikedState ? 1 : -1));
      
      const { error } = await supabase
        .from('videos')
        .update({ likes_count: newCount })
        .eq('id', currentVideo.id);

      if (error) throw error;

      // Update local state
      setVideos(prev => prev.map(video => 
        video.id === currentVideo.id 
          ? { ...video, likes_count: newCount }
          : video
      ));

      if (newLikedState) {
        // Add like explosion animation
        createLikeExplosion();
      }

      console.log('✅ TOGGLE LIKE - Ação completa! Novo count:', newCount);

    } catch (error) {
      console.error('❌ TOGGLE LIKE - Erro:', error);
      // Revert on error
      setIsLiked(!newLikedState);
      localStorage.setItem(`liked_${currentVideo.id}`, (!newLikedState).toString());
    }
  };

  const createLikeExplosion = () => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'like-explosion-heart';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = Math.random() * window.innerHeight + 'px';
    document.body.appendChild(heart);
    
    setTimeout(() => {
      document.body.removeChild(heart);
    }, 1200);
  };

  const addComment = async (text: string) => {
    if (!currentVideo || !text.trim()) return;

    console.log('💬 ADD COMMENT - Iniciando para vídeo:', currentVideo.id);

    try {
      // Use consistent user ID from session (same as likes)
      const currentUserId = localStorage.getItem('session_user_id') || (() => {
        const newId = crypto.randomUUID();
        localStorage.setItem('session_user_id', newId);
        return newId;
      })();

      // In a real app, you'd have a current user
      const mockUser = {
        id: currentUserId,
        username: 'Visitante',
        avatar_url: '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png'
      };

      console.log('💬 ADD COMMENT - Inserindo:', { text: text.trim(), user_id: currentUserId, video_id: currentVideo.id });

      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: text.trim(),
          user_id: currentUserId,
          video_id: currentVideo.id,
          model_id: currentVideo.user.id,
          likes_count: 0,
          ip_address: null,
          user_agent: navigator.userAgent
        })
        .select('*')
        .single();

      if (error) {
        console.error('❌ Error inserting comment:', error);
        throw error;
      }

      console.log('✅ Comment inserted successfully:', data);

      // ✨ IMPORTANTE: Registrar no sistema de analytics
      await trackComment(currentVideo.id, currentVideo.user?.id || '');
      await checkAndTrackAction('comment', currentVideo.id, currentVideo.user_id);

      // Add comment to local state with transformed format - ADD TO BEGINNING
      const newComment = {
        id: data.id,
        text: data.content,
        user_id: data.user_id,
        video_id: data.video_id,
        likes_count: data.likes_count,
        created_at: data.created_at,
        user: {
          username: mockUser.username,
          avatar_url: mockUser.avatar_url
        }
      };

      console.log('💬 ADD COMMENT - Adicionando ao estado local:', newComment);

      // Prepend to comments list so new comment appears first
      setComments(prev => {
        const updatedComments = [newComment, ...prev];
        console.log('💬 Updated comments list:', updatedComments);
        return updatedComments;
      });

      // Update video comments count
      const newCount = currentVideo.comments_count + 1;
      await supabase
        .from('videos')
        .update({ comments_count: newCount })
        .eq('id', currentVideo.id);

      setVideos(prev => prev.map(video => 
        video.id === currentVideo.id 
          ? { ...video, comments_count: newCount }
          : video
      ));

      console.log('✅ ADD COMMENT - Ação completa! Novo count:', newCount);

      toast({
        title: "Comentário adicionado!",
        description: "Seu comentário foi publicado"
      });
    } catch (error) {
      console.error('❌ ADD COMMENT - Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o comentário",
        variant: "destructive"
      });
    }
  };

  const shareVideo = async () => {
    if (!currentVideo) return;

    console.log('📤 SHARE VIDEO - Iniciando para vídeo:', currentVideo.id);

    try {
      // Use consistent user ID
      const currentUserId = localStorage.getItem('session_user_id') || (() => {
        const newId = crypto.randomUUID();
        localStorage.setItem('session_user_id', newId);
        return newId;
      })();

      // Usar o compartilhamento nativo
      const shareResult = await shareVideoNative({
        videoId: currentVideo.id,
        modelId: currentVideo.user?.id || currentVideo.user_id || '',
        videoTitle: currentVideo.title || 'Vídeo',
        modelName: currentVideo.user?.username || 'Usuário'
      });

      if (shareResult) {
        console.log('✅ Compartilhamento realizado com sucesso');
        
        // ✨ IMPORTANTE: Registrar no sistema de analytics
        await trackShare(currentVideo.id, currentVideo.user?.id || '');
        await checkAndTrackAction('share', currentVideo.id, currentVideo.user_id);
      } else {
        console.log('Compartilhamento cancelado ou falhou');
      }

    } catch (error) {
      console.error('❌ SHARE VIDEO - Erro:', error);
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar o vídeo",
        variant: "destructive"
      });
    }
  };

  const followModel = async () => {
    if (!currentVideo) return;
    
    const currentIsFollowing = followingModels[currentVideo.user.id] || false;
    if (currentIsFollowing) return;

    console.log('🔔 SEGUIR: Iniciando processo de seguir modelo', {
      modelId: currentVideo.user.id,
      modelName: currentVideo.user.username,
      currentIsFollowing: currentIsFollowing
    });

    try {
      // Usar ID consistente do usuário - pega do sessionStorage ou cria um fixo
      let userId = sessionStorage.getItem('user_id');
      if (!userId) {
        userId = crypto.randomUUID();
        sessionStorage.setItem('user_id', userId);
        console.log('🔔 SEGUIR: Novo userId criado:', userId);
      } else {
        console.log('🔔 SEGUIR: UserId existente:', userId);
      }
      
      const userData = {
        id: userId,
        name: 'Usuário Visitante',
        email: 'usuario@exemplo.com'
      };

      console.log('🔔 SEGUIR: Inserindo dados no banco:', {
        user_id: userData.id,
        model_id: currentVideo.user.id,
        user_name: userData.name,
        user_email: userData.email,
        is_active: true,
        modelo_nome: currentVideo.user.username
      });

      const { error } = await supabase
        .from('model_followers')
        .insert({
          user_id: userData.id,
          model_id: currentVideo.user.id,
          user_name: userData.name,
          user_email: userData.email,
          is_active: true
        });

      if (error) {
        console.log('❌ SEGUIR: Erro ao inserir:', error);
        // Se erro for de duplicate key, significa que já está seguindo
        if (error.code === '23505') {
          console.log('🔔 SEGUIR: Usuário já segue, atualizando para ativo');
          // Atualizar para ativo caso já exista mas inativo
          await supabase
            .from('model_followers')
            .update({ is_active: true })
            .match({ 
              user_id: userData.id, 
              model_id: currentVideo.user.id 
            });
        } else {
          throw error;
        }
      } else {
        console.log('✅ SEGUIR: Dados inseridos com sucesso!');
      }

      // Atualizar contador de seguidores na tabela models
      try {
        // Buscar count atual de seguidores
        const { count: followersCount } = await supabase
          .from('model_followers')
          .select('*', { count: 'exact', head: true })
          .eq('model_id', currentVideo.user.id)
          .eq('is_active', true);

        // Atualizar o contador na tabela models
        const { error: updateError } = await supabase
          .from('models')
          .update({ followers_count: followersCount || 0 })
          .eq('id', currentVideo.user.id);

        if (updateError) {
          console.error('❌ SEGUIR: Erro ao atualizar contador:', updateError);
        } else {
          console.log('✅ SEGUIR: Contador de seguidores atualizado:', followersCount);
        }
      } catch (counterError) {
        console.error('❌ SEGUIR: Erro ao contar seguidores:', counterError);
      }

      setFollowingModels(prev => ({
        ...prev,
        [currentVideo.user.id]: true
      }));
      
      // 📊 REGISTRAR AÇÃO NO PAINEL ADMIN
      await trackFollow(currentVideo.user.id);
      
      // Atualizar contador localmente
      setVideos(prev => prev.map(video => 
        video.user.id === currentVideo.user.id
          ? { 
              ...video, 
              user: { 
                ...video.user, 
                followers_count: video.user.followers_count + 1 
              }
            }
          : video
      ));

      // Mostrar notificação
      console.log('🔔 SEGUIR: Processo concluído com sucesso!');
      toast({
        title: `Você está seguindo ${currentVideo.user.username}!`,
        description: "Agora você receberá atualizações dos novos conteúdos",
        duration: 4000,
      });

    } catch (error) {
      console.error('Error following model:', error);
      toast({
        title: "Erro",
        description: "Não foi possível seguir a modelo",
        variant: "destructive"
      });
    }
  };

  const nextVideo = useCallback(() => {
    console.log('⬇️ NAVEGAÇÃO: Próximo vídeo solicitado');
    console.log(`⬇️ NAVEGAÇÃO: Vídeo atual: ${currentVideoIndex + 1}/${videos.length}`);
    
    if (emblaApi && isMobile) {
      console.log('⬇️ NAVEGAÇÃO: Usando Embla (mobile)');
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        console.log('🔁 FIM DA LISTA (mobile) → Voltando ao topo');
        emblaApi.scrollTo(0);
      }
    } else {
      if (currentVideoIndex < videos.length - 1) {
        const nextIndex = currentVideoIndex + 1;
        console.log(`⬇️ NAVEGAÇÃO: Indo para vídeo ${nextIndex + 1}/${videos.length} (desktop)`);
        setCurrentVideoIndex(nextIndex);
      } else if (videos.length > 0) {
        console.log('🔁 FIM DA LISTA (desktop) → Voltando ao topo');
        setCurrentVideoIndex(0);
      }
    }
  }, [emblaApi, isMobile, currentVideoIndex, videos.length]);

  const prevVideo = useCallback(() => {
    console.log('⬆️ NAVEGAÇÃO: Vídeo anterior solicitado');
    console.log(`⬆️ NAVEGAÇÃO: Vídeo atual: ${currentVideoIndex + 1}/${videos.length}`);
    
    if (emblaApi && isMobile) {
      console.log('⬆️ NAVEGAÇÃO: Usando Embla (mobile)');
      if (emblaApi.canScrollPrev()) {
        emblaApi.scrollPrev();
      }
    } else {
      if (currentVideoIndex > 0) {
        const prevIndex = currentVideoIndex - 1;
        console.log(`⬆️ NAVEGAÇÃO: Indo para vídeo ${prevIndex + 1}/${videos.length} (desktop)`);
        setCurrentVideoIndex(prevIndex);
      }
    }
  }, [emblaApi, isMobile, currentVideoIndex, videos.length]);

  const goToModelVideo = (modelId: string) => {
    const modelVideoIndex = videos.findIndex(video => video.user.id === modelId);
    if (modelVideoIndex !== -1) {
      setCurrentVideoIndex(modelVideoIndex);
    }
  };

  const handleBlockVideo = () => {
    if (!currentVideo) {
      console.log('❌ Nenhum vídeo atual para bloquear');
      return;
    }
    
    console.log('🔒 Bloqueando vídeo:', currentVideo.title);
    console.log('🔒 User:', currentVideo.user.username);
    
    // Prepare content data for preview modal
    const contentData = {
      id: currentVideo.id,
      displayName: currentVideo.user.username,
      avatarUrl: currentVideo.user.avatar_url || '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png',
      platform: 'premium', // Define como premium para mostrar o modal
      views: currentVideo.views_count,
      likes: currentVideo.likes_count
    };
    
    console.log('🔒 Content data:', contentData);
    
    setSelectedVideoForPreview(contentData);
    setShowVideoPreview(true);
    
    console.log('🔒 Modal deve estar aberto agora');
  };

  // Embla carousel event listeners
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentVideoIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect(); // Set initial index

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Keyboard navigation for desktop
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMobile && !showProfile && !showComments && !showSearch && !showLive && !showVideoPreview) {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            prevVideo();
            break;
          case 'ArrowDown':
            e.preventDefault();
            nextVideo();
            break;
          case ' ':
            e.preventDefault();
            setIsPlaying(!isPlaying);
            break;
        }
      }
    };

    // Mouse wheel for desktop
    const handleWheel = (e: WheelEvent) => {
      if (!isMobile && !showProfile && !showComments && !showSearch && !showLive && !showVideoPreview) {
        e.preventDefault();
        if (e.deltaY > 0) {
          nextVideo();
        } else {
          prevVideo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isMobile, isPlaying, nextVideo, prevVideo, showProfile, showComments, showSearch, showLive, showVideoPreview]);

  // Remove old touch gestures - now handled by Embla

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Carregando vídeos...</p>
        </div>
      </div>
    );
  }

  if (!currentVideo || videos.length === 0) {
    console.log('🚫 RENDER: Nenhum vídeo disponível');
    console.log('🚫 RENDER: videos.length:', videos.length);
    console.log('🚫 RENDER: currentVideoIndex:', currentVideoIndex);
    console.log('🚫 RENDER: currentVideo:', currentVideo);
    
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center">
          <p className="text-xl mb-4">Nenhum vídeo disponível</p>
          <p className="text-gray-400">Aguarde novos conteúdos!</p>
          <Button 
            onClick={loadVideos} 
            className="mt-4 bg-primary hover:bg-primary/80"
          >
            Recarregar
          </Button>
        </div>
      </div>
    );
  }

  console.log('✅ RENDER: Renderizando vídeo');
  console.log('✅ RENDER: currentVideo:', currentVideo?.title);
  console.log('✅ RENDER: currentVideoIndex:', currentVideoIndex);
  console.log('✅ RENDER: videos.length:', videos.length);

  // Mobile version with vertical swiper
  if (isMobile) {
    return (
      <div className="relative w-full h-screen bg-black overflow-hidden [&::-webkit-scrollbar]:hidden [-webkit-scrollbar:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        
        {/* Search Button */}
        <button
          onClick={() => setShowSearch(true)}
          className="fixed top-4 left-4 z-30 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
        >
          <Search className="w-6 h-6" />
        </button>

        {/* Bonus Gift - positioned below search */}
        <div className="fixed top-20 left-4 z-30">
          <BonusGift isMobile={true} />
        </div>

        {/* Side Menu - Mobile positioning - FIXED and on top with HIGHEST z-index */}
        <div className="fixed top-1/2 right-4 transform -translate-y-1/2 z-[9999] pointer-events-auto">
          <SideMenu
            video={currentVideo}
            isLiked={isLiked}
            isMuted={isMuted}
            isPlaying={isPlaying}
            onToggleLike={() => {
              console.log('Mobile like clicked via SideMenu');
              toggleLike();
            }}
            onToggleSound={() => {
              console.log('Mobile sound toggle clicked via SideMenu'); 
              setIsMuted(!isMuted);
            }}
            onTogglePlay={() => {
              console.log('Mobile play toggle clicked via SideMenu');
              setIsPlaying(!isPlaying);
            }}
            onOpenComments={async () => {
              console.log('Mobile comments clicked via SideMenu');
              await checkAndTrackAction('comment', currentVideo?.id, currentVideo?.user?.id);
              await trackComment(currentVideo?.id || '', currentVideo?.user?.id || '');
              setShowComments(true);
            }}
            onOpenProfile={async () => {
              console.log('Mobile profile clicked via SideMenu');
              await checkAndTrackAction('profile_view', currentVideo?.id, currentVideo?.user?.id);
              await trackFollow(currentVideo?.user?.id || '');
              setShowProfile(true);
            }}
            onShare={() => {
              console.log('Mobile share clicked via SideMenu');
              shareVideo();
            }}
            onOpenLive={() => {
              console.log('Mobile live clicked via SideMenu');
              setShowLive(true);
            }}
            onBlockVideo={undefined}
            onOpenPremium={() => {
              console.log('Mobile premium clicked via SideMenu');
              // TODO: Implementar nova ação para o botão premium
            }}
          />
        </div>

        {/* Vertical Carousel Container */}
        <div className="embla h-screen" ref={emblaRef}>
          <div className="embla__container h-full flex flex-col">
            {videos.map((video, index) => (
              <div key={video.id} className="embla__slide flex-shrink-0 w-full h-screen relative">
                {/* Um vídeo por modelo em sequência linear */}
                <VideoPlayer
                  ref={index === currentVideoIndex ? videoRef : null}
                  video={video}
                  isPlaying={isPlaying && index === currentVideoIndex}
                  isMuted={isMuted}
                  onNext={nextVideo}
                  onPrevious={prevVideo}
                  onDoubleClick={toggleLike}
                />


                {/* Bottom Info - only show for current video */}
                {index === currentVideoIndex && (
                  <BottomInfo video={video} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Profile Screen */}
        <ProfileScreen
          user={currentVideo.user}
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
            onVideoSelect={(videoId) => {
              openSelectedVideo(videoId);
            }}
        />

        {/* Comments Screen */}
        <CommentsScreen
          comments={comments}
          isOpen={showComments}
          onClose={() => setShowComments(false)}
          onAddComment={addComment}
        />
        
        {/* Search Modal */}
        <SearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelectModel={(modelId) => {
            goToModelVideo(modelId);
            if (checkAndTrackAction('profile_view')) {
              setShowProfile(true);
            }
          }}
        />

        {/* Live Modal */}
        <LiveModal
          isOpen={showLive}
          onClose={() => setShowLive(false)}
          onSelectModel={goToModelVideo}
        />

        {/* Action Tracker */}
        <ActionTracker 
          onActionAttempt={async (actionType, userName) => {
            return await handleActionAttempt(actionType, userName);
          }}
        />

        {/* Video Preview Modal (Premium Content) */}
        <VideoPreviewModal
          isOpen={showVideoPreview}
          onClose={() => setShowVideoPreview(false)}
          content={selectedVideoForPreview}
        />
      </div>
    );
  }

  // Desktop version (TikTok-like desktop layout)
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Desktop Header */}
      <div className="sticky top-0 z-[60] bg-black flex items-center justify-between px-6 py-4 border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (showProfile) {
                setShowProfile(false);
              } else {
                navigate('/app');
              }
            }}
            className="bg-black/50 hover:bg-black/70 text-white border border-white/20"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold">TikTok</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            Para você
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-800">
            Seguindo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(true)}
            className="text-white hover:bg-gray-800"
          >
            <Search className="h-4 w-4 mr-2" />
            Pesquisar
          </Button>
        </div>
      </div>

      {/* Bonus Gift for Desktop */}
      <BonusGift isMobile={false} />
      
      {/* Desktop Main Content */}
      <div className="flex justify-center items-start pt-6">
        <div className="flex max-w-7xl w-full">
          {/* Video Container */}
          <div className="flex-1 max-w-md mx-auto relative">
            <div className="relative bg-black rounded-lg overflow-hidden aspect-[9/16] max-h-[80vh]">
              {/* Um vídeo por modelo em sequência linear */}
              <VideoPlayer
                ref={videoRef}
                video={currentVideo}
                isPlaying={isPlaying}
                isMuted={isMuted}
                onNext={nextVideo}
                onPrevious={prevVideo}
                onDoubleClick={toggleLike}
              />


              {/* Desktop Navigation Arrows - movidos mais para dentro */}
              <div className="absolute top-1/2 left-6 transform -translate-y-1/2 z-20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevVideo}
                  disabled={currentVideoIndex === 0}
                  className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm rounded-full w-8 h-8 p-0 disabled:opacity-50"
                >
                  <ChevronUp className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="absolute top-1/2 right-6 transform -translate-y-1/2 z-20">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextVideo}
                  disabled={currentVideoIndex === videos.length - 1}
                  className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm rounded-full w-8 h-8 p-0 disabled:opacity-50"
                >
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>

              {/* Desktop Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMuted(!isMuted)}
                      className="bg-black/50 hover:bg-black/70 text-white border border-white/20 backdrop-blur-sm"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Side Menu - Posicionado conforme imagem */}
            <div className="absolute top-1/3 -right-16 transform -translate-y-1/2 flex flex-col justify-center space-y-4 z-30">{/* Subido para alinhar com altura do vídeo */}
              <SideMenu
                video={currentVideo}
                isLiked={isLiked}
                isMuted={isMuted}
                isPlaying={isPlaying}
                onToggleLike={() => {
                  console.log('Desktop like clicked');
                  toggleLike();
                }}
                onToggleSound={() => {
                  console.log('Desktop sound toggle clicked');
                  setIsMuted(!isMuted);
                }}
                onTogglePlay={() => {
                  console.log('Desktop play toggle clicked');
                  setIsPlaying(!isPlaying);
                }}
                onOpenComments={async () => {
                  console.log('Desktop comments clicked');
                  await checkAndTrackAction('comment', currentVideo?.id, currentVideo?.user?.id);
                  await trackComment(currentVideo?.id || '', currentVideo?.user?.id || '');
                  setShowComments(true);
                }}
                onOpenProfile={async () => {
                  console.log('Desktop profile clicked');
                  await checkAndTrackAction('profile_view', currentVideo?.id, currentVideo?.user?.id);
                  await trackFollow(currentVideo?.user?.id || '');
                  setShowProfile(true);
                }}
                onShare={() => {
                  console.log('Desktop share clicked');
                  shareVideo();
                }}
                onOpenLive={() => {
                  console.log('Desktop live clicked');
                  setShowLive(true);
                }}
                onBlockVideo={undefined}
                onOpenPremium={() => {
                  console.log('Desktop premium clicked');
                  // TODO: Implementar nova ação para o botão premium
                }}
              />
            </div>

            {/* Desktop Video Info Below */}
            <div className="mt-4 px-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <img
                      src={currentVideo.user.avatar_url || '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png'}
                      alt={currentVideo.user.username}
                      className="w-10 h-10 rounded-full object-cover cursor-pointer"
                      onClick={() => {
                        if (checkAndTrackAction('profile_view')) {
                          trackFollow(currentVideo.user.id);
                          setShowProfile(true);
                        }
                      }}
                    />
                    <div>
                      <p className="font-semibold text-white">{currentVideo.user.username}</p>
                      <p className="text-gray-400 text-sm">{currentVideo.user.followers_count} seguidores</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                       onClick={() => {
                         const currentIsFollowing = followingModels[currentVideo?.user?.id] || false;
                         console.log('🔥 BOTÃO SEGUIR CLICADO!', {
                           currentVideo: currentVideo?.user?.username,
                           currentIsFollowing,
                           modelId: currentVideo?.user?.id
                         });
                         followModel();
                       }}
                       disabled={followingModels[currentVideo?.user?.id] || false}
                       className={(followingModels[currentVideo?.user?.id] || false)
                         ? "border-green-500 text-green-500 bg-green-500/10" 
                         : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                       }
                     >
                        {(followingModels[currentVideo?.user?.id] || false) ? 'Seguindo' : 'Seguir'}
                     </Button>
                  </div>
                  
                  {/* Desktop Action Buttons - Funcionais */}
                  <div className="flex items-center space-x-4 mt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleLike}
                      className={`text-sm transition-all duration-200 ${isLiked ? 'text-red-500 scale-110' : 'text-white hover:text-red-400'}`}
                    >
                      <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current animate-pulse' : ''}`} />
                      {currentVideo.likes_count}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        await checkAndTrackAction('comment', currentVideo?.id, currentVideo?.user?.id);
                        await trackComment(currentVideo?.id || '', currentVideo?.user?.id || '');
                        setShowComments(true);
                      }}
                      className="text-white hover:text-blue-400 text-sm transition-colors"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {currentVideo.comments_count}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={shareVideo}
                      className="text-white hover:text-yellow-400 text-sm transition-colors"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      {currentVideo.shares_count}
                    </Button>
                  </div>
                  
                   <h3 className="text-lg font-medium text-white mb-1 mt-4">{currentVideo.title}</h3>
                   <p className="text-gray-300 text-sm leading-relaxed mb-3">{currentVideo.description}</p>
                   
                   <div className="flex items-center space-x-2">
                     <p className="text-gray-400 text-sm">♪ {currentVideo.music_name}</p>
                     {currentVideo.music_name && currentVideo.music_name !== 'Som Original' && (
                       <span className="text-gray-500 text-xs">🎵</span>
                     )}
                     
                     {/* Vinyl Record for music */}
                     {currentVideo.music_name && currentVideo.music_name !== 'Som Original' && (
                       <VinylRecord 
                         isPlaying={isPlaying && !isMuted}
                         hasMusic={true}
                       />
                     )}
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>

      {/* Desktop Profile Screen */}
      <ProfileScreen
        user={{
          id: currentVideo.user.id,
          username: currentVideo.user.username,
          avatar_url: currentVideo.user.avatar_url || '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png',
          followers_count: currentVideo.user.followers_count || 0,
          following_count: currentVideo.user.following_count || 0,
          is_online: currentVideo.user.is_online || false,
          created_at: currentVideo.user.created_at || new Date().toISOString()
        }}
        onVideoSelect={(videoId) => {
          openSelectedVideo(videoId);
        }}
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

      {/* Desktop Comments Screen */}
      <CommentsScreen
        comments={comments}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        onAddComment={addComment}
      />

      {/* Desktop Search Modal */}
      <SearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onSelectModel={goToModelVideo}
      />

      {/* Desktop Live Modal */}
      <LiveModal
        isOpen={showLive}
        onClose={() => setShowLive(false)}
        onSelectModel={goToModelVideo}
      />

      {/* Premium Modal */}
      <PremiumModal
        isOpen={showPremium}
        onClose={() => setShowPremium(false)}
      />
      
      {/* Desktop Action Tracker */}
      <ActionTracker 
        onActionAttempt={async (actionType, userName) => {
          return await handleActionAttempt(actionType, userName);
        }}
      />

      {/* Video Preview Modal (Premium Content) */}
      <VideoPreviewModal
        isOpen={showVideoPreview}
        onClose={() => setShowVideoPreview(false)}
        content={selectedVideoForPreview}
      />
    </div>
  );
};