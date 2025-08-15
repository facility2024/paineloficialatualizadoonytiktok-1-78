export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agendamento_execucoes: {
        Row: {
          created_at: string
          data_execucao: string
          erro_mensagem: string | null
          id: string
          post_agendado_id: string
          status_execucao: string
          tentativas: number
        }
        Insert: {
          created_at?: string
          data_execucao?: string
          erro_mensagem?: string | null
          id?: string
          post_agendado_id: string
          status_execucao?: string
          tentativas?: number
        }
        Update: {
          created_at?: string
          data_execucao?: string
          erro_mensagem?: string | null
          id?: string
          post_agendado_id?: string
          status_execucao?: string
          tentativas?: number
        }
        Relationships: [
          {
            foreignKeyName: "agendamento_execucoes_post_agendado_id_fkey"
            columns: ["post_agendado_id"]
            isOneToOne: false
            referencedRelation: "posts_agendados"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          browser_name: string | null
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          event_category: string | null
          event_data: Json | null
          event_name: string
          id: string
          ip_address: string | null
          model_id: string | null
          os_name: string | null
          page_url: string | null
          referrer_url: string | null
          region: string | null
          screen_resolution: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          browser_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_name: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          os_name?: string | null
          page_url?: string | null
          referrer_url?: string | null
          region?: string | null
          screen_resolution?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          browser_name?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          event_category?: string | null
          event_data?: Json | null
          event_name?: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          os_name?: string | null
          page_url?: string | null
          referrer_url?: string | null
          region?: string | null
          screen_resolution?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      app_statistics: {
        Row: {
          additional_data: Json | null
          created_at: string | null
          date_recorded: string | null
          id: string
          metric_name: string
          metric_type: string
          metric_value: string
        }
        Insert: {
          additional_data?: Json | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          metric_name: string
          metric_type: string
          metric_value: string
        }
        Update: {
          additional_data?: Json | null
          created_at?: string | null
          date_recorded?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
          metric_value?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      bonus_user_actions: {
        Row: {
          action_type: string
          bonus_user_id: string | null
          created_at: string | null
          id: string
          model_id: string | null
          points_earned: number | null
          video_id: string | null
        }
        Insert: {
          action_type: string
          bonus_user_id?: string | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          points_earned?: number | null
          video_id?: string | null
        }
        Update: {
          action_type?: string
          bonus_user_id?: string | null
          created_at?: string | null
          id?: string
          model_id?: string | null
          points_earned?: number | null
          video_id?: string | null
        }
        Relationships: []
      }
      bonus_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_verified: boolean | null
          location: string | null
          name: string
          points: number | null
          status: string | null
          total_spent: number | null
          updated_at: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_verified?: boolean | null
          location?: string | null
          name: string
          points?: number | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_verified?: boolean | null
          location?: string | null
          name?: string
          points?: number | null
          status?: string | null
          total_spent?: number | null
          updated_at?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      campaign_participations: {
        Row: {
          campaign_id: string | null
          completion_date: string | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          participation_data: Json | null
          points_earned: number | null
          user_id: string | null
        }
        Insert: {
          campaign_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          participation_data?: Json | null
          points_earned?: number | null
          user_id?: string | null
        }
        Update: {
          campaign_id?: string | null
          completion_date?: string | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          participation_data?: Json | null
          points_earned?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_participations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          bonus_multiplier: number | null
          bonus_points: number | null
          campaign_type: string | null
          created_at: string | null
          current_participants: number | null
          description: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          is_automatic: boolean | null
          max_participants: number | null
          max_uses_per_user: number | null
          name: string
          notification_config: Json | null
          popup_config: Json | null
          starts_at: string | null
          target_audience: Json | null
          total_conversions: number | null
          total_points_awarded: number | null
          updated_at: string | null
        }
        Insert: {
          bonus_multiplier?: number | null
          bonus_points?: number | null
          campaign_type?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          is_automatic?: boolean | null
          max_participants?: number | null
          max_uses_per_user?: number | null
          name: string
          notification_config?: Json | null
          popup_config?: Json | null
          starts_at?: string | null
          target_audience?: Json | null
          total_conversions?: number | null
          total_points_awarded?: number | null
          updated_at?: string | null
        }
        Update: {
          bonus_multiplier?: number | null
          bonus_points?: number | null
          campaign_type?: string | null
          created_at?: string | null
          current_participants?: number | null
          description?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          is_automatic?: boolean | null
          max_participants?: number | null
          max_uses_per_user?: number | null
          name?: string
          notification_config?: Json | null
          popup_config?: Json | null
          starts_at?: string | null
          target_audience?: Json | null
          total_conversions?: number | null
          total_points_awarded?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      checkins_locais: {
        Row: {
          atividades_realizadas: string[] | null
          automatico: boolean | null
          avaliacao_local: number | null
          categoria_local: string | null
          comentario_checkin: string | null
          companhias: string[] | null
          compartilhado: boolean | null
          data_checkin: string | null
          data_checkout: string | null
          duracao_permanencia: number | null
          endereco: string | null
          fotos_checkin: string[] | null
          gastos_estimados: number | null
          humor_usuario: string | null
          id: string
          latitude: number | null
          local_id: string | null
          longitude: number | null
          nome_local: string | null
          tags_checkin: string[] | null
          usuario_id: string | null
          visibilidade: string | null
        }
        Insert: {
          atividades_realizadas?: string[] | null
          automatico?: boolean | null
          avaliacao_local?: number | null
          categoria_local?: string | null
          comentario_checkin?: string | null
          companhias?: string[] | null
          compartilhado?: boolean | null
          data_checkin?: string | null
          data_checkout?: string | null
          duracao_permanencia?: number | null
          endereco?: string | null
          fotos_checkin?: string[] | null
          gastos_estimados?: number | null
          humor_usuario?: string | null
          id?: string
          latitude?: number | null
          local_id?: string | null
          longitude?: number | null
          nome_local?: string | null
          tags_checkin?: string[] | null
          usuario_id?: string | null
          visibilidade?: string | null
        }
        Update: {
          atividades_realizadas?: string[] | null
          automatico?: boolean | null
          avaliacao_local?: number | null
          categoria_local?: string | null
          comentario_checkin?: string | null
          companhias?: string[] | null
          compartilhado?: boolean | null
          data_checkin?: string | null
          data_checkout?: string | null
          duracao_permanencia?: number | null
          endereco?: string | null
          fotos_checkin?: string[] | null
          gastos_estimados?: number | null
          humor_usuario?: string | null
          id?: string
          latitude?: number | null
          local_id?: string | null
          longitude?: number | null
          nome_local?: string | null
          tags_checkin?: string[] | null
          usuario_id?: string | null
          visibilidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkins_locais_local_id_fkey"
            columns: ["local_id"]
            isOneToOne: false
            referencedRelation: "locais_favoritos"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios_evento_vivo: {
        Row: {
          comentario_texto: string
          curtidas: number | null
          data_criacao: string | null
          evento_id: string | null
          id: string
          moderado: boolean | null
          reportado: boolean | null
          resposta_para: string | null
          timestamp_video: number | null
          tipo_comentario: string | null
          usuario_id: string | null
          visivel: boolean | null
        }
        Insert: {
          comentario_texto: string
          curtidas?: number | null
          data_criacao?: string | null
          evento_id?: string | null
          id?: string
          moderado?: boolean | null
          reportado?: boolean | null
          resposta_para?: string | null
          timestamp_video?: number | null
          tipo_comentario?: string | null
          usuario_id?: string | null
          visivel?: boolean | null
        }
        Update: {
          comentario_texto?: string
          curtidas?: number | null
          data_criacao?: string | null
          evento_id?: string | null
          id?: string
          moderado?: boolean | null
          reportado?: boolean | null
          resposta_para?: string | null
          timestamp_video?: number | null
          tipo_comentario?: string | null
          usuario_id?: string | null
          visivel?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_evento_vivo_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_ao_vivo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_evento_vivo_resposta_para_fkey"
            columns: ["resposta_para"]
            isOneToOne: false
            referencedRelation: "comentarios_evento_vivo"
            referencedColumns: ["id"]
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          is_approved: boolean | null
          is_edited: boolean | null
          is_pinned: boolean | null
          is_reported: boolean | null
          likes_count: number | null
          model_id: string | null
          moderation_status: string | null
          parent_comment_id: string | null
          replies_count: number | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          model_id?: string | null
          moderation_status?: string | null
          parent_comment_id?: string | null
          replies_count?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          is_approved?: boolean | null
          is_edited?: boolean | null
          is_pinned?: boolean | null
          is_reported?: boolean | null
          likes_count?: number | null
          model_id?: string | null
          moderation_status?: string | null
          parent_comment_id?: string | null
          replies_count?: number | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      compartilhamentos: {
        Row: {
          cliques_compartilhamento: number | null
          comentario_id: string | null
          configuracoes_privacidade: Json | null
          conteudo_id: string | null
          conversoes_compartilhamento: number | null
          data_criacao: string | null
          data_expiracao: string | null
          evento_id: string | null
          id: string
          mensagem_personalizada: string | null
          metodo_compartilhamento: string | null
          plataforma_destino: string
          tipo_conteudo: string
          usuario_id: string | null
          visualizacoes_compartilhamento: number | null
        }
        Insert: {
          cliques_compartilhamento?: number | null
          comentario_id?: string | null
          configuracoes_privacidade?: Json | null
          conteudo_id?: string | null
          conversoes_compartilhamento?: number | null
          data_criacao?: string | null
          data_expiracao?: string | null
          evento_id?: string | null
          id?: string
          mensagem_personalizada?: string | null
          metodo_compartilhamento?: string | null
          plataforma_destino: string
          tipo_conteudo: string
          usuario_id?: string | null
          visualizacoes_compartilhamento?: number | null
        }
        Update: {
          cliques_compartilhamento?: number | null
          comentario_id?: string | null
          configuracoes_privacidade?: Json | null
          conteudo_id?: string | null
          conversoes_compartilhamento?: number | null
          data_criacao?: string | null
          data_expiracao?: string | null
          evento_id?: string | null
          id?: string
          mensagem_personalizada?: string | null
          metodo_compartilhamento?: string | null
          plataforma_destino?: string
          tipo_conteudo?: string
          usuario_id?: string | null
          visualizacoes_compartilhamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compartilhamentos_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_ao_vivo"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes_localizacao: {
        Row: {
          alertas_mudanca_local: boolean | null
          atualizacao_automatica: boolean | null
          backup_localizacoes: boolean | null
          compartilhar_com_amigos: boolean | null
          compartilhar_em_eventos: boolean | null
          data_atualizacao: string | null
          data_criacao: string | null
          detectar_locais_favoritos: boolean | null
          frequencia_atualizacao: number | null
          id: string
          localizacao_ativada: boolean | null
          modo_privado: boolean | null
          mostrar_cidade_perfil: boolean | null
          precisao_preferida: string | null
          salvar_historico: boolean | null
          sincronizar_dispositivos: boolean | null
          tempo_retencao_historico: number | null
          usuario_id: string | null
        }
        Insert: {
          alertas_mudanca_local?: boolean | null
          atualizacao_automatica?: boolean | null
          backup_localizacoes?: boolean | null
          compartilhar_com_amigos?: boolean | null
          compartilhar_em_eventos?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          detectar_locais_favoritos?: boolean | null
          frequencia_atualizacao?: number | null
          id?: string
          localizacao_ativada?: boolean | null
          modo_privado?: boolean | null
          mostrar_cidade_perfil?: boolean | null
          precisao_preferida?: string | null
          salvar_historico?: boolean | null
          sincronizar_dispositivos?: boolean | null
          tempo_retencao_historico?: number | null
          usuario_id?: string | null
        }
        Update: {
          alertas_mudanca_local?: boolean | null
          atualizacao_automatica?: boolean | null
          backup_localizacoes?: boolean | null
          compartilhar_com_amigos?: boolean | null
          compartilhar_em_eventos?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          detectar_locais_favoritos?: boolean | null
          frequencia_atualizacao?: number | null
          id?: string
          localizacao_ativada?: boolean | null
          modo_privado?: boolean | null
          mostrar_cidade_perfil?: boolean | null
          precisao_preferida?: string | null
          salvar_historico?: boolean | null
          sincronizar_dispositivos?: boolean | null
          tempo_retencao_historico?: number | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      configuracoes_usuario: {
        Row: {
          autenticacao_dois_fatores: boolean | null
          data_atualizacao: string | null
          data_criacao: string | null
          fuso_horario: string | null
          id: string
          idioma: string | null
          notificacoes_ativadas: boolean | null
          notificacoes_email: boolean | null
          notificacoes_push: boolean | null
          tema: string | null
          usuario_id: string | null
        }
        Insert: {
          autenticacao_dois_fatores?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          notificacoes_ativadas?: boolean | null
          notificacoes_email?: boolean | null
          notificacoes_push?: boolean | null
          tema?: string | null
          usuario_id?: string | null
        }
        Update: {
          autenticacao_dois_fatores?: boolean | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          fuso_horario?: string | null
          id?: string
          idioma?: string | null
          notificacoes_ativadas?: boolean | null
          notificacoes_email?: boolean | null
          notificacoes_push?: boolean | null
          tema?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      conteudo_paginas: {
        Row: {
          arquivos_urls: string[] | null
          categoria: string | null
          curtidas: number | null
          data_atualizacao: string | null
          data_publicacao: string | null
          id: string
          imagens_urls: string[] | null
          pagina_id: string | null
          status_conteudo: string | null
          tags: string[] | null
          texto_conteudo: string | null
          titulo_conteudo: string | null
          usuario_id: string | null
          videos_urls: string[] | null
        }
        Insert: {
          arquivos_urls?: string[] | null
          categoria?: string | null
          curtidas?: number | null
          data_atualizacao?: string | null
          data_publicacao?: string | null
          id?: string
          imagens_urls?: string[] | null
          pagina_id?: string | null
          status_conteudo?: string | null
          tags?: string[] | null
          texto_conteudo?: string | null
          titulo_conteudo?: string | null
          usuario_id?: string | null
          videos_urls?: string[] | null
        }
        Update: {
          arquivos_urls?: string[] | null
          categoria?: string | null
          curtidas?: number | null
          data_atualizacao?: string | null
          data_publicacao?: string | null
          id?: string
          imagens_urls?: string[] | null
          pagina_id?: string | null
          status_conteudo?: string | null
          tags?: string[] | null
          texto_conteudo?: string | null
          titulo_conteudo?: string | null
          usuario_id?: string | null
          videos_urls?: string[] | null
        }
        Relationships: []
      }
      curtidas_reacoes: {
        Row: {
          comentario_id: string | null
          conteudo_id: string | null
          data_criacao: string | null
          id: string
          tipo_reacao: string | null
          usuario_id: string | null
        }
        Insert: {
          comentario_id?: string | null
          conteudo_id?: string | null
          data_criacao?: string | null
          id?: string
          tipo_reacao?: string | null
          usuario_id?: string | null
        }
        Update: {
          comentario_id?: string | null
          conteudo_id?: string | null
          data_criacao?: string | null
          id?: string
          tipo_reacao?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      daily_actions: {
        Row: {
          action_date: string | null
          action_type: string
          comment_id: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          is_completed: boolean | null
          model_id: string | null
          points_earned: number | null
          share_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          action_date?: string | null
          action_type: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_completed?: boolean | null
          model_id?: string | null
          points_earned?: number | null
          share_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          action_date?: string | null
          action_type?: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_completed?: boolean | null
          model_id?: string | null
          points_earned?: number | null
          share_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_actions_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_actions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_actions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "daily_actions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_missions: {
        Row: {
          action_type: string
          category: string | null
          created_at: string
          description: string | null
          difficulty: string
          icon: string | null
          id: string
          is_active: boolean
          max_completions_per_day: number | null
          points_reward: number
          priority: number
          requirements: Json | null
          reward_description: string | null
          target_count: number
          time_limit_hours: number | null
          title: string
          updated_at: string
        }
        Insert: {
          action_type: string
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          max_completions_per_day?: number | null
          points_reward?: number
          priority?: number
          requirements?: Json | null
          reward_description?: string | null
          target_count?: number
          time_limit_hours?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          action_type?: string
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty?: string
          icon?: string | null
          id?: string
          is_active?: boolean
          max_completions_per_day?: number | null
          points_reward?: number
          priority?: number
          requirements?: Json | null
          reward_description?: string | null
          target_count?: number
          time_limit_hours?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          completed_tasks: number | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_action_at: string | null
          points_earned_today: number | null
          reset_at: string | null
          task_date: string | null
          total_actions: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_action_at?: string | null
          points_earned_today?: number | null
          reset_at?: string | null
          task_date?: string | null
          total_actions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_action_at?: string | null
          points_earned_today?: number | null
          reset_at?: string | null
          task_date?: string | null
          total_actions?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      deteccao_movimento: {
        Row: {
          calorias_estimadas: number | null
          condicoes_clima: string | null
          confianca_deteccao: number | null
          dados_sensores: Json | null
          data_fim: string | null
          data_inicio: string | null
          data_registro: string | null
          distancia_percorrida: number | null
          duracao_movimento: number | null
          id: string
          local_destino: string | null
          local_inicio: string | null
          modo_transporte_detectado: string | null
          passos_estimados: number | null
          qualidade_gps: string | null
          rota_percorrida: Json | null
          tipo_movimento: string
          usuario_id: string | null
          velocidade_media: number | null
        }
        Insert: {
          calorias_estimadas?: number | null
          condicoes_clima?: string | null
          confianca_deteccao?: number | null
          dados_sensores?: Json | null
          data_fim?: string | null
          data_inicio?: string | null
          data_registro?: string | null
          distancia_percorrida?: number | null
          duracao_movimento?: number | null
          id?: string
          local_destino?: string | null
          local_inicio?: string | null
          modo_transporte_detectado?: string | null
          passos_estimados?: number | null
          qualidade_gps?: string | null
          rota_percorrida?: Json | null
          tipo_movimento: string
          usuario_id?: string | null
          velocidade_media?: number | null
        }
        Update: {
          calorias_estimadas?: number | null
          condicoes_clima?: string | null
          confianca_deteccao?: number | null
          dados_sensores?: Json | null
          data_fim?: string | null
          data_inicio?: string | null
          data_registro?: string | null
          distancia_percorrida?: number | null
          duracao_movimento?: number | null
          id?: string
          local_destino?: string | null
          local_inicio?: string | null
          modo_transporte_detectado?: string | null
          passos_estimados?: number | null
          qualidade_gps?: string | null
          rota_percorrida?: Json | null
          tipo_movimento?: string
          usuario_id?: string | null
          velocidade_media?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          body: string | null
          created_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          provider: string
          recipient_email: string
          sent_at: string | null
          status: string
          subject: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          provider: string
          recipient_email: string
          sent_at?: string | null
          status?: string
          subject: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          provider?: string
          recipient_email?: string
          sent_at?: string | null
          status?: string
          subject?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos_analytics: {
        Row: {
          id: string
          nome_evento: string | null
          propriedades_evento: Json | null
          tempo_evento: string | null
          tipo_evento: string | null
          usuario_id: string | null
        }
        Insert: {
          id?: string
          nome_evento?: string | null
          propriedades_evento?: Json | null
          tempo_evento?: string | null
          tipo_evento?: string | null
          usuario_id?: string | null
        }
        Update: {
          id?: string
          nome_evento?: string | null
          propriedades_evento?: Json | null
          tempo_evento?: string | null
          tipo_evento?: string | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      eventos_ao_vivo: {
        Row: {
          capacidade_maxima: number | null
          categoria_evento: string | null
          chat_ativado: boolean | null
          configuracoes_stream: Json | null
          criador_id: string | null
          curtidas_evento: number | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao_evento: string | null
          duracao_prevista: number | null
          gravacao_ativada: boolean | null
          id: string
          imagem_capa: string | null
          moderadores_evento: string[] | null
          participantes_atuais: number | null
          preco_acesso: number | null
          status_evento: string | null
          tags_evento: string[] | null
          tipo_evento: string | null
          titulo_evento: string
          url_gravacao: string | null
          url_stream: string | null
          visualizacoes_totais: number | null
        }
        Insert: {
          capacidade_maxima?: number | null
          categoria_evento?: string | null
          chat_ativado?: boolean | null
          configuracoes_stream?: Json | null
          criador_id?: string | null
          curtidas_evento?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao_evento?: string | null
          duracao_prevista?: number | null
          gravacao_ativada?: boolean | null
          id?: string
          imagem_capa?: string | null
          moderadores_evento?: string[] | null
          participantes_atuais?: number | null
          preco_acesso?: number | null
          status_evento?: string | null
          tags_evento?: string[] | null
          tipo_evento?: string | null
          titulo_evento: string
          url_gravacao?: string | null
          url_stream?: string | null
          visualizacoes_totais?: number | null
        }
        Update: {
          capacidade_maxima?: number | null
          categoria_evento?: string | null
          chat_ativado?: boolean | null
          configuracoes_stream?: Json | null
          criador_id?: string | null
          curtidas_evento?: number | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao_evento?: string | null
          duracao_prevista?: number | null
          gravacao_ativada?: boolean | null
          id?: string
          imagem_capa?: string | null
          moderadores_evento?: string[] | null
          participantes_atuais?: number | null
          preco_acesso?: number | null
          status_evento?: string | null
          tags_evento?: string[] | null
          tipo_evento?: string | null
          titulo_evento?: string
          url_gravacao?: string | null
          url_stream?: string | null
          visualizacoes_totais?: number | null
        }
        Relationships: []
      }
      gamification_actions: {
        Row: {
          action_type: string
          created_at: string | null
          date_performed: string | null
          id: string
          ip_address: string | null
          model_id: string | null
          points_earned: number | null
          user_agent: string | null
          user_id: string
          video_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          date_performed?: string | null
          id?: string
          ip_address?: string | null
          model_id?: string | null
          points_earned?: number | null
          user_agent?: string | null
          user_id: string
          video_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          date_performed?: string | null
          id?: string
          ip_address?: string | null
          model_id?: string | null
          points_earned?: number | null
          user_agent?: string | null
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gamification_actions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gamification_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_daily_tasks: {
        Row: {
          completed_tasks: number | null
          created_at: string | null
          id: string
          is_completed: boolean | null
          last_action_at: string | null
          points_earned_today: number | null
          reset_at: string | null
          task_date: string | null
          total_actions: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_action_at?: string | null
          points_earned_today?: number | null
          reset_at?: string | null
          task_date?: string | null
          total_actions?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_tasks?: number | null
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_action_at?: string | null
          points_earned_today?: number | null
          reset_at?: string | null
          task_date?: string | null
          total_actions?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_daily_tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "gamification_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_rankings: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_at: string | null
          level_name: string | null
          max_streak: number | null
          position: number | null
          total_points: number | null
          total_tasks_completed: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_at?: string | null
          level_name?: string | null
          max_streak?: number | null
          position?: number | null
          total_points?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_at?: string | null
          level_name?: string | null
          max_streak?: number | null
          position?: number | null
          total_points?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gamification_rankings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "gamification_users"
            referencedColumns: ["id"]
          },
        ]
      }
      gamification_users: {
        Row: {
          created_at: string | null
          current_streak: number | null
          email: string
          id: string
          is_premium: boolean | null
          level_name: string | null
          max_streak: number | null
          name: string
          registered_from: string | null
          status: string | null
          total_points: number | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          email: string
          id?: string
          is_premium?: boolean | null
          level_name?: string | null
          max_streak?: number | null
          name: string
          registered_from?: string | null
          status?: string | null
          total_points?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          email?: string
          id?: string
          is_premium?: boolean | null
          level_name?: string | null
          max_streak?: number | null
          name?: string
          registered_from?: string | null
          status?: string | null
          total_points?: number | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      historico_localizacoes: {
        Row: {
          altitude: number | null
          atividade_detectada: string | null
          bateria_dispositivo: number | null
          cidade: string | null
          conectividade_qualidade: string | null
          contexto_uso: string | null
          data_registro: string | null
          distancia_anterior: number | null
          endereco_obtido: string | null
          estado: string | null
          id: string
          latitude: number | null
          longitude: number | null
          pais: string | null
          precisao: number | null
          sessao_id: string | null
          tempo_permanencia: number | null
          tipo_movimento: string | null
          usuario_id: string | null
          velocidade_detectada: number | null
        }
        Insert: {
          altitude?: number | null
          atividade_detectada?: string | null
          bateria_dispositivo?: number | null
          cidade?: string | null
          conectividade_qualidade?: string | null
          contexto_uso?: string | null
          data_registro?: string | null
          distancia_anterior?: number | null
          endereco_obtido?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pais?: string | null
          precisao?: number | null
          sessao_id?: string | null
          tempo_permanencia?: number | null
          tipo_movimento?: string | null
          usuario_id?: string | null
          velocidade_detectada?: number | null
        }
        Update: {
          altitude?: number | null
          atividade_detectada?: string | null
          bateria_dispositivo?: number | null
          cidade?: string | null
          conectividade_qualidade?: string | null
          contexto_uso?: string | null
          data_registro?: string | null
          distancia_anterior?: number | null
          endereco_obtido?: string | null
          estado?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          pais?: string | null
          precisao?: number | null
          sessao_id?: string | null
          tempo_permanencia?: number | null
          tipo_movimento?: string | null
          usuario_id?: string | null
          velocidade_detectada?: number | null
        }
        Relationships: []
      }
      integrations: {
        Row: {
          configuration: Json
          created_at: string | null
          id: string
          integration_type: string
          is_active: boolean | null
          last_used_at: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          configuration?: Json
          created_at?: string | null
          id?: string
          integration_type: string
          is_active?: boolean | null
          last_used_at?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          configuration?: Json
          created_at?: string | null
          id?: string
          integration_type?: string
          is_active?: boolean | null
          last_used_at?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          ip_address: string | null
          is_active: boolean | null
          model_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          model_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          model_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      links_compartilhamento: {
        Row: {
          ativo: boolean | null
          codigo_unico: string
          compartilhamento_id: string | null
          contador_acessos: number | null
          data_criacao: string | null
          data_expiracao: string | null
          descricao_preview: string | null
          id: string
          imagem_preview: string | null
          limite_visualizacoes: number | null
          protegido_senha: boolean | null
          senha_acesso: string | null
          titulo_preview: string | null
          url_completa: string
          url_encurtada: string | null
        }
        Insert: {
          ativo?: boolean | null
          codigo_unico: string
          compartilhamento_id?: string | null
          contador_acessos?: number | null
          data_criacao?: string | null
          data_expiracao?: string | null
          descricao_preview?: string | null
          id?: string
          imagem_preview?: string | null
          limite_visualizacoes?: number | null
          protegido_senha?: boolean | null
          senha_acesso?: string | null
          titulo_preview?: string | null
          url_completa: string
          url_encurtada?: string | null
        }
        Update: {
          ativo?: boolean | null
          codigo_unico?: string
          compartilhamento_id?: string | null
          contador_acessos?: number | null
          data_criacao?: string | null
          data_expiracao?: string | null
          descricao_preview?: string | null
          id?: string
          imagem_preview?: string | null
          limite_visualizacoes?: number | null
          protegido_senha?: boolean | null
          senha_acesso?: string | null
          titulo_preview?: string | null
          url_completa?: string
          url_encurtada?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "links_compartilhamento_compartilhamento_id_fkey"
            columns: ["compartilhamento_id"]
            isOneToOne: false
            referencedRelation: "compartilhamentos"
            referencedColumns: ["id"]
          },
        ]
      }
      locais_favoritos: {
        Row: {
          cor_marcador: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          endereco: string | null
          icone_local: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nome_local: string
          notificar_chegada: boolean | null
          notificar_saida: boolean | null
          privado: boolean | null
          raio_deteccao: number | null
          tempo_permanencia_minimo: number | null
          tempo_total_permanencia: number | null
          tipo_local: string | null
          total_visitas: number | null
          ultima_visita: string | null
          usuario_id: string | null
          visitado_recentemente: boolean | null
        }
        Insert: {
          cor_marcador?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          endereco?: string | null
          icone_local?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_local: string
          notificar_chegada?: boolean | null
          notificar_saida?: boolean | null
          privado?: boolean | null
          raio_deteccao?: number | null
          tempo_permanencia_minimo?: number | null
          tempo_total_permanencia?: number | null
          tipo_local?: string | null
          total_visitas?: number | null
          ultima_visita?: string | null
          usuario_id?: string | null
          visitado_recentemente?: boolean | null
        }
        Update: {
          cor_marcador?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          endereco?: string | null
          icone_local?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nome_local?: string
          notificar_chegada?: boolean | null
          notificar_saida?: boolean | null
          privado?: boolean | null
          raio_deteccao?: number | null
          tempo_permanencia_minimo?: number | null
          tempo_total_permanencia?: number | null
          tipo_local?: string | null
          total_visitas?: number | null
          ultima_visita?: string | null
          usuario_id?: string | null
          visitado_recentemente?: boolean | null
        }
        Relationships: []
      }
      localizacao_usuarios: {
        Row: {
          altitude: number | null
          bairro: string | null
          cep: string | null
          cidade: string | null
          compartilhar_localizacao: boolean | null
          data_atualizacao: string | null
          data_obtencao: string | null
          direcao: number | null
          endereco_completo: string | null
          estado: string | null
          fonte_localizacao: string | null
          historico_ativo: boolean | null
          id: string
          ip_address: unknown | null
          latitude: number | null
          longitude: number | null
          navegador: string | null
          numero: string | null
          pais: string | null
          pais_codigo: string | null
          permissao_localizacao: string | null
          precisao: number | null
          provedor_internet: string | null
          rua: string | null
          sistema_operacional: string | null
          timezone: string | null
          tipo_conexao: string | null
          tipo_dispositivo: string | null
          usuario_id: string | null
          velocidade: number | null
          velocidade_conexao: string | null
          versao_app: string | null
          visivel_para: string | null
        }
        Insert: {
          altitude?: number | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          compartilhar_localizacao?: boolean | null
          data_atualizacao?: string | null
          data_obtencao?: string | null
          direcao?: number | null
          endereco_completo?: string | null
          estado?: string | null
          fonte_localizacao?: string | null
          historico_ativo?: boolean | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          navegador?: string | null
          numero?: string | null
          pais?: string | null
          pais_codigo?: string | null
          permissao_localizacao?: string | null
          precisao?: number | null
          provedor_internet?: string | null
          rua?: string | null
          sistema_operacional?: string | null
          timezone?: string | null
          tipo_conexao?: string | null
          tipo_dispositivo?: string | null
          usuario_id?: string | null
          velocidade?: number | null
          velocidade_conexao?: string | null
          versao_app?: string | null
          visivel_para?: string | null
        }
        Update: {
          altitude?: number | null
          bairro?: string | null
          cep?: string | null
          cidade?: string | null
          compartilhar_localizacao?: boolean | null
          data_atualizacao?: string | null
          data_obtencao?: string | null
          direcao?: number | null
          endereco_completo?: string | null
          estado?: string | null
          fonte_localizacao?: string | null
          historico_ativo?: boolean | null
          id?: string
          ip_address?: unknown | null
          latitude?: number | null
          longitude?: number | null
          navegador?: string | null
          numero?: string | null
          pais?: string | null
          pais_codigo?: string | null
          permissao_localizacao?: string | null
          precisao?: number | null
          provedor_internet?: string | null
          rua?: string | null
          sistema_operacional?: string | null
          timezone?: string | null
          tipo_conexao?: string | null
          tipo_dispositivo?: string | null
          usuario_id?: string | null
          velocidade?: number | null
          velocidade_conexao?: string | null
          versao_app?: string | null
          visivel_para?: string | null
        }
        Relationships: []
      }
      missoes_desafios: {
        Row: {
          ativa: boolean | null
          categoria_missao: string | null
          data_criacao: string | null
          data_fim: string | null
          data_inicio: string | null
          descricao_missao: string | null
          dificuldade: string | null
          id: string
          limite_participantes: number | null
          objetivos: Json | null
          participantes_atual: number | null
          progresso_necessario: number | null
          recompensas: Json | null
          repetivel: boolean | null
          tipo_missao: string | null
          titulo_missao: string
        }
        Insert: {
          ativa?: boolean | null
          categoria_missao?: string | null
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao_missao?: string | null
          dificuldade?: string | null
          id?: string
          limite_participantes?: number | null
          objetivos?: Json | null
          participantes_atual?: number | null
          progresso_necessario?: number | null
          recompensas?: Json | null
          repetivel?: boolean | null
          tipo_missao?: string | null
          titulo_missao: string
        }
        Update: {
          ativa?: boolean | null
          categoria_missao?: string | null
          data_criacao?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          descricao_missao?: string | null
          dificuldade?: string | null
          id?: string
          limite_participantes?: number | null
          objetivos?: Json | null
          participantes_atual?: number | null
          progresso_necessario?: number | null
          recompensas?: Json | null
          repetivel?: boolean | null
          tipo_missao?: string | null
          titulo_missao?: string
        }
        Relationships: []
      }
      model_followers: {
        Row: {
          followed_at: string
          id: string
          is_active: boolean
          model_id: string
          user_email: string
          user_id: string
          user_name: string
        }
        Insert: {
          followed_at?: string
          id?: string
          is_active?: boolean
          model_id: string
          user_email: string
          user_id: string
          user_name: string
        }
        Update: {
          followed_at?: string
          id?: string
          is_active?: boolean
          model_id?: string
          user_email?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "model_followers_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "model_followers_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
        ]
      }
      model_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          model_id: string
          model_username: string
          user_id: string | null
          viewer_name: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          model_id: string
          model_username: string
          user_id?: string | null
          viewer_name?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          model_id?: string
          model_username?: string
          user_id?: string | null
          viewer_name?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          avatar_url: string | null
          bio: string | null
          category: string | null
          created_at: string | null
          display_order: number | null
          followers_count: number | null
          id: string
          is_active: boolean | null
          is_live: boolean | null
          is_premium: boolean | null
          is_verified: boolean | null
          likes_count: number | null
          name: string
          onlyfans_link: string | null
          posting_panel_url: string | null
          social_links: Json | null
          tags: string[] | null
          total_comments: number | null
          total_likes: number | null
          total_shares: number | null
          total_views: number | null
          updated_at: string | null
          username: string
          videos_count: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          name: string
          onlyfans_link?: string | null
          posting_panel_url?: string | null
          social_links?: Json | null
          tags?: string[] | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string | null
          username: string
          videos_count?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          followers_count?: number | null
          id?: string
          is_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          is_verified?: boolean | null
          likes_count?: number | null
          name?: string
          onlyfans_link?: string | null
          posting_panel_url?: string | null
          social_links?: Json | null
          tags?: string[] | null
          total_comments?: number | null
          total_likes?: number | null
          total_shares?: number | null
          total_views?: number | null
          updated_at?: string | null
          username?: string
          videos_count?: number | null
        }
        Relationships: []
      }
      notificacoes_localizacao: {
        Row: {
          ativa: boolean | null
          condicoes_trigger: Json | null
          conteudo_notificacao: string | null
          data_criacao: string | null
          data_expiracao: string | null
          id: string
          latitude_trigger: number | null
          limite_vezes: number | null
          local_referencia: string | null
          longitude_trigger: number | null
          prioridade: string | null
          raio_trigger: number | null
          repetir: boolean | null
          sons_ativados: boolean | null
          tipo_notificacao: string | null
          titulo_notificacao: string
          ultima_ativacao: string | null
          usuario_id: string | null
          vezes_disparada: number | null
          vibracao_ativada: boolean | null
        }
        Insert: {
          ativa?: boolean | null
          condicoes_trigger?: Json | null
          conteudo_notificacao?: string | null
          data_criacao?: string | null
          data_expiracao?: string | null
          id?: string
          latitude_trigger?: number | null
          limite_vezes?: number | null
          local_referencia?: string | null
          longitude_trigger?: number | null
          prioridade?: string | null
          raio_trigger?: number | null
          repetir?: boolean | null
          sons_ativados?: boolean | null
          tipo_notificacao?: string | null
          titulo_notificacao: string
          ultima_ativacao?: string | null
          usuario_id?: string | null
          vezes_disparada?: number | null
          vibracao_ativada?: boolean | null
        }
        Update: {
          ativa?: boolean | null
          condicoes_trigger?: Json | null
          conteudo_notificacao?: string | null
          data_criacao?: string | null
          data_expiracao?: string | null
          id?: string
          latitude_trigger?: number | null
          limite_vezes?: number | null
          local_referencia?: string | null
          longitude_trigger?: number | null
          prioridade?: string | null
          raio_trigger?: number | null
          repetir?: boolean | null
          sons_ativados?: boolean | null
          tipo_notificacao?: string | null
          titulo_notificacao?: string
          ultima_ativacao?: string | null
          usuario_id?: string | null
          vezes_disparada?: number | null
          vibracao_ativada?: boolean | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          bonus_info: Json | null
          created_at: string | null
          email_sent_at: string | null
          id: string
          is_read: boolean | null
          is_sent: boolean | null
          message: string
          model_id: string | null
          points_awarded: number | null
          push_sent_at: string | null
          read_at: string | null
          scheduled_for: string | null
          send_email: boolean | null
          send_push: boolean | null
          send_sms: boolean | null
          sent_at: string | null
          sms_sent_at: string | null
          title: string
          type: string
          updated_at: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          bonus_info?: Json | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message: string
          model_id?: string | null
          points_awarded?: number | null
          push_sent_at?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          send_email?: boolean | null
          send_push?: boolean | null
          send_sms?: boolean | null
          sent_at?: string | null
          sms_sent_at?: string | null
          title: string
          type: string
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          bonus_info?: Json | null
          created_at?: string | null
          email_sent_at?: string | null
          id?: string
          is_read?: boolean | null
          is_sent?: boolean | null
          message?: string
          model_id?: string | null
          points_awarded?: number | null
          push_sent_at?: string | null
          read_at?: string | null
          scheduled_for?: string | null
          send_email?: boolean | null
          send_push?: boolean | null
          send_sms?: boolean | null
          sent_at?: string | null
          sms_sent_at?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      offer_clicks: {
        Row: {
          created_at: string
          id: string
          ip_address: string | null
          model_id: string | null
          offer_id: string
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          offer_id: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          offer_id?: string
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "offer_clicks_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          ad_text: string | null
          ad_text_link: string | null
          button_color: string | null
          button_effect: string
          button_link: string
          button_text: string
          created_at: string
          description: string | null
          duration_seconds: number
          end_at: string | null
          id: string
          image_url: string | null
          is_active: boolean
          model_id: string
          show_times: number
          start_at: string | null
          title: string
          updated_at: string
          video_id: string | null
        }
        Insert: {
          ad_text?: string | null
          ad_text_link?: string | null
          button_color?: string | null
          button_effect?: string
          button_link: string
          button_text: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          end_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          model_id: string
          show_times?: number
          start_at?: string | null
          title: string
          updated_at?: string
          video_id?: string | null
        }
        Update: {
          ad_text?: string | null
          ad_text_link?: string | null
          button_color?: string | null
          button_effect?: string
          button_link?: string
          button_text?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number
          end_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          model_id?: string
          show_times?: number
          start_at?: string | null
          title?: string
          updated_at?: string
          video_id?: string | null
        }
        Relationships: []
      }
      online_users: {
        Row: {
          created_at: string | null
          current_page: string | null
          current_video_id: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_online: boolean | null
          last_seen_at: string | null
          location_city: string | null
          location_country: string | null
          location_state: string | null
          session_id: string | null
          socket_id: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_page?: string | null
          current_video_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          session_id?: string | null
          socket_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_page?: string | null
          current_video_id?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_online?: boolean | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_state?: string | null
          session_id?: string | null
          socket_id?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "online_users_current_video_id_fkey"
            columns: ["current_video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      paginas_aplicativo: {
        Row: {
          ativa: boolean | null
          cor_tema: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          descricao: string | null
          icone_pagina: string | null
          id: string
          nivel_acesso: string | null
          nome_pagina: string | null
          posicao_menu: number | null
          requer_login: boolean | null
          tipo_pagina: string | null
          titulo_pagina: string | null
          url_pagina: string | null
        }
        Insert: {
          ativa?: boolean | null
          cor_tema?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          icone_pagina?: string | null
          id?: string
          nivel_acesso?: string | null
          nome_pagina?: string | null
          posicao_menu?: number | null
          requer_login?: boolean | null
          tipo_pagina?: string | null
          titulo_pagina?: string | null
          url_pagina?: string | null
        }
        Update: {
          ativa?: boolean | null
          cor_tema?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          descricao?: string | null
          icone_pagina?: string | null
          id?: string
          nivel_acesso?: string | null
          nome_pagina?: string | null
          posicao_menu?: number | null
          requer_login?: boolean | null
          tipo_pagina?: string | null
          titulo_pagina?: string | null
          url_pagina?: string | null
        }
        Relationships: []
      }
      participantes_evento: {
        Row: {
          banido: boolean | null
          data_entrada: string | null
          data_saida: string | null
          evento_id: string | null
          id: string
          interacoes_realizadas: number | null
          permissoes_especiais: Json | null
          presente: boolean | null
          tempo_assistido: number | null
          tipo_participacao: string | null
          usuario_id: string | null
        }
        Insert: {
          banido?: boolean | null
          data_entrada?: string | null
          data_saida?: string | null
          evento_id?: string | null
          id?: string
          interacoes_realizadas?: number | null
          permissoes_especiais?: Json | null
          presente?: boolean | null
          tempo_assistido?: number | null
          tipo_participacao?: string | null
          usuario_id?: string | null
        }
        Update: {
          banido?: boolean | null
          data_entrada?: string | null
          data_saida?: string | null
          evento_id?: string | null
          id?: string
          interacoes_realizadas?: number | null
          permissoes_especiais?: Json | null
          presente?: boolean | null
          tempo_assistido?: number | null
          tipo_participacao?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participantes_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_ao_vivo"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          customer_email: string | null
          customer_name: string | null
          event_type: string
          external_id: string
          id: string
          processed_at: string | null
          provider: string
          raw_payload: Json
          status: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          event_type: string
          external_id: string
          id?: string
          processed_at?: string | null
          provider: string
          raw_payload: Json
          status: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          customer_email?: string | null
          customer_name?: string | null
          event_type?: string
          external_id?: string
          id?: string
          processed_at?: string | null
          provider?: string
          raw_payload?: Json
          status?: string
        }
        Relationships: []
      }
      pix_payments: {
        Row: {
          amount: number
          created_at: string
          email: string
          expires_at: string
          id: string
          name: string
          paid_at: string | null
          pix_code: string
          status: string
          txid: string
          updated_at: string
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          amount?: number
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          name: string
          paid_at?: string | null
          pix_code: string
          status?: string
          txid: string
          updated_at?: string
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          name?: string
          paid_at?: string | null
          pix_code?: string
          status?: string
          txid?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: []
      }
      platform_connections: {
        Row: {
          access_token: string | null
          api_key: string | null
          api_secret: string | null
          configuration: Json | null
          created_at: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          monthly_revenue: number | null
          platform_name: string
          refresh_token: string | null
          status: string
          total_users: number | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          monthly_revenue?: number | null
          platform_name: string
          refresh_token?: string | null
          status?: string
          total_users?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          access_token?: string | null
          api_key?: string | null
          api_secret?: string | null
          configuration?: Json | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          monthly_revenue?: number | null
          platform_name?: string
          refresh_token?: string | null
          status?: string
          total_users?: number | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      points_history: {
        Row: {
          admin_user_id: string | null
          created_at: string | null
          daily_action_id: string | null
          description: string | null
          id: string
          ip_address: string | null
          model_id: string | null
          points_after: number
          points_before: number
          points_change: number
          reason: string
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          admin_user_id?: string | null
          created_at?: string | null
          daily_action_id?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          model_id?: string | null
          points_after: number
          points_before: number
          points_change: number
          reason: string
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          admin_user_id?: string | null
          created_at?: string | null
          daily_action_id?: string | null
          description?: string | null
          id?: string
          ip_address?: string | null
          model_id?: string | null
          points_after?: number
          points_before?: number
          points_change?: number
          reason?: string
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "points_history_daily_action_id_fkey"
            columns: ["daily_action_id"]
            isOneToOne: false
            referencedRelation: "daily_actions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "top_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "points_history_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_agendados: {
        Row: {
          conteudo_url: string
          created_at: string
          data_agendamento: string
          data_publicacao: string | null
          descricao: string | null
          enviar_tela_principal: boolean
          id: string
          imagens: string[] | null
          modelo_id: string
          modelo_username: string
          status: string
          tipo_conteudo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo_url: string
          created_at?: string
          data_agendamento: string
          data_publicacao?: string | null
          descricao?: string | null
          enviar_tela_principal?: boolean
          id?: string
          imagens?: string[] | null
          modelo_id: string
          modelo_username: string
          status?: string
          tipo_conteudo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo_url?: string
          created_at?: string
          data_agendamento?: string
          data_publicacao?: string | null
          descricao?: string | null
          enviar_tela_principal?: boolean
          id?: string
          imagens?: string[] | null
          modelo_id?: string
          modelo_username?: string
          status?: string
          tipo_conteudo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_agendados_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_agendados_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
        ]
      }
      posts_principais: {
        Row: {
          conteudo_url: string
          created_at: string
          descricao: string | null
          id: string
          is_active: boolean
          modelo_id: string
          modelo_username: string
          post_agendado_id: string | null
          tipo_conteudo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          conteudo_url: string
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          modelo_id: string
          modelo_username: string
          post_agendado_id?: string | null
          tipo_conteudo?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          conteudo_url?: string
          created_at?: string
          descricao?: string | null
          id?: string
          is_active?: boolean
          modelo_id?: string
          modelo_username?: string
          post_agendado_id?: string | null
          tipo_conteudo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_principais_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_principais_modelo_id_fkey"
            columns: ["modelo_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_principais_post_agendado_id_fkey"
            columns: ["post_agendado_id"]
            isOneToOne: false
            referencedRelation: "posts_agendados"
            referencedColumns: ["id"]
          },
        ]
      }
      premios_usuarios: {
        Row: {
          contexto_origem: string | null
          data_expiracao: string | null
          data_obtencao: string | null
          evento_origem: string | null
          exibir_perfil: boolean | null
          id: string
          metadata_adicional: Json | null
          nivel_obtido: number | null
          notificado: boolean | null
          progresso_atual: number | null
          progresso_total: number | null
          tipo_premio_id: string | null
          usuario_id: string | null
        }
        Insert: {
          contexto_origem?: string | null
          data_expiracao?: string | null
          data_obtencao?: string | null
          evento_origem?: string | null
          exibir_perfil?: boolean | null
          id?: string
          metadata_adicional?: Json | null
          nivel_obtido?: number | null
          notificado?: boolean | null
          progresso_atual?: number | null
          progresso_total?: number | null
          tipo_premio_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          contexto_origem?: string | null
          data_expiracao?: string | null
          data_obtencao?: string | null
          evento_origem?: string | null
          exibir_perfil?: boolean | null
          id?: string
          metadata_adicional?: Json | null
          nivel_obtido?: number | null
          notificado?: boolean | null
          progresso_atual?: number | null
          progresso_total?: number | null
          tipo_premio_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premios_usuarios_tipo_premio_id_fkey"
            columns: ["tipo_premio_id"]
            isOneToOne: false
            referencedRelation: "tipos_premios"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_access: {
        Row: {
          created_at: string
          email: string
          id: string
          ip_address: string | null
          model_id: string | null
          name: string
          phone: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          name: string
          phone: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          ip_address?: string | null
          model_id?: string | null
          name?: string
          phone?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: []
      }
      premium_content: {
        Row: {
          access_level: string | null
          content_type: string
          content_url: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          model_id: string | null
          price: number
          thumbnail_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          content_type?: string
          content_url: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          price?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          content_type?: string
          content_url?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string | null
          price?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "premium_content_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "premium_content_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_members: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          monthly_fee: number | null
          plan_type: string | null
          signup_date: string | null
          user_email: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number | null
          plan_type?: string | null
          signup_date?: string | null
          user_email: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_fee?: number | null
          plan_type?: string | null
          signup_date?: string | null
          user_email?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      premium_users: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          payment_id: string | null
          subscription_end: string
          subscription_start: string
          subscription_status: string
          subscription_type: string
          updated_at: string
          user_id: string | null
          whatsapp: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          payment_id?: string | null
          subscription_end?: string
          subscription_start?: string
          subscription_status?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string | null
          whatsapp: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          payment_id?: string | null
          subscription_end?: string
          subscription_start?: string
          subscription_status?: string
          subscription_type?: string
          updated_at?: string
          user_id?: string | null
          whatsapp?: string
        }
        Relationships: [
          {
            foreignKeyName: "premium_users_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "pix_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      progresso_missoes: {
        Row: {
          completada: boolean | null
          data_completacao: string | null
          data_inicio: string | null
          id: string
          metadata_progresso: Json | null
          missao_id: string | null
          progresso_atual: number | null
          progresso_total: number | null
          recompensa_coletada: boolean | null
          tentativas_realizadas: number | null
          usuario_id: string | null
        }
        Insert: {
          completada?: boolean | null
          data_completacao?: string | null
          data_inicio?: string | null
          id?: string
          metadata_progresso?: Json | null
          missao_id?: string | null
          progresso_atual?: number | null
          progresso_total?: number | null
          recompensa_coletada?: boolean | null
          tentativas_realizadas?: number | null
          usuario_id?: string | null
        }
        Update: {
          completada?: boolean | null
          data_completacao?: string | null
          data_inicio?: string | null
          id?: string
          metadata_progresso?: Json | null
          missao_id?: string | null
          progresso_atual?: number | null
          progresso_total?: number | null
          recompensa_coletada?: boolean | null
          tentativas_realizadas?: number | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "progresso_missoes_missao_id_fkey"
            columns: ["missao_id"]
            isOneToOne: false
            referencedRelation: "missoes_desafios"
            referencedColumns: ["id"]
          },
        ]
      }
      ranking_usuarios: {
        Row: {
          categoria_ranking: string | null
          conquistas_total: number | null
          data_atualizacao: string | null
          data_ultima_atividade: string | null
          experiencia_atual: number | null
          experiencia_proximo_nivel: number | null
          id: string
          melhor_streak: number | null
          nivel_usuario: number | null
          periodo_referencia: string | null
          pontos_totais: number | null
          posicao_anterior: number | null
          posicao_atual: number | null
          streak_dias: number | null
          usuario_id: string | null
        }
        Insert: {
          categoria_ranking?: string | null
          conquistas_total?: number | null
          data_atualizacao?: string | null
          data_ultima_atividade?: string | null
          experiencia_atual?: number | null
          experiencia_proximo_nivel?: number | null
          id?: string
          melhor_streak?: number | null
          nivel_usuario?: number | null
          periodo_referencia?: string | null
          pontos_totais?: number | null
          posicao_anterior?: number | null
          posicao_atual?: number | null
          streak_dias?: number | null
          usuario_id?: string | null
        }
        Update: {
          categoria_ranking?: string | null
          conquistas_total?: number | null
          data_atualizacao?: string | null
          data_ultima_atividade?: string | null
          experiencia_atual?: number | null
          experiencia_proximo_nivel?: number | null
          id?: string
          melhor_streak?: number | null
          nivel_usuario?: number | null
          periodo_referencia?: string | null
          pontos_totais?: number | null
          posicao_anterior?: number | null
          posicao_atual?: number | null
          streak_dias?: number | null
          usuario_id?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action_type: string
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action_type: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action_type?: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      reacoes_evento: {
        Row: {
          data_criacao: string | null
          evento_id: string | null
          id: string
          timestamp_video: number | null
          tipo_reacao: string
          usuario_id: string | null
        }
        Insert: {
          data_criacao?: string | null
          evento_id?: string | null
          id?: string
          timestamp_video?: number | null
          tipo_reacao: string
          usuario_id?: string | null
        }
        Update: {
          data_criacao?: string | null
          evento_id?: string | null
          id?: string
          timestamp_video?: number | null
          tipo_reacao?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reacoes_evento_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "eventos_ao_vivo"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          created_at: string | null
          customer_id: string | null
          customer_name: string | null
          id: string
          is_active: boolean | null
          model_id: string
          model_name: string
          product_name: string
          sale_date: string | null
          sale_value: number
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_active?: boolean | null
          model_id: string
          model_name: string
          product_name: string
          sale_date?: string | null
          sale_value: number
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          is_active?: boolean | null
          model_id?: string
          model_name?: string
          product_name?: string
          sale_date?: string | null
          sale_value?: number
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_logs: {
        Row: {
          created_at: string | null
          event_description: string | null
          event_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          severity: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_description?: string | null
          event_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_description?: string | null
          event_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          severity?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sistema_pontos: {
        Row: {
          acao_realizada: string
          aprovado: boolean | null
          bonus_aplicado: number | null
          data_criacao: string | null
          descricao_acao: string | null
          id: string
          moderado: boolean | null
          multiplicador: number | null
          pontos_ganhos: number | null
          pontos_perdidos: number | null
          referencia_id: string | null
          tipo_referencia: string | null
          usuario_id: string | null
          validado_automaticamente: boolean | null
        }
        Insert: {
          acao_realizada: string
          aprovado?: boolean | null
          bonus_aplicado?: number | null
          data_criacao?: string | null
          descricao_acao?: string | null
          id?: string
          moderado?: boolean | null
          multiplicador?: number | null
          pontos_ganhos?: number | null
          pontos_perdidos?: number | null
          referencia_id?: string | null
          tipo_referencia?: string | null
          usuario_id?: string | null
          validado_automaticamente?: boolean | null
        }
        Update: {
          acao_realizada?: string
          aprovado?: boolean | null
          bonus_aplicado?: number | null
          data_criacao?: string | null
          descricao_acao?: string | null
          id?: string
          moderado?: boolean | null
          multiplicador?: number | null
          pontos_ganhos?: number | null
          pontos_perdidos?: number | null
          referencia_id?: string | null
          tipo_referencia?: string | null
          usuario_id?: string | null
          validado_automaticamente?: boolean | null
        }
        Relationships: []
      }
      sms_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          external_id: string | null
          id: string
          integration_id: string | null
          message: string
          provider: string
          recipient_phone: string
          sent_at: string | null
          status: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          message: string
          provider: string
          recipient_phone: string
          sent_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          external_id?: string | null
          id?: string
          integration_id?: string | null
          message?: string
          provider?: string
          recipient_phone?: string
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          previous_value: Json | null
          setting_key: string
          setting_type: string | null
          setting_value: Json | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          previous_value?: Json | null
          setting_key: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          previous_value?: Json | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: Json | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: []
      }
      system_status: {
        Row: {
          additional_info: Json | null
          created_at: string | null
          id: string
          last_check_at: string | null
          response_time: number | null
          service_name: string
          status: string
          updated_at: string | null
          uptime_percentage: number | null
        }
        Insert: {
          additional_info?: Json | null
          created_at?: string | null
          id?: string
          last_check_at?: string | null
          response_time?: number | null
          service_name: string
          status: string
          updated_at?: string | null
          uptime_percentage?: number | null
        }
        Update: {
          additional_info?: Json | null
          created_at?: string | null
          id?: string
          last_check_at?: string | null
          response_time?: number | null
          service_name?: string
          status?: string
          updated_at?: string | null
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      tipos_premios: {
        Row: {
          ativo: boolean | null
          categoria_premio: string | null
          cor_premio: string | null
          criterios_obtencao: Json | null
          data_criacao: string | null
          data_fim_disponibilidade: string | null
          data_inicio_disponibilidade: string | null
          descricao_premio: string | null
          icone_premio: string | null
          id: string
          limitado: boolean | null
          nome_premio: string
          quantidade_disponivel: number | null
          raridade: string | null
          valor_monetario: number | null
          valor_pontos: number | null
        }
        Insert: {
          ativo?: boolean | null
          categoria_premio?: string | null
          cor_premio?: string | null
          criterios_obtencao?: Json | null
          data_criacao?: string | null
          data_fim_disponibilidade?: string | null
          data_inicio_disponibilidade?: string | null
          descricao_premio?: string | null
          icone_premio?: string | null
          id?: string
          limitado?: boolean | null
          nome_premio: string
          quantidade_disponivel?: number | null
          raridade?: string | null
          valor_monetario?: number | null
          valor_pontos?: number | null
        }
        Update: {
          ativo?: boolean | null
          categoria_premio?: string | null
          cor_premio?: string | null
          criterios_obtencao?: Json | null
          data_criacao?: string | null
          data_fim_disponibilidade?: string | null
          data_inicio_disponibilidade?: string | null
          descricao_premio?: string | null
          icone_premio?: string | null
          id?: string
          limitado?: boolean | null
          nome_premio?: string
          quantidade_disponivel?: number | null
          raridade?: string | null
          valor_monetario?: number | null
          valor_pontos?: number | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string | null
          customer_name: string
          external_transaction_id: string | null
          fees: number | null
          gateway_provider: string | null
          gateway_response: Json | null
          id: string
          metadata: Json | null
          model_id: string | null
          net_amount: number | null
          payment_method: string
          processed_at: string | null
          status: string
          transaction_type: string
          updated_at: string
          webhook_received_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name: string
          external_transaction_id?: string | null
          fees?: number | null
          gateway_provider?: string | null
          gateway_response?: Json | null
          id?: string
          metadata?: Json | null
          model_id?: string | null
          net_amount?: number | null
          payment_method: string
          processed_at?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          webhook_received_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string | null
          customer_name?: string
          external_transaction_id?: string | null
          fees?: number | null
          gateway_provider?: string | null
          gateway_response?: Json | null
          id?: string
          metadata?: Json | null
          model_id?: string | null
          net_amount?: number | null
          payment_method?: string
          processed_at?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          webhook_received_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_actions: {
        Row: {
          action_type: string
          created_at: string | null
          date_performed: string | null
          id: string
          ip_address: unknown | null
          model_id: string | null
          points_earned: number | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          date_performed?: string | null
          id?: string
          ip_address?: unknown | null
          model_id?: string | null
          points_earned?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          date_performed?: string | null
          id?: string
          ip_address?: unknown | null
          model_id?: string | null
          points_earned?: number | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_actions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_actions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_actions_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      user_mission_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          date_started: string
          id: string
          is_completed: boolean
          mission_id: string
          points_earned: number | null
          progress_count: number
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          date_started?: string
          id?: string
          is_completed?: boolean
          mission_id: string
          points_earned?: number | null
          progress_count?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          date_started?: string
          id?: string
          is_completed?: boolean
          mission_id?: string
          points_earned?: number | null
          progress_count?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_mission_progress_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "daily_missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          sent_at: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          sent_at?: string | null
          title: string
          type?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          sent_at?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      user_rankings: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_activity_at: string | null
          level_name: string | null
          max_streak: number | null
          total_points: number | null
          total_tasks_completed: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_at?: string | null
          level_name?: string | null
          max_streak?: number | null
          total_points?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_activity_at?: string | null
          level_name?: string | null
          max_streak?: number | null
          total_points?: number | null
          total_tasks_completed?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          device_info: Json | null
          device_type: string | null
          ended_at: string | null
          expires_at: string
          id: string
          ip_address: string | null
          is_active: boolean | null
          last_activity_at: string | null
          last_seen_at: string | null
          location_city: string | null
          location_country: string | null
          location_data: Json | null
          location_state: string | null
          logged_out_at: string | null
          session_token: string
          started_at: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          device_info?: Json | null
          device_type?: string | null
          ended_at?: string | null
          expires_at: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_data?: Json | null
          location_state?: string | null
          logged_out_at?: string | null
          session_token: string
          started_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          device_info?: Json | null
          device_type?: string | null
          ended_at?: string | null
          expires_at?: string
          id?: string
          ip_address?: string | null
          is_active?: boolean | null
          last_activity_at?: string | null
          last_seen_at?: string | null
          location_city?: string | null
          location_country?: string | null
          location_data?: Json | null
          location_state?: string | null
          logged_out_at?: string | null
          session_token?: string
          started_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          browser_info: Json | null
          created_at: string | null
          current_points: number | null
          device_info: Json | null
          email: string
          email_verified_at: string | null
          id: string
          is_active: boolean | null
          is_muted: boolean | null
          is_top10_member: boolean | null
          language: string | null
          last_activity_at: string | null
          last_login_at: string | null
          level_points: number | null
          location_city: string | null
          location_country: string | null
          location_ip: string | null
          location_state: string | null
          name: string
          password_hash: string | null
          registration_source: string | null
          timezone: string | null
          top10_registered_at: string | null
          total_points: number | null
          updated_at: string | null
          user_level: number | null
          whatsapp: string | null
          whatsapp_verified_at: string | null
        }
        Insert: {
          browser_info?: Json | null
          created_at?: string | null
          current_points?: number | null
          device_info?: Json | null
          email: string
          email_verified_at?: string | null
          id?: string
          is_active?: boolean | null
          is_muted?: boolean | null
          is_top10_member?: boolean | null
          language?: string | null
          last_activity_at?: string | null
          last_login_at?: string | null
          level_points?: number | null
          location_city?: string | null
          location_country?: string | null
          location_ip?: string | null
          location_state?: string | null
          name: string
          password_hash?: string | null
          registration_source?: string | null
          timezone?: string | null
          top10_registered_at?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_level?: number | null
          whatsapp?: string | null
          whatsapp_verified_at?: string | null
        }
        Update: {
          browser_info?: Json | null
          created_at?: string | null
          current_points?: number | null
          device_info?: Json | null
          email?: string
          email_verified_at?: string | null
          id?: string
          is_active?: boolean | null
          is_muted?: boolean | null
          is_top10_member?: boolean | null
          language?: string | null
          last_activity_at?: string | null
          last_login_at?: string | null
          level_points?: number | null
          location_city?: string | null
          location_country?: string | null
          location_ip?: string | null
          location_state?: string | null
          name?: string
          password_hash?: string | null
          registration_source?: string | null
          timezone?: string | null
          top10_registered_at?: string | null
          total_points?: number | null
          updated_at?: string | null
          user_level?: number | null
          whatsapp?: string | null
          whatsapp_verified_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          biografia: string | null
          data_atualizacao: string | null
          data_criacao: string | null
          data_nascimento: string | null
          email: string | null
          foto_perfil: string | null
          genero: string | null
          id: string
          localizacao: string | null
          nivel_privacidade: string | null
          nome_completo: string | null
          nome_usuario: string | null
          senha: string | null
          site: string | null
          status: string | null
          telefone: string | null
          verificado: boolean | null
        }
        Insert: {
          biografia?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          foto_perfil?: string | null
          genero?: string | null
          id?: string
          localizacao?: string | null
          nivel_privacidade?: string | null
          nome_completo?: string | null
          nome_usuario?: string | null
          senha?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          verificado?: boolean | null
        }
        Update: {
          biografia?: string | null
          data_atualizacao?: string | null
          data_criacao?: string | null
          data_nascimento?: string | null
          email?: string | null
          foto_perfil?: string | null
          genero?: string | null
          id?: string
          localizacao?: string | null
          nivel_privacidade?: string | null
          nome_completo?: string | null
          nome_usuario?: string | null
          senha?: string | null
          site?: string | null
          status?: string | null
          telefone?: string | null
          verificado?: boolean | null
        }
        Relationships: []
      }
      video_shares: {
        Row: {
          created_at: string | null
          device_type: string | null
          error_message: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          model_id: string | null
          platform: string
          session_id: string | null
          share_method: string | null
          shared_url: string | null
          success: boolean | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          model_id?: string | null
          platform?: string
          session_id?: string | null
          share_method?: string | null
          shared_url?: string | null
          success?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_type?: string | null
          error_message?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          model_id?: string | null
          platform?: string
          session_id?: string | null
          share_method?: string | null
          shared_url?: string | null
          success?: boolean | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_shares_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_shares_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_shares_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      video_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          is_complete_view: boolean | null
          is_completed: boolean | null
          model_id: string | null
          referrer_url: string | null
          region: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
          video_id: string | null
          watch_duration: number | null
          watch_percentage: number | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_complete_view?: boolean | null
          is_completed?: boolean | null
          model_id?: string | null
          referrer_url?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
          watch_duration?: number | null
          watch_percentage?: number | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          is_complete_view?: boolean | null
          is_completed?: boolean | null
          model_id?: string | null
          referrer_url?: string | null
          region?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
          video_id?: string | null
          watch_duration?: number | null
          watch_percentage?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "video_views_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "video_views_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          aspect_ratio: string | null
          category: string | null
          comments_count: number | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration: number | null
          file_size: number | null
          id: string
          is_active: boolean | null
          is_live: boolean | null
          is_premium: boolean | null
          likes_count: number | null
          live_video_url: string | null
          model_id: string | null
          quality: string | null
          shares_count: number | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string | null
          updated_at: string | null
          upload_source: string | null
          video_url: string
          views_count: number | null
          visibility: string
        }
        Insert: {
          aspect_ratio?: string | null
          category?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          likes_count?: number | null
          live_video_url?: string | null
          model_id?: string | null
          quality?: string | null
          shares_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          upload_source?: string | null
          video_url: string
          views_count?: number | null
          visibility?: string
        }
        Update: {
          aspect_ratio?: string | null
          category?: string | null
          comments_count?: number | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration?: number | null
          file_size?: number | null
          id?: string
          is_active?: boolean | null
          is_live?: boolean | null
          is_premium?: boolean | null
          likes_count?: number | null
          live_video_url?: string | null
          model_id?: string | null
          quality?: string | null
          shares_count?: number | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string | null
          updated_at?: string | null
          upload_source?: string | null
          video_url?: string
          views_count?: number | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "videos_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "popular_models"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          response_body: string | null
          response_status: number | null
          retry_count: number | null
          status: string
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
          retry_count?: number | null
          status?: string
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          response_body?: string | null
          response_status?: number | null
          retry_count?: number | null
          status?: string
          webhook_url?: string
        }
        Relationships: []
      }
      zonas_geograficas: {
        Row: {
          ativa: boolean | null
          caracteristicas: Json | null
          centro_latitude: number | null
          centro_longitude: number | null
          cidade: string | null
          codigo_postal: string | null
          data_criacao: string | null
          densidade_populacional: number | null
          estado: string | null
          geometria: Json | null
          id: string
          idioma_predominante: string | null
          moeda_local: string | null
          nome_zona: string
          pais: string | null
          populacao: number | null
          raio_cobertura: number | null
          timezone: string | null
          tipo_zona: string | null
        }
        Insert: {
          ativa?: boolean | null
          caracteristicas?: Json | null
          centro_latitude?: number | null
          centro_longitude?: number | null
          cidade?: string | null
          codigo_postal?: string | null
          data_criacao?: string | null
          densidade_populacional?: number | null
          estado?: string | null
          geometria?: Json | null
          id?: string
          idioma_predominante?: string | null
          moeda_local?: string | null
          nome_zona: string
          pais?: string | null
          populacao?: number | null
          raio_cobertura?: number | null
          timezone?: string | null
          tipo_zona?: string | null
        }
        Update: {
          ativa?: boolean | null
          caracteristicas?: Json | null
          centro_latitude?: number | null
          centro_longitude?: number | null
          cidade?: string | null
          codigo_postal?: string | null
          data_criacao?: string | null
          densidade_populacional?: number | null
          estado?: string | null
          geometria?: Json | null
          id?: string
          idioma_predominante?: string | null
          moeda_local?: string | null
          nome_zona?: string
          pais?: string | null
          populacao?: number | null
          raio_cobertura?: number | null
          timezone?: string | null
          tipo_zona?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      daily_stats: {
        Row: {
          active_users: number | null
          date: string | null
          total_comments: number | null
          total_likes: number | null
          total_points_awarded: number | null
          total_shares: number | null
        }
        Relationships: []
      }
      popular_models: {
        Row: {
          followers_count: number | null
          id: string | null
          is_live: boolean | null
          likes_count: number | null
          name: string | null
          total_comments: number | null
          total_video_likes: number | null
          total_views: number | null
          username: string | null
          videos_count: number | null
        }
        Relationships: []
      }
      top_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string | null
          is_top10_member: boolean | null
          name: string | null
          ranking: number | null
          top10_registered_at: string | null
          total_points: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_delete_model: {
        Args: { p_model_id: string }
        Returns: boolean
      }
      atualizar_localizacao_usuario: {
        Args: {
          endereco?: string
          id_usuario: string
          lat: number
          lng: number
          precisao?: number
          tipo_disp?: string
        }
        Returns: string
      }
      atualizar_pontuacao_usuario: {
        Args: {
          acao: string
          id_usuario: string
          pontos: number
          referencia_id?: string
        }
        Returns: boolean
      }
      calcular_distancia: {
        Args: { lat1: number; lat2: number; lng1: number; lng2: number }
        Returns: number
      }
      check_rate_limit: {
        Args: {
          action_type: string
          identifier: string
          max_requests?: number
          window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_sensitive_data: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      detectar_movimento: {
        Args: { coordenadas: Json; id_usuario: string; velocidade: number }
        Returns: string
      }
      ensure_guest_user: {
        Args: { guest_user_id: string }
        Returns: string
      }
      fazer_checkin_automatico: {
        Args: {
          id_usuario: string
          lat: number
          lng: number
          nome_local?: string
        }
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_daily_points_status: {
        Args: { p_action_type: string; p_user_id: string }
        Returns: Json
      }
      hash_sensitive_data: {
        Args: { data: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_security_event: {
        Args: { event_type: string; metadata?: Json }
        Returns: undefined
      }
      monitor_suspicious_activity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      processar_posts_agendados: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      processar_posts_agendados_manual: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      register_daily_action: {
        Args: {
          p_action_type: string
          p_model_id?: string
          p_points?: number
          p_user_id: string
          p_video_id?: string
        }
        Returns: Json
      }
      register_gamification_action: {
        Args: {
          p_action_type: string
          p_ip_address?: string
          p_model_id?: string
          p_user_agent?: string
          p_user_id: string
          p_video_id?: string
        }
        Returns: Json
      }
      testar_sistema: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      track_user_activity: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_mission_progress: {
        Args: { p_action_type: string; p_increment?: number; p_user_id: string }
        Returns: Json
      }
      validate_gmail: {
        Args: { email_input: string }
        Returns: boolean
      }
      verificar_notificacoes_localizacao: {
        Args: { id_usuario: string; lat: number; lng: number }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
