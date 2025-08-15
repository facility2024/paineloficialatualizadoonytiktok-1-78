import { useState } from 'react';
import { Gift, Radio } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { GiftExplosion } from './GiftExplosion';
import { supabase } from '@/integrations/supabase/client';

interface BonusGiftProps {
  isMobile?: boolean;
}

export const BonusGift = ({ isMobile = false }: BonusGiftProps) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: ''
  });

  const handleGiftClick = () => {
    setShowExplosion(true);
  };

  const handleContinue = () => {
    setShowInfo(false);
    setShowForm(true);
  };

  const validateGmail = (email: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    
    // Verificação básica de formato de email válido
    const basicEmailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._-]*[a-zA-Z0-9])?@gmail\.com$/;
    
    // Verificações adicionais para email autêntico
    if (!basicEmailRegex.test(cleanEmail)) {
      return false;
    }
    
    const localPart = cleanEmail.split('@')[0];
    
    // Não pode começar ou terminar com ponto
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }
    
    // Não pode ter pontos consecutivos
    if (localPart.includes('..')) {
      return false;
    }
    
    // Deve ter pelo menos 1 caractere antes do @
    if (localPart.length < 1) {
      return false;
    }
    
    // Não pode ter apenas números (para evitar emails fake como 123456@gmail.com)
    if (/^\d+$/.test(localPart)) {
      return false;
    }
    
    return true;
  };

  const validateWhatsApp = (phone: string): boolean => {
    // Remove todos os caracteres não numéricos
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Verifica se tem 11 dígitos (com DDD) e se começa com 9 (celular)
    if (cleanPhone.length === 11 && cleanPhone.charAt(2) === '9') {
      // Verifica se o DDD é válido (11-99)
      const ddd = parseInt(cleanPhone.substring(0, 2));
      const validDDDs = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];
      return validDDDs.includes(ddd);
    }
    
    return false;
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove todos os caracteres não numéricos
    const cleanValue = value.replace(/\D/g, '');
    
    // Aplica a máscara (11) 99999-9999
    if (cleanValue.length <= 11) {
      return cleanValue
        .replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
        .replace(/^(\d{2})(\d{4,5})/, '($1) $2')
        .replace(/^(\d{2})/, '($1');
    }
    
    return value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar WhatsApp
    if (!validateWhatsApp(formData.whatsapp)) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, use um número de WhatsApp válido com DDD (Ex: 11 99999-9999)",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    
    // Validar se é Gmail
    if (!validateGmail(formData.email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, use um email válido do Gmail (@gmail.com)",
        variant: "destructive",
        duration: 4000,
      });
      return;
    }

    try {
      // Salvar no Supabase - tabela gamification_users para aparecer em "Top Usuários Cadastrados - Tarefas"
      const { data, error } = await supabase
        .from('gamification_users')
        .insert([{
          name: formData.name,
          email: formData.email,
          whatsapp: formData.whatsapp,
          total_points: 0,
          current_streak: 0,
          max_streak: 0,
          level_name: 'Bronze',
          status: 'active',
          is_premium: false,
          registered_from: 'bonus_form'
        }])
        .select()
        .single();

      if (error) {
        console.error('Erro ao cadastrar usuário:', error);
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Email já cadastrado",
            description: "Este email já está registrado no sistema.",
            variant: "destructive",
            duration: 4000,
          });
        } else {
          toast({
            title: "Erro no cadastro",
            description: "Tente novamente em alguns instantes.",
            variant: "destructive",
            duration: 4000,
          });
        }
        return;
      }

      // Salvar também no localStorage para compatibilidade
      const userData = {
        ...formData,
        registeredAt: Date.now(),
        dailyActions: 0,
        lastActionDate: null,
        id: data.id
      };
      
      localStorage.setItem('bonusUser', JSON.stringify(userData));
      
      setShowForm(false);
      
      // Show success notification
      toast({
        title: `Parabéns ${formData.name}!`,
        description: "Cadastro realizado com sucesso! Agora você faz parte do grupo VIP!",
        duration: 4000,
      });
      
      // Reset form
      setFormData({ name: '', whatsapp: '', email: '' });

    } catch (error) {
      console.error('Erro inesperado:', error);
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  const isUserRegistered = () => {
    return localStorage.getItem('bonusUser') !== null;
  };

  return (
    <>
      {/* Gift Icon */}
      <div className={`fixed ${isMobile ? 'left-3 top-16' : 'left-6 top-20'} z-30 flex flex-col items-center`}>
        <div 
          className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 p-3 rounded-full cursor-pointer animate-pulse shadow-2xl hover:scale-110 transition-all duration-300 hover:shadow-yellow-500/50"
          onClick={handleGiftClick}
          style={{
            boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full"></div>
          <Gift className="w-6 h-6 text-white relative z-10 drop-shadow-lg" />
        </div>
        <span className="text-lime-400 text-xs font-bold mt-1 text-center drop-shadow-lg">BONUS</span>
      </div>

      {/* Live Icon */}
      <div className={`fixed ${isMobile ? 'left-3 top-32' : 'left-6 top-40'} z-30 flex flex-col items-center`}>
        <div className="bg-white/20 p-3 rounded-full">
          <Radio className="w-6 h-6 text-white" />
        </div>
        <span className="text-white text-xs font-bold mt-1 text-center">LIVE</span>
      </div>

      {/* Info Popup */}
      <Dialog open={showInfo} onOpenChange={setShowInfo}>
        <DialogContent className="bg-gradient-to-b from-purple-600 to-pink-600 text-white border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              CONGRATULATIONS! 🎉
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <div className="space-y-3 text-left">
              <h3 className="text-lg font-bold text-center">🔥 Como funciona o sistema de pontos?</h3>
              <div className="space-y-2 text-sm">
                <p>• Curta, compartilhe e comente em 3 vídeos diferentes por dia</p>
                <p>• A cada tarefa completa, você ganha 1 ponto acumulado no seu cadastro</p>
                <p>• Esses pontos dão acesso a conteúdos exclusivos dos criadores mais desejados do OnlyFans!</p>
                <p>• Alguns packs disponíveis chegam a valer até R$ 130,00 – e podem ser seus totalmente grátis!</p>
              </div>
            </div>
            <Button 
              onClick={handleContinue}
              className="w-full bg-white text-purple-600 hover:bg-gray-100 font-bold"
            >
              📝 CONTINUAR PARA CADASTRO
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Registration Form Popup */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="bg-gradient-to-b from-purple-600 to-pink-600 text-white border-none max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              📝 Formulário de Cadastro
            </DialogTitle>
            <p className="text-center text-sm">
              Solicite seus bônus preenchendo o formulário:
            </p>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                👤 Nome completo
              </Label>
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                📱 WhatsApp
              </Label>
               <Input
                type="tel"
                placeholder="(11) 99999-9999"
                value={formatPhoneNumber(formData.whatsapp)}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: formatPhoneNumber(e.target.value) }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                maxLength={15}
                required
              />
              <p className="text-xs text-white/70 mt-1">
                * Apenas números de celular válidos com DDD
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-bold flex items-center gap-2">
                📧 E-mail
              </Label>
              <Input
                type="email"
                placeholder="seuemail@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                pattern=".*@gmail\.com$"
                title="Por favor, use um email do Gmail"
                required
              />
              <p className="text-xs text-white/70 mt-1">
                * Apenas emails do Gmail são aceitos
              </p>
            </div>
            
            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold"
              >
                ✅ PARTICIPAR
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                ❌ CANCELAR
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Gift Explosion Animation */}
      {showExplosion && (
        <GiftExplosion 
          onComplete={() => {
            setShowExplosion(false);
            setShowInfo(true);
          }}
        />
      )}
    </>
  );
};