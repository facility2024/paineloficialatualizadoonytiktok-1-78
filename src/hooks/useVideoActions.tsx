import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAnalytics } from './useAnalytics';

export const useVideoActions = () => {
  const [loading, setLoading] = useState(false);
  const { trackVideoAction } = useAnalytics();

  const toggleLike = useCallback(async (
    videoId: string, 
    modelId: string, 
    userId: string,
    isCurrentlyLiked: boolean
  ) => {
    try {
      setLoading(true);

      if (isCurrentlyLiked) {
        // Remove like
        const { error } = await supabase
          .from('likes')
          .delete()
          .eq('video_id', videoId)
          .eq('user_id', userId);

        if (error) throw error;
        
        await trackVideoAction('like', videoId, modelId, userId, { action: 'unlike' });
        toast.success('Like removido!');
      } else {
        // Add like
        const { error } = await supabase
          .from('likes')
          .insert([{
            video_id: videoId,
            model_id: modelId,
            user_id: userId,
            ip_address: null,
            user_agent: navigator.userAgent
          }]);

        if (error) throw error;
        
        await trackVideoAction('like', videoId, modelId, userId, { action: 'like' });
        toast.success('Vídeo curtido!');
      }

      return !isCurrentlyLiked;
    } catch (error) {
      console.error('Erro ao curtir vídeo:', error);
      toast.error('Erro ao curtir vídeo');
      return isCurrentlyLiked;
    } finally {
      setLoading(false);
    }
  }, [trackVideoAction]);

  const addComment = useCallback(async (
    videoId: string,
    modelId: string,
    userId: string,
    content: string
  ) => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('comments')
        .insert([{
          video_id: videoId,
          model_id: modelId,
          user_id: userId,
          content: content,
          ip_address: null,
          user_agent: navigator.userAgent
        }])
        .select()
        .single();

      if (error) throw error;

      await trackVideoAction('comment', videoId, modelId, userId, { 
        comment_length: content.length 
      });
      
      toast.success('Comentário adicionado!');
      return data;
    } catch (error) {
      console.error('Erro ao comentar:', error);
      toast.error('Erro ao adicionar comentário');
      return null;
    } finally {
      setLoading(false);
    }
  }, [trackVideoAction]);

  const shareVideo = useCallback(async (
    videoId: string,
    modelId: string,
    userId: string,
    platform?: string
  ) => {
    try {
      setLoading(true);

      // Register share in video_shares table
      const { error } = await supabase
        .from('video_shares')
        .insert([{
          video_id: videoId,
          model_id: modelId,
          user_id: userId,
          platform: platform || 'web',
          share_method: 'manual',
          shared_url: `${window.location.origin}/video/${videoId}`,
          success: true,
          user_agent: navigator.userAgent
        }]);

      if (error) {
        console.warn('Error registering share:', error);
      }

      await trackVideoAction('share', videoId, modelId, userId, { 
        platform: platform || 'web' 
      });

      toast.success('Vídeo compartilhado!');
      
      // Copy link to clipboard
      const videoUrl = `${window.location.origin}/video/${videoId}`;
      await navigator.clipboard.writeText(videoUrl);
      toast.success('Link copiado para a área de transferência!');
      
      return true;
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      toast.error('Erro ao compartilhar vídeo');
      return false;
    } finally {
      setLoading(false);
    }
  }, [trackVideoAction]);

  const viewVideo = useCallback(async (
    videoId: string,
    modelId: string,
    userId?: string
  ) => {
    try {
      await trackVideoAction('view', videoId, modelId, userId, {
        timestamp: new Date().toISOString(),
        viewport: `${window.innerWidth}x${window.innerHeight}`
      });
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  }, [trackVideoAction]);

  return {
    toggleLike,
    addComment,
    shareVideo,
    viewVideo,
    loading
  };
};