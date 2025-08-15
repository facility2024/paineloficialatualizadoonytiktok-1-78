import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

interface ShareVideoData {
  videoId: string;
  modelId: string;
  videoTitle: string;
  modelName: string;
}

export const useNativeShare = () => {
  // Detectar se o navegador suporta Web Share API
  const isNativeShareSupported = useCallback(() => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }, []);

  // Registrar compartilhamento no banco
  const registerShare = useCallback(async (
    videoId: string,
    modelId: string,
    platform: string,
    shareMethod: string,
    success: boolean,
    errorMessage?: string
  ) => {
    try {
      const currentUserId = localStorage.getItem('session_user_id') || (() => {
        const newId = crypto.randomUUID();
        localStorage.setItem('session_user_id', newId);
        return newId;
      })();

      const sessionId = localStorage.getItem('session_id') || currentUserId;

      const shareData = {
        user_id: currentUserId,
        session_id: sessionId,
        video_id: videoId,
        model_id: modelId,
        platform,
        share_method: shareMethod,
        shared_url: `${window.location.origin}/video/${videoId}`,
        success,
        error_message: errorMessage || null,
        device_type: /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        user_agent: navigator.userAgent,
        ip_address: null // Será preenchido pelo backend
      };

      const { error } = await supabase
        .from('video_shares')
        .insert(shareData);

      if (error) {
        console.warn('❌ Erro ao registrar compartilhamento:', error);
      } else {
        console.log('✅ Compartilhamento registrado com sucesso');
      }

      // Atualizar contador de shares do vídeo
      const { data: currentVideo, error: fetchError } = await supabase
        .from('videos')
        .select('shares_count')
        .eq('id', videoId)
        .single();

      if (!fetchError && currentVideo) {
        const { error: updateError } = await supabase
          .from('videos')
          .update({ 
            shares_count: (currentVideo.shares_count || 0) + 1
          })
          .eq('id', videoId);

        if (updateError) {
          console.warn('❌ Erro ao atualizar contador de shares:', updateError);
        }
      }

    } catch (error) {
      console.error('❌ Erro ao registrar compartilhamento:', error);
    }
  }, []);

  // Compartilhamento nativo usando Web Share API
  const shareNative = useCallback(async ({ title, text, url }: ShareData, videoData: ShareVideoData) => {
    if (!isNativeShareSupported()) {
      throw new Error('Web Share API não suportada');
    }

    try {
      await navigator.share({
        title,
        text,
        url
      });

      // Registrar compartilhamento bem-sucedido
      await registerShare(
        videoData.videoId,
        videoData.modelId,
        'native',
        'web_share_api',
        true
      );

      toast.success('Vídeo compartilhado com sucesso!');
      return true;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Usuário cancelou o compartilhamento
        console.log('Compartilhamento cancelado pelo usuário');
        
        await registerShare(
          videoData.videoId,
          videoData.modelId,
          'native',
          'web_share_api',
          false,
          'Cancelado pelo usuário'
        );
        
        return false;
      } else {
        // Erro real
        console.error('Erro no compartilhamento nativo:', error);
        
        await registerShare(
          videoData.videoId,
          videoData.modelId,
          'native',
          'web_share_api',
          false,
          error.message
        );
        
        throw error;
      }
    }
  }, [isNativeShareSupported, registerShare]);

  // Compartilhamento fallback (copiar link)
  const shareFallback = useCallback(async (url: string, videoData: ShareVideoData) => {
    try {
      await navigator.clipboard.writeText(url);
      
      // Registrar compartilhamento via clipboard
      await registerShare(
        videoData.videoId,
        videoData.modelId,
        'clipboard',
        'copy_link',
        true
      );

      toast.success('Link copiado para a área de transferência!');
      return true;
    } catch (error: any) {
      console.error('Erro ao copiar link:', error);
      
      await registerShare(
        videoData.videoId,
        videoData.modelId,
        'clipboard',
        'copy_link',
        false,
        error.message
      );
      
      toast.error('Erro ao copiar link');
      return false;
    }
  }, [registerShare]);

  // Função principal de compartilhamento
  const shareVideo = useCallback(async (videoData: ShareVideoData) => {
    const shareUrl = `${window.location.origin}/video/${videoData.videoId}`;
    const shareData = {
      title: `${videoData.modelName} - ${videoData.videoTitle}`,
      text: `Confira este vídeo incrível de ${videoData.modelName}!`,
      url: shareUrl
    };

    // Tentar compartilhamento nativo primeiro
    if (isNativeShareSupported()) {
      try {
        return await shareNative(shareData, videoData);
      } catch (error) {
        console.log('Fallback para cópia de link...');
        // Se falhar, usar fallback
        return await shareFallback(shareUrl, videoData);
      }
    } else {
      // Se não suportar Web Share API, usar fallback
      return await shareFallback(shareUrl, videoData);
    }
  }, [isNativeShareSupported, shareNative, shareFallback]);

  return {
    shareVideo,
    isNativeShareSupported: isNativeShareSupported()
  };
};