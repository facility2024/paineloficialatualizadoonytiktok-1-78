import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-sky-200 to-blue-200 border-2 border-sky-300 shadow-2xl">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <img 
              src="/lovable-uploads/2955b0a9-b6b4-486b-9318-e326c29ab668.png" 
              alt="OnyTikTok Logo" 
              className="w-12 h-12 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                Instalar OnyTikTok
              </h3>
              <p className="text-gray-800 text-xs mb-3">
                Instale nosso app, não precisa <strong>Google Play e nem App Store</strong> para acesso rápido e experiência completa!
              </p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleInstall}
                  className="bg-gray-900 hover:bg-gray-800 text-white text-xs px-3 py-1 h-auto"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Instalar
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={handleDismiss}
                  className="text-gray-900 hover:bg-gray-900/10 text-xs px-2 py-1 h-auto"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};