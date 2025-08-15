import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Send, User, Play, Image as ImageIcon, Megaphone, Calendar, Clock, Palette, Sparkles, ExternalLink, Hand } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { VideoCarousel } from '@/components/ui/video-carousel';
import { ImageCarousel } from '@/components/ui/image-carousel';
import { supabase } from '@/integrations/supabase/client';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: any) => void;
  editingContent?: any;
}

export const ContentModal = ({ isOpen, onClose, onSubmit, editingContent }: ContentModalProps) => {
  const [contentType, setContentType] = useState('normal');
  const [uploadMode, setUploadMode] = useState<'single' | 'list'>('single');
  
  // Formulários separados para cada aba
  const [normalFormData, setNormalFormData] = useState({
    name: '',
    displayName: '',
    id: '',
    avatarUrl: '',
    videoUrl: '',
    videoList: '',
    imageList: ''
  });

  const [vipFormData, setVipFormData] = useState({
    name: '',
    displayName: '',
    id: '',
    avatarUrl: '',
    videoUrl: '',
    videoList: '',
    imageList: ''
  });

  // Novo estado para anúncios publicitários
  const [adFormData, setAdFormData] = useState({
    productName: '',
    description: '',
    avatarUrl: '',
    buttonText: '',
    buttonColor: '#ffffff',
    backgroundColor: '#000000',
    linkUrl: '',
    effect: 'fade',
    timeUnit: 'seconds',
    timeValue: 30,
    showHours: [],
    maxDailyShows: 3,
    durationDays: 7,
    sponsoredText: 'Anúncio Patrocinado anuncie aqui',
    sponsoredLinkUrl: '',
    backgroundOpacity: 80,
    testVideoUrl: '' // Para demonstração apenas no painel - não sai do painel
  });

  const [offerForm, setOfferForm] = useState({
    title: '',
    description: '',
    image_url: '',
    button_text: '',
    button_link: '',
    button_color: '#ffffff',
    button_effect: 'none',
    duration_seconds: 5,
    show_times: 1,
    start_at: '',
    end_at: '',
    ad_text: '',
    ad_text_link: '',
  });

  // Get the current form data based on content type
  const currentFormData = contentType === 'normal' ? normalFormData : vipFormData;
  const setCurrentFormData = contentType === 'normal' ? setNormalFormData : setVipFormData;

  // Pre-populate form when editing
  React.useEffect(() => {
    if (editingContent) {
      const formDataToSet = {
        name: editingContent.name || '',
        displayName: editingContent.displayName || '',
        id: editingContent.id || '',
        avatarUrl: editingContent.avatarUrl || '',
        videoUrl: editingContent.videoUrl || '',
        videoList: Array.isArray(editingContent.videoList) ? editingContent.videoList.join('\n') : (editingContent.videoList || ''),
        imageList: Array.isArray(editingContent.imageList) ? editingContent.imageList.join('\n') : (editingContent.imageList || '')
      };
      
      if (editingContent.platform === 'premium') {
        setVipFormData(formDataToSet);
        setContentType('vip');
      } else {
        setNormalFormData(formDataToSet);
        setContentType('normal');
      }
    } else {
      // Reset both forms when not editing
      setNormalFormData({
        name: '',
        displayName: '',
        id: '',
        avatarUrl: '',
        videoUrl: '',
        videoList: '',
        imageList: ''
      });
      setVipFormData({
        name: '',
        displayName: '',
        id: '',
        avatarUrl: '',
        videoUrl: '',
        videoList: '',
        imageList: ''
      });
      setContentType('normal');
    }
  }, [editingContent, isOpen]);

  // Gerar ID automaticamente baseado no nome
  const generateId = (name: string) => {
    const timestamp = Math.floor(Date.now() / 1000);
    const cleanName = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `${cleanName}_${timestamp}`;
  };

  const handleNameChange = (value: string) => {
    setCurrentFormData(prev => ({
      ...prev,
      name: value,
      id: generateId(value)
    }));
  };

  // Helper functions to parse lists (sanitize + limit)
  const parseVideoList = (videoList: string | string[]) => {
    const lines = Array.isArray(videoList) ? videoList : (videoList || '').split('\n');
    const items = lines
      .map((l) => (typeof l === 'string' ? l.trim() : ''))
      .filter(Boolean)
      .map((u) => {
        // add protocol if it looks like a domain
        if (!/^https?:\/\//i.test(u) && /^[\w.-]+\.[\w.-]+/.test(u)) {
          return `https://${u}`;
        }
        return u;
      })
      .filter((u) => /^https?:\/\//i.test(u) && /(\.(mp4|webm|m3u8))(\?.*)?$/i.test(u));

    // de-duplicate and cap to 10
    return Array.from(new Set(items)).slice(0, 10);
  };

  const parseImageList = (imageList: string | string[]) => {
    const lines = Array.isArray(imageList) ? imageList : (imageList || '').split('\n');
    const items = lines
      .map((l) => (typeof l === 'string' ? l.trim() : ''))
      .filter(Boolean)
      .map((u) => {
        if (!/^https?:\/\//i.test(u) && /^[\w.-]+\.[\w.-]+/.test(u)) {
          return `https://${u}`;
        }
        return u;
      })
      .filter((u) => /^https?:\/\//i.test(u) && /(\.(jpg|jpeg|png|gif|webp))(\?.*)?$/i.test(u));

    return Array.from(new Set(items)).slice(0, 15);
  };
  // Função para formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    // Para anúncios, validamos campos específicos
    if (contentType === 'ad') {
      if (!adFormData.productName || !adFormData.description || !adFormData.buttonText || !adFormData.linkUrl) {
        toast({
          title: "❌ Campos obrigatórios para anúncios",
          description: "Preencha nome do produto, descrição, texto do botão e link",
          variant: "destructive",
        });
        return;
      }

      // Criamos o anúncio SEM o vídeo de teste (testVideoUrl não é incluído)
      const newAd = {
        type: 'advertisement',
        productName: adFormData.productName,
        description: adFormData.description,
        avatarUrl: adFormData.avatarUrl,
        buttonText: adFormData.buttonText,
        buttonColor: adFormData.buttonColor,
        backgroundColor: adFormData.backgroundColor,
        linkUrl: adFormData.linkUrl,
        effect: adFormData.effect,
        timeUnit: adFormData.timeUnit,
        timeValue: adFormData.timeValue,
        maxDailyShows: adFormData.maxDailyShows,
        durationDays: adFormData.durationDays,
        sponsoredText: adFormData.sponsoredText,
        sponsoredLinkUrl: adFormData.sponsoredLinkUrl,
        backgroundOpacity: adFormData.backgroundOpacity,
        status: 'active'
        // NOTE: testVideoUrl é propositalmente EXCLUÍDO - fica apenas no painel
      };

      onSubmit(newAd);
      
      toast({
        title: "✅ Anúncio criado com sucesso!",
        description: `${adFormData.productName} foi enviado para o aplicativo (vídeo de teste permanece apenas no painel)`,
      });

      // Reset apenas o form de anúncios
      setAdFormData({
        productName: '',
        description: '',
        avatarUrl: '',
        buttonText: '',
        buttonColor: '#ffffff',
        backgroundColor: '#000000',
        linkUrl: '',
        effect: 'fade',
        timeUnit: 'seconds',
        timeValue: 30,
        showHours: [],
        maxDailyShows: 3,
        durationDays: 7,
        sponsoredText: 'Anúncio Patrocinado anuncie aqui',
        sponsoredLinkUrl: '',
        backgroundOpacity: 80,
        testVideoUrl: ''
      });
      
      onClose();
      return;
    }

    // Para conteúdo normal e VIP
    if (!currentFormData.name || !currentFormData.displayName || !currentFormData.avatarUrl) {
      toast({
        title: "❌ Campos obrigatórios",
        description: "Preencha pelo menos nome, nome de exibição e avatar",
        variant: "destructive",
      });
      return;
    }

    const parsedList = parseVideoList(currentFormData.videoList);

    if (uploadMode === 'single') {
      if (!currentFormData.videoUrl) {
        toast({
          title: "❌ Vídeo obrigatório",
          description: "Informe a URL de um único vídeo",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!parsedList.length) {
        toast({
          title: "❌ Lista vazia",
          description: "Adicione ao menos 1 link de vídeo (um por linha)",
          variant: "destructive",
        });
        return;
      }
    }

    const newContent = {
      ...currentFormData,
      videoUrl: uploadMode === 'single' ? currentFormData.videoUrl : '',
      videoList: uploadMode === 'list' ? parsedList : [],
      imageList: parseImageList(currentFormData.imageList),
      platform: contentType === 'vip' ? 'premium' : 'standard',
      offer: offerForm.title && offerForm.button_link ? offerForm : undefined,
      views: '0',
      likes: '0',
      schedule: '09:00-18:00',
      status: 'active',
      uploadMode
    };

    // Se for conteúdo VIP (Top 10), salvar também como modelo na tabela models
    if (contentType === 'vip') {
      await saveModelToDatabase(newContent);
    }

    onSubmit(newContent);
    
    toast({
      title: editingContent ? "✅ Conteúdo atualizado!" : "✅ Conteúdo criado com sucesso!",
      description: `${currentFormData.displayName} foi ${editingContent ? 'atualizado' : 'adicionado'} como ${contentType === 'vip' ? 'Top 10' : contentType === 'ad' ? 'Anúncio' : 'Normal'}`,
    });

    // Reset forms
    setNormalFormData({
      name: '',
      displayName: '',
      id: '',
      avatarUrl: '',
      videoUrl: '',
      videoList: '',
      imageList: ''
    });
    setVipFormData({
      name: '',
      displayName: '',
      id: '',
      avatarUrl: '',
      videoUrl: '',
      videoList: '',
      imageList: ''
    });
    
    onClose();
  };

  // Função para salvar modelo na tabela models
  const saveModelToDatabase = async (contentData: any) => {
    try {
      const modelData = {
        name: contentData.displayName,
        username: contentData.name.toLowerCase().replace(/\s+/g, '_'),
        avatar_url: contentData.avatarUrl,
        bio: `Modelo VIP criado via painel - ${contentData.displayName}`,
        followers_count: Math.floor(Math.random() * 50000) + 10000, // Seguidores aleatórios entre 10k-60k
        is_premium: true,
        is_verified: true,
        is_active: true,
        category: 'premium',
        posting_panel_url: contentData.videoUrl || (contentData.videoList && contentData.videoList[0]) || null
      };

      const { data, error } = await supabase
        .from('models')
        .insert([modelData])
        .select()
        .single();

      if (error) {
        console.error('Erro ao salvar modelo:', error);
        toast({
          title: "⚠️ Aviso",
          description: "Conteúdo criado, mas houve erro ao registrar como modelo",
          variant: "destructive",
        });
        return;
      }

      // Se tem vídeos, criar registros na tabela videos
      if (contentData.videoList && contentData.videoList.length > 0) {
        const videoRecords = contentData.videoList.map((videoUrl: string, index: number) => ({
          title: `Vídeo ${index + 1} - ${contentData.displayName}`,
          description: `Conteúdo premium de ${contentData.displayName}`,
          video_url: videoUrl,
          thumbnail_url: contentData.avatarUrl,
          model_id: data.id,
          visibility: 'premium',
          is_active: true,
          music_name: 'Som Original'
        }));

        await supabase
          .from('videos')
          .insert(videoRecords);
      } else if (contentData.videoUrl) {
        await supabase
          .from('videos')
          .insert([{
            title: `Vídeo Principal - ${contentData.displayName}`,
            description: `Conteúdo premium de ${contentData.displayName}`,
            video_url: contentData.videoUrl,
            thumbnail_url: contentData.avatarUrl,
            model_id: data.id,
            visibility: 'premium',
            is_active: true,
            music_name: 'Som Original'
          }]);
      }

      console.log('✅ Modelo salvo com sucesso:', data);
      toast({
        title: "✅ Modelo registrado!",
        description: `${contentData.displayName} foi adicionado aos dados reais do sistema`,
      });

    } catch (error) {
      console.error('Erro inesperado ao salvar modelo:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCurrentFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-lg">
            <Crown className="w-5 h-5 text-accent" />
            <span>{editingContent ? `Editar Conteúdo — ${editingContent.name || ''}` : 'Novo Conteúdo'}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={contentType} onValueChange={setContentType} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="normal" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Vídeo Único</span>
            </TabsTrigger>
            <TabsTrigger value="vip" className="flex items-center space-x-2">
              <Crown className="w-4 h-4" />
              <span>Conteúdo Top 10</span>
            </TabsTrigger>
            <TabsTrigger value="ad" className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4" />
              <span>Anúncios</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="normal" className="space-y-4 mt-6 p-6 rounded-lg border border-yellow-400/30 bg-black text-yellow-400">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
                  <Input
                    id="name"
                    value={normalFormData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setNormalFormData(prev => ({
                        ...prev,
                        name: value,
                        id: generateId(value)
                      }));
                    }}
                    placeholder="Digite o nome completo"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="displayName" className="text-sm font-medium">Nome de Exibição</Label>
                  <Input
                    id="displayName"
                    value={normalFormData.displayName}
                    onChange={(e) => setNormalFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Nome que aparecerá na plataforma"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="id" className="text-sm font-medium">ID (gerado automaticamente)</Label>
                  <Input
                    id="id"
                    value={normalFormData.id}
                    readOnly
                    className="mt-1 bg-muted"
                    placeholder="ID será gerado automaticamente"
                  />
                </div>

                <div>
                  <Label htmlFor="avatarUrl" className="text-sm font-medium">Avatar (URL)</Label>
                  <Input
                    id="avatarUrl"
                    value={normalFormData.avatarUrl}
                    onChange={(e) => setNormalFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://exemplo.com/avatar.jpg"
                    className="mt-1"
                  />
                </div>


                <div>
                  <Label className="text-sm font-medium">Modo de envio</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant={uploadMode === 'single' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('single')}
                    >
                      Vídeo único
                    </Button>
                    <Button
                      type="button"
                      variant={uploadMode === 'list' ? 'default' : 'outline'}
                      onClick={() => setUploadMode('list')}
                    >
                      Lista de vídeos
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Escolha entre enviar 1 vídeo ou vários vídeos (um link por linha).</p>
                </div>

                {uploadMode === 'single' && (
                  <div>
                    <Label htmlFor="videoUrl" className="text-sm font-medium">Vídeo (URL) - único</Label>
                    <Input
                      id="videoUrl"
                      value={normalFormData.videoUrl}
                      onChange={(e) => setNormalFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                      placeholder="https://exemplo.com/video.mp4"
                      className="mt-1"
                    />
                  </div>
                )}

                {uploadMode === 'list' && (
                  <div className="mt-3">
                    <Label htmlFor="videoList" className="text-sm font-medium">Lista de Vídeos (um por linha)</Label>
                    <Textarea
                      id="videoList"
                      value={normalFormData.videoList}
                      onChange={(e) => setNormalFormData(prev => ({ ...prev, videoList: e.target.value }))}
                      placeholder={"https://exemplo.com/video1.mp4\nhttps://exemplo.com/video2.mp4"}
                      rows={3}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Aceita .mp4, .webm, .m3u8. Máx. 10 links; duplicados serão ignorados.</p>
                  </div>
                )}

                <div className="mt-6 space-y-3">
                  <Label className="text-sm font-medium">Oferta do dia</Label>
                  <Input placeholder="Nome da oferta" value={offerForm.title} onChange={(e)=>setOfferForm(p=>({...p,title:e.target.value}))} />
                  <Textarea placeholder="Descrição" value={offerForm.description} onChange={(e)=>setOfferForm(p=>({...p,description:e.target.value}))} rows={2} />
                  <Input placeholder="Imagem da oferta (300x300)" value={offerForm.image_url} onChange={(e)=>setOfferForm(p=>({...p,image_url:e.target.value}))} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Texto do botão" value={offerForm.button_text} onChange={(e)=>setOfferForm(p=>({...p,button_text:e.target.value}))} />
                    <Input placeholder="Link do botão" value={offerForm.button_link} onChange={(e)=>setOfferForm(p=>({...p,button_link:e.target.value}))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Cor do botão</Label>
                      <Input type="color" value={offerForm.button_color} onChange={(e)=>setOfferForm(p=>({...p,button_color:e.target.value}))} className="w-16 h-10 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Efeito</Label>
                      <select className="w-full h-10 rounded-md bg-background border border-border" value={offerForm.button_effect} onChange={(e)=>setOfferForm(p=>({...p,button_effect:e.target.value}))}>
                        <option value="none">Sem efeito</option>
                        <option value="pulse">Pulse</option>
                        <option value="bounce">Bounce</option>
                        <option value="glow">Glow</option>
                        <option value="wiggle">Wiggle</option>
                        <option value="shake">Shake</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Segundos</Label>
                      <Input type="number" min={1} max={60} value={offerForm.duration_seconds} onChange={(e)=>setOfferForm(p=>({...p,duration_seconds:parseInt(e.target.value||'0')||1}))} />
                    </div>
                    <div>
                      <Label className="text-xs">Quantas vezes</Label>
                      <Input type="number" min={1} max={10} value={offerForm.show_times} onChange={(e)=>setOfferForm(p=>({...p,show_times:parseInt(e.target.value||'0')||1}))} />
                    </div>
                    <div>
                      <Label className="text-xs">Anuncie aqui (texto)</Label>
                      <Input placeholder="anuncie aqui" value={offerForm.ad_text} onChange={(e)=>setOfferForm(p=>({...p,ad_text:e.target.value}))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Link do texto</Label>
                      <Input placeholder="https://..." value={offerForm.ad_text_link} onChange={(e)=>setOfferForm(p=>({...p,ad_text_link:e.target.value}))} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Início</Label>
                        <Input type="datetime-local" value={offerForm.start_at} onChange={(e)=>setOfferForm(p=>({...p,start_at:e.target.value}))} />
                      </div>
                      <div>
                        <Label className="text-xs">Fim</Label>
                        <Input type="datetime-local" value={offerForm.end_at} onChange={(e)=>setOfferForm(p=>({...p,end_at:e.target.value}))} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">📄 Pré-visualização do Avatar</Label>
                  <div className="mt-2 w-24 h-24 bg-muted rounded-full flex items-center justify-center border-2 border-border relative overflow-hidden">
                    {normalFormData.avatarUrl ? (
                      <img 
                        src={normalFormData.avatarUrl} 
                        alt="Preview Avatar" 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.display = 'block';
                        }}
                      />
                    ) : (
                      <User className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  {normalFormData.displayName && (
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-foreground">{normalFormData.displayName}</p>
                      <p className="text-xs text-muted-foreground">Vídeo Único</p>
                    </div>
                  )}
                </div>

                {/* Pré-visualização do Vídeo / Lista */}
                <div>
                  <Label className="text-sm font-medium">📱 Pré-visualização do Vídeo</Label>
                  <div className="relative mt-2 w-72 h-[400px] bg-black rounded-xl overflow-hidden mx-auto">
                    {uploadMode === 'list' ? (
                      parseVideoList(normalFormData.videoList).length ? (
                        <VideoCarousel videos={parseVideoList(normalFormData.videoList)} className="w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Adicione links de vídeo (um por linha)</div>
                      )
                    ) : normalFormData.videoUrl ? (
                      <video src={normalFormData.videoUrl} className="w-full h-full object-cover" autoPlay muted loop />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">Informe a URL do vídeo</div>
                    )}

                    {offerForm.title && (
                      <div className="absolute inset-0 bg-background/70 flex items-center justify-center p-4">
                        <div className="bg-card rounded-xl p-4 w-full max-w-xs text-center space-y-2 border border-border/50">
                          {offerForm.image_url && (
                            <img src={offerForm.image_url} alt={offerForm.title} className="w-24 h-24 rounded-md object-cover mx-auto" />
                          )}
                          <div className="text-sm font-semibold text-foreground">{offerForm.title}</div>
                          {offerForm.description && <div className="text-xs text-muted-foreground">{offerForm.description}</div>}
                          <button
                            className={`px-4 py-2 rounded-md font-medium ${offerForm.button_effect === 'pulse' ? 'animate-pulse' : offerForm.button_effect === 'bounce' ? 'animate-bounce' : ''}`}
                            style={{ backgroundColor: offerForm.button_color || undefined, color: '#000' }}
                          >
                            {offerForm.button_text || 'Comprar agora'}
                          </button>
                          {offerForm.ad_text && (
                            <a href={offerForm.ad_text_link || '#'} target="_blank" rel="noreferrer" className="block text-xs text-accent underline">
                              {offerForm.ad_text}
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vip" className="space-y-4 mt-6 p-6 rounded-lg border border-accent/30 text-black" style={{ backgroundImage: 'linear-gradient(to left bottom, #ffb200, #fdb410, #fbb61b, #fab724, #f8b92b, #f8b92b, #f8b92b, #f8b92b, #fab724, #fbb61b, #fdb410, #ffb200)' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Form Fields VIP */}
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg border border-accent/20">
                  <p className="text-sm text-black font-medium flex items-center">
                    <Crown className="w-4 h-4 mr-2" />
                    Conteúdo Top 10 - Recursos Premium
                  </p>
                  <p className="text-xs text-black mt-1">
                    Este conteúdo será bloqueado e liberado apenas para usuários Top 10
                  </p>
                </div>

                <div>
                  <Label htmlFor="vip-name" className="text-sm font-medium text-black">Nome</Label>
                  <Input
                    id="vip-name"
                    value={vipFormData.name}
                    onChange={(e) => {
                      const value = e.target.value;
                      setVipFormData(prev => ({
                        ...prev,
                        name: value,
                        id: generateId(value)
                      }));
                    }}
                    placeholder="Digite o nome completo"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="vip-displayName" className="text-sm font-medium text-black">Nome de Exibição</Label>
                  <Input
                    id="vip-displayName"
                    value={vipFormData.displayName}
                    onChange={(e) => setVipFormData(prev => ({ ...prev, displayName: e.target.value }))}
                    placeholder="Nome que aparecerá na plataforma"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="vip-id" className="text-sm font-medium text-black">ID (gerado automaticamente)</Label>
                  <Input
                    id="vip-id"
                    value={vipFormData.id}
                    readOnly
                    className="mt-1 bg-muted"
                    placeholder="ID será gerado automaticamente"
                  />
                </div>

                <div>
                  <Label htmlFor="vip-avatarUrl" className="text-sm font-medium text-black">Avatar (URL)</Label>
                  <Input
                    id="vip-avatarUrl"
                    value={vipFormData.avatarUrl}
                    onChange={(e) => setVipFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://exemplo.com/avatar.jpg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="vip-videoUrl" className="text-sm font-medium text-black">Video Principal Top 10 (URL)</Label>
                  <Input
                    id="vip-videoUrl"
                    value={vipFormData.videoUrl}
                    onChange={(e) => setVipFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://exemplo.com/video.mp4"
                    className="mt-1"
                  />
                </div>

                <div className="mt-6 space-y-3">
                  <Label className="text-sm font-medium text-black">Oferta do dia</Label>
                  <Input placeholder="Nome da oferta" value={offerForm.title} onChange={(e)=>setOfferForm(p=>({...p,title:e.target.value}))} />
                  <Textarea placeholder="Descrição" value={offerForm.description} onChange={(e)=>setOfferForm(p=>({...p,description:e.target.value}))} rows={2} />
                  <Input placeholder="Imagem da oferta (300x300)" value={offerForm.image_url} onChange={(e)=>setOfferForm(p=>({...p,image_url:e.target.value}))} />
                  <div className="grid grid-cols-2 gap-2">
                    <Input placeholder="Texto do botão" value={offerForm.button_text} onChange={(e)=>setOfferForm(p=>({...p,button_text:e.target.value}))} />
                    <Input placeholder="Link do botão" value={offerForm.button_link} onChange={(e)=>setOfferForm(p=>({...p,button_link:e.target.value}))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="flex items-center gap-2">
                      <Label className="text-xs">Cor do botão</Label>
                      <Input type="color" value={offerForm.button_color} onChange={(e)=>setOfferForm(p=>({...p,button_color:e.target.value}))} className="w-16 h-10 p-1" />
                    </div>
                    <div>
                      <Label className="text-xs">Efeito</Label>
                      <select className="w-full h-10 rounded-md bg-background border border-border" value={offerForm.button_effect} onChange={(e)=>setOfferForm(p=>({...p,button_effect:e.target.value}))}>
                        <option value="none">Sem efeito</option>
                        <option value="pulse">Pulse</option>
                        <option value="bounce">Bounce</option>
                        <option value="glow">Glow</option>
                        <option value="wiggle">Wiggle</option>
                        <option value="shake">Shake</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Segundos</Label>
                      <Input type="number" min={1} max={60} value={offerForm.duration_seconds} onChange={(e)=>setOfferForm(p=>({...p,duration_seconds:parseInt(e.target.value||'0')||1}))} />
                    </div>
                    <div>
                      <Label className="text-xs">Quantas vezes</Label>
                      <Input type="number" min={1} max={10} value={offerForm.show_times} onChange={(e)=>setOfferForm(p=>({...p,show_times:parseInt(e.target.value||'0')||1}))} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs">Início</Label>
                      <Input type="datetime-local" value={offerForm.start_at} onChange={(e)=>setOfferForm(p=>({...p,start_at:e.target.value}))} />
                    </div>
                    <div>
                      <Label className="text-xs">Fim</Label>
                      <Input type="datetime-local" value={offerForm.end_at} onChange={(e)=>setOfferForm(p=>({...p,end_at:e.target.value}))} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section VIP */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-white">🔎 Pré-visualização Top 10</Label>
                  <div className="mt-2 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center border-2 border-accent/30 relative overflow-hidden">
                    {vipFormData.avatarUrl ? (
                      <img 
                        src={vipFormData.avatarUrl} 
                        alt="Preview VIP Avatar" 
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                        onLoad={(e) => {
                          e.currentTarget.style.display = 'block';
                        }}
                      />
                    ) : (
                      <Crown className="w-8 h-8 text-accent" />
                    )}
                    {vipFormData.avatarUrl && (
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full"></div>
                    )}
                  </div>
                  {vipFormData.displayName && (
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium text-white flex items-center justify-center">
                        <Crown className="w-4 h-4 mr-1" />
                        {vipFormData.displayName}
                      </p>
                      <p className="text-xs text-gray-300">Conteúdo Top 10 Premium</p>
                    </div>
                  )}
                </div>

                {/* VIP Video Carousel Preview no Celular */}
                <div>
                  <Label className="text-sm font-medium text-white">👑 Pré-visualização do Vídeo Top 10</Label>
                  <div className="relative mt-2 w-72 h-[400px] bg-black rounded-xl overflow-hidden mx-auto">
                    {vipFormData.videoUrl ? (
                      <video src={vipFormData.videoUrl} className="w-full h-full object-cover" autoPlay muted loop />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-200 text-sm">Informe a URL do vídeo</div>
                    )}

                    {offerForm.title && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
                        <div className="bg-white/90 rounded-xl p-4 w-full max-w-xs text-center space-y-2">
                          {offerForm.image_url && (
                            <img src={offerForm.image_url} alt={offerForm.title} className="w-24 h-24 rounded-md object-cover mx-auto" />
                          )}
                          <div className="text-sm font-semibold text-black">{offerForm.title}</div>
                          {offerForm.description && <div className="text-xs text-gray-700">{offerForm.description}</div>}
                          <button
                            className={`px-4 py-2 rounded-md font-medium ${offerForm.button_effect === 'pulse' ? 'animate-pulse' : offerForm.button_effect === 'bounce' ? 'animate-bounce' : ''}`}
                            style={{ backgroundColor: offerForm.button_color || undefined, color: '#000' }}
                          >
                            {offerForm.button_text || 'Comprar agora'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* VIP Image Carousel Preview */}
                <div>
                  <Label className="text-sm font-medium text-white">👑 Carrossel de Imagens Top 10</Label>
                  <ImageCarousel 
                    images={parseImageList(vipFormData.imageList)}
                    className="mt-2 border-accent/30"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ad" className="space-y-4 mt-6 p-6 rounded-lg" style={{ backgroundImage: 'linear-gradient(to bottom, #ff0091, #e633ac, #c64cc0, #a25dcc, #7b69d0, #5973d1, #347bcd, #0080c5, #0087bc, #008cad, #008f9a, #199088)' }}>
            <div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-4 rounded-lg border border-orange-500/30 mb-6">
              <h3 className="text-lg font-semibold text-orange-200 flex items-center mb-2">
                <Megaphone className="w-5 h-5 mr-2" />
                Sistema de Anúncios Publicitários
              </h3>
              <p className="text-sm text-orange-100/80">
                Configure anúncios inteligentes com controle de exibição e rastreamento por dispositivo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Formulário de Anúncio */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ad-productName" className="text-sm font-medium">Nome do Produto</Label>
                  <Input
                    id="ad-productName"
                    value={adFormData.productName}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, productName: e.target.value }))}
                    placeholder="Digite o nome do produto"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ad-description" className="text-sm font-medium">Descrição do Produto</Label>
                  <Textarea
                    id="ad-description"
                    value={adFormData.description}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva o produto digital..."
                    className="mt-1 min-h-[80px]"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="ad-avatarUrl" className="text-sm font-medium">Avatar do Produto (URL)</Label>
                  <Input
                    id="ad-avatarUrl"
                    value={adFormData.avatarUrl}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://exemplo.com/produto.jpg"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ad-sponsoredText" className="text-sm font-medium">Texto Patrocinado</Label>
                  <Input
                    id="ad-sponsoredText"
                    value={adFormData.sponsoredText}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, sponsoredText: e.target.value }))}
                    placeholder="Anúncio Patrocinado anuncie aqui"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="ad-sponsoredLinkUrl" className="text-sm font-medium">Link do Texto Patrocinado</Label>
                  <Input
                    id="ad-sponsoredLinkUrl"
                    value={adFormData.sponsoredLinkUrl}
                    onChange={(e) => setAdFormData(prev => ({ ...prev, sponsoredLinkUrl: e.target.value }))}
                    placeholder="https://seusite.com/anuncio"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Link que será aplicado no texto patrocinado (abre em nova aba)</p>
                </div>

                 <div>
                   <Label htmlFor="ad-backgroundOpacity" className="text-sm font-medium">Transparência do Fundo (%)</Label>
                   <Input
                     id="ad-backgroundOpacity"
                     type="range"
                     min="0"
                     max="100"
                     value={adFormData.backgroundOpacity}
                     onChange={(e) => setAdFormData(prev => ({ ...prev, backgroundOpacity: parseInt(e.target.value) }))}
                     className="mt-1"
                   />
                   <div className="text-xs text-muted-foreground mt-1">Atual: {adFormData.backgroundOpacity}%</div>
                 </div>

                 <div>
                   <Label htmlFor="ad-testVideoUrl" className="text-sm font-medium">Vídeo de Teste/Demonstração (somente no painel)</Label>
                   <Input
                     id="ad-testVideoUrl"
                     value={adFormData.testVideoUrl}
                     onChange={(e) => setAdFormData(prev => ({ ...prev, testVideoUrl: e.target.value }))}
                     placeholder="https://exemplo.com/video-demonstracao.mp4"
                     className="mt-1"
                   />
                   <p className="text-xs text-muted-foreground mt-1">Este vídeo só aparece no painel para teste - não será enviado para o aplicativo</p>
                 </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ad-buttonText" className="text-sm font-medium">Texto do Botão</Label>
                    <Input
                      id="ad-buttonText"
                      value={adFormData.buttonText}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                      placeholder="Comprar Agora"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ad-linkUrl" className="text-sm font-medium">Link de Direcionamento</Label>
                    <Input
                      id="ad-linkUrl"
                      value={adFormData.linkUrl}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                      placeholder="https://seusite.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Configurações de Cores */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ad-buttonColor" className="text-sm font-medium flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Cor do Botão
                    </Label>
                    <Input
                      id="ad-buttonColor"
                      type="color"
                      value={adFormData.buttonColor}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, buttonColor: e.target.value }))}
                      className="mt-1 h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ad-backgroundColor" className="text-sm font-medium flex items-center">
                      <Palette className="w-4 h-4 mr-2" />
                      Cor de Fundo
                    </Label>
                    <Input
                      id="ad-backgroundColor"
                      type="color"
                      value={adFormData.backgroundColor}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="mt-1 h-10"
                    />
                  </div>
                </div>

                {/* Efeitos de Animação */}
                <div>
                  <Label className="text-sm font-medium flex items-center mb-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Efeito de Animação
                  </Label>
                  <Select value={adFormData.effect} onValueChange={(value) => setAdFormData(prev => ({ ...prev, effect: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolha um efeito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fade">Fade In/Out</SelectItem>
                      <SelectItem value="slide">Slide from Bottom</SelectItem>
                      <SelectItem value="bounce">Bounce Effect</SelectItem>
                      <SelectItem value="zoom">Zoom In/Out</SelectItem>
                      <SelectItem value="pulse">Pulse Effect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Configurações de Tempo */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex items-center mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      Unidade de Tempo
                    </Label>
                    <Select value={adFormData.timeUnit} onValueChange={(value) => setAdFormData(prev => ({ ...prev, timeUnit: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seconds">Segundos</SelectItem>
                        <SelectItem value="hours">Horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ad-timeValue" className="text-sm font-medium">
                      {adFormData.timeUnit === 'seconds' ? 'Tempo (segundos)' : 'Intervalo (horas)'}
                    </Label>
                    <Input
                      id="ad-timeValue"
                      type="number"
                      min="1"
                      max={adFormData.timeUnit === 'seconds' ? 3600 : 24}
                      value={adFormData.timeValue}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, timeValue: parseInt(e.target.value) || 1 }))}
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Configurações de Exibição */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ad-maxDaily" className="text-sm font-medium">Máx. por Dia</Label>
                    <Input
                      id="ad-maxDaily"
                      type="number"
                      min="1"
                      max="50"
                      value={adFormData.maxDailyShows}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, maxDailyShows: parseInt(e.target.value) || 1 }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ad-duration" className="text-sm font-medium flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Duração (dias)
                    </Label>
                    <Input
                      id="ad-duration"
                      type="number"
                      min="1"
                      max="365"
                      value={adFormData.durationDays}
                      onChange={(e) => setAdFormData(prev => ({ ...prev, durationDays: parseInt(e.target.value) || 1 }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Preview do Card do Anúncio */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">🎯 Pré-visualização Real do Anúncio</Label>
                  <div 
                    className="mt-2 p-6 rounded-lg border-2 border-dashed border-border relative overflow-hidden"
                    style={{ 
                      backgroundColor: `${adFormData.backgroundColor}${Math.round((adFormData.backgroundOpacity / 100) * 255).toString(16).padStart(2, '0')}`
                    }}
                  >
                    {/* Texto Patrocinado no topo esquerdo - CLICÁVEL */}
                    <div 
                      className="absolute top-2 left-2 flex items-center text-yellow-400 text-sm font-bold cursor-pointer hover:text-yellow-300 transition-colors"
                      onClick={() => adFormData.sponsoredLinkUrl && window.open(adFormData.sponsoredLinkUrl, '_blank')}
                      title={adFormData.sponsoredLinkUrl ? 'Clique para abrir o anúncio' : 'Configure o link do anúncio'}
                    >
                      <Hand className="w-4 h-4 mr-1 animate-pulse" />
                      <span>{adFormData.sponsoredText}</span>
                    </div>

                    {/* Avatar do Produto */}
                    <div className="flex items-center justify-center mb-4 mt-8">
                      <div className="w-[130px] h-[130px] rounded-full border-4 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                        {adFormData.avatarUrl ? (
                          <img 
                            src={adFormData.avatarUrl} 
                            alt="Product" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <Megaphone className="w-8 h-8 text-white/60" />
                        )}
                      </div>
                    </div>

                    {/* Botão X de fechar */}
                    <button className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg z-10">
                      <span className="text-black text-xs font-bold">×</span>
                    </button>

                    {/* Conteúdo do Anúncio */}
                    <div className="text-center text-white">
                      <h4 className="text-lg font-bold mb-2">
                        {adFormData.productName || 'Nome do Produto'}
                      </h4>
                      <p className="text-sm opacity-90 mb-4">
                        {adFormData.description || 'Descrição do produto aparecerá aqui...'}
                      </p>
                      
                       {/* Botão do Anúncio com Preview do Efeito */}
                      <button 
                        onClick={() => adFormData.linkUrl && window.open(adFormData.linkUrl, '_blank')}
                        className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:shadow-lg flex items-center justify-center mx-auto cursor-pointer ${
                          adFormData.effect === 'bounce' ? 'animate-bounce' :
                          adFormData.effect === 'pulse' ? 'animate-pulse' :
                          adFormData.effect === 'zoom' ? 'hover:scale-110' :
                          adFormData.effect === 'slide' ? 'transform hover:translate-y-[-2px]' :
                          'hover:opacity-80'
                        }`}
                        style={{ 
                          backgroundColor: adFormData.buttonColor,
                          color: adFormData.buttonColor === '#ffffff' ? '#000000' : '#ffffff'
                        }}
                        disabled={!adFormData.linkUrl}
                      >
                        {adFormData.buttonText || 'Comprar Agora'}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </button>
                    </div>

                    {/* Indicador de Efeito */}
                    <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs text-white/80 capitalize">{adFormData.effect}</span>
                    </div>
                  </div>
                </div>

                {/* Configurações de Tempo Visual */}
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Configurações de Exibição
                  </h4>
                    <div className="space-y-2 text-xs text-black">
                      <p>• Tempo: {adFormData.timeValue} {adFormData.timeUnit === 'seconds' ? 'segundos' : 'horas'}</p>
                      <p>• Máximo diário: {adFormData.maxDailyShows} exibições</p>
                      <p>• Duração: {adFormData.durationDays} dias</p>
                      <p>• Efeito: {adFormData.effect}</p>
                      <p>• Link: {adFormData.linkUrl || 'Não configurado'}</p>
                    </div>
                </div>

                {/* Informações sobre API */}
                <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                  <h4 className="text-sm font-medium text-blue-200 mb-2">🔧 Controle por Dispositivo</h4>
                  <p className="text-xs text-blue-100/80">
                    O sistema registra automaticamente a API do dispositivo para evitar exibições repetidas 
                    conforme as configurações de tempo e quantidade definidas.
                  </p>
                </div>
              </div>
            </div>

            {/* SEÇÃO SEPARADA: Vídeo de Demonstração em Formato Mobile - APENAS PARA TESTE NO PAINEL */}
            {adFormData.testVideoUrl && (
              <div className="mt-8 border-t-2 border-orange-500/30 pt-6">
                <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 p-4 rounded-lg border border-orange-500/30 mb-6">
                  <h3 className="text-lg font-semibold text-orange-200 flex items-center mb-2">
                    <Play className="w-5 h-5 mr-2" />
                    Demonstração Visual do Anúncio no Mobile
                  </h3>
                  <p className="text-sm text-orange-100/80">
                    ⚠️ <strong>Esta demonstração é APENAS para visualização no painel</strong> - o vídeo de teste NÃO será enviado para o aplicativo.
                  </p>
                  <p className="text-xs text-orange-100/60 mt-1">
                    Apenas o anúncio configurado acima será enviado para aparecer sobre os vídeos dos usuários.
                  </p>
                </div>

                <Label className="text-lg font-medium mb-4 block text-center">📱 Prévia: Como o Anúncio Aparecerá no Aplicativo Mobile</Label>
                 <div className="flex justify-center">
                   {/* Moldura do celular realista para demonstração - TAMANHO REAL */}
                   <div className="relative w-80 h-[700px] mx-auto">
                     {/* Moldura do celular */}
                     <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3.5rem] shadow-2xl">
                       {/* Borda interna */}
                       <div className="absolute inset-3 bg-black rounded-[3rem] shadow-inner">
                         {/* Notch superior */}
                         <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-3xl z-20"></div>
                         
                         {/* Câmera */}
                         <div className="absolute top-2.5 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-700 rounded-full z-30"></div>
                         
                         {/* Speaker */}
                         <div className="absolute top-3 left-1/2 transform -translate-x-1/2 translate-x-10 w-12 h-1.5 bg-gray-700 rounded-full z-30"></div>
                         
                         {/* Tela do celular */}
                         <div className="absolute top-10 left-3 right-3 bottom-3 bg-black rounded-[2.5rem] overflow-hidden">
                           {/* Vídeo de fundo - APENAS PARA DEMONSTRAÇÃO */}
                           <video 
                             src={adFormData.testVideoUrl}
                             autoPlay
                             muted
                             loop
                             className="w-full h-full object-cover"
                             onError={(e) => {
                               e.currentTarget.style.display = 'none';
                             }}
                           />
                           
                           {/* Overlay do anúncio sobre o vídeo - ESTE É O QUE SERÁ ENVIADO */}
                           <div 
                             className="absolute inset-x-6 bottom-24 top-24 rounded-xl p-6 flex flex-col items-center justify-center border-2 border-yellow-400/50"
                             style={{ 
                               backgroundColor: `${adFormData.backgroundColor}${Math.round((adFormData.backgroundOpacity / 100) * 255).toString(16).padStart(2, '0')}`,
                               backdropFilter: 'blur(10px)'
                             }}
                           >
                             {/* Indicador visual de que este é o anúncio que será enviado */}
                             <div className="absolute -top-2 -left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                               ✓ ANÚNCIO QUE SERÁ ENVIADO
                             </div>

                             {/* Botão X de fechar */}
                             <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                               <span className="text-black text-lg font-bold">×</span>
                             </button>
                             
                             {/* Texto Patrocinado */}
                             <div className="absolute top-3 left-3 flex items-center text-yellow-400 text-sm font-bold">
                               <Hand className="w-4 h-4 mr-1 animate-pulse" />
                               <span className="text-sm">{adFormData.sponsoredText}</span>
                             </div>

                             {/* Avatar do Produto */}
                             <div className="w-28 h-28 rounded-full border-3 border-white/30 overflow-hidden bg-white/10 flex items-center justify-center mb-4">
                               {adFormData.avatarUrl ? (
                                 <img 
                                   src={adFormData.avatarUrl} 
                                   alt="Product" 
                                   className="w-full h-full object-cover"
                                 />
                               ) : (
                                 <Megaphone className="w-8 h-8 text-white/60" />
                               )}
                             </div>

                             {/* Conteúdo do Anúncio */}
                             <div className="text-center text-white flex-1 flex flex-col justify-center px-3">
                               <h4 className="text-lg font-bold mb-3 line-clamp-2">
                                 {adFormData.productName || 'Nome do Produto'}
                               </h4>
                               <p className="text-sm opacity-90 mb-4 line-clamp-3">
                                 {adFormData.description || 'Descrição do produto aparecerá aqui...'}
                               </p>
                               
                               {/* Botão do Anúncio */}
                               <button 
                                 className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 flex items-center justify-center mx-auto ${
                                   adFormData.effect === 'bounce' ? 'animate-bounce' :
                                   adFormData.effect === 'pulse' ? 'animate-pulse' :
                                   adFormData.effect === 'zoom' ? 'hover:scale-110' :
                                   adFormData.effect === 'slide' ? 'transform hover:translate-y-[-2px]' :
                                   'hover:opacity-80'
                                 }`}
                                 style={{ 
                                   backgroundColor: adFormData.buttonColor,
                                   color: adFormData.buttonColor === '#ffffff' ? '#000000' : '#ffffff'
                                 }}
                               >
                                 {adFormData.buttonText || 'Comprar Agora'}
                                 <ExternalLink className="w-4 h-4 ml-2" />
                               </button>
                             </div>

                             {/* Indicador de Efeito */}
                             <div className="absolute top-3 right-14 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                               <span className="text-white/80 capitalize text-xs">{adFormData.effect}</span>
                             </div>
                           </div>

                           {/* Indicador visual de vídeo de fundo - NÃO SERÁ ENVIADO */}
                           <div className="absolute bottom-4 left-4 bg-red-500/80 text-white px-3 py-1 rounded text-xs font-bold">
                             ⚠️ VÍDEO APENAS PARA TESTE
                           </div>
                         </div>
                       </div>
                       
                       {/* Botões laterais */}
                       <div className="absolute left-0 top-32 w-1.5 h-16 bg-gray-600 rounded-r"></div>
                       <div className="absolute left-0 top-52 w-1.5 h-10 bg-gray-600 rounded-r"></div>
                       <div className="absolute left-0 top-66 w-1.5 h-10 bg-gray-600 rounded-r"></div>
                       <div className="absolute right-0 top-40 w-1.5 h-20 bg-gray-600 rounded-l"></div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="mt-6 bg-red-900/20 p-4 rounded-lg border border-red-500/30">
                   <p className="text-sm text-red-200 font-medium mb-2">🔒 Política de Envio:</p>
                   <div className="text-xs text-red-100/80 space-y-1">
                     <p>✅ <strong>Será enviado:</strong> Configurações do anúncio (textos, cores, botões, efeitos, links)</p>
                     <p>❌ <strong>NÃO será enviado:</strong> Vídeo de demonstração (fica apenas no painel para teste)</p>
                     <p>📱 <strong>No app:</strong> O anúncio aparecerá sobre os vídeos reais dos usuários</p>
                   </div>
                 </div>
               </div>
             )}
           </TabsContent>

           {/* Botões de ação */}
           <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
             <Button variant="outline" onClick={onClose}>
               Cancelar
             </Button>
             <Button 
               onClick={handleSubmit}
               className="bg-gradient-primary hover:shadow-glow text-primary-foreground"
             >
               <Send className="w-4 h-4 mr-2" />
               {editingContent ? 'Atualizar Conteúdo' : 'Enviar Conteúdo'}
             </Button>
           </div>
         </Tabs>
       </DialogContent>
     </Dialog>
   );
 };