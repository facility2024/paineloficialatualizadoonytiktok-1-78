import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Share2, Smartphone, Monitor, RefreshCw, ExternalLink, Copy, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ShareRecord {
  id: string;
  created_at: string;
  user_id: string;
  session_id: string;
  video_id: string;
  model_id: string;
  platform: string;
  share_method: string;
  shared_url: string;
  success: boolean;
  error_message: string;
  device_type: string;
  user_agent: string;
  videos?: {
    title: string;
    model_id: string;
  };
  models?: {
    name: string;
    username: string;
  };
}

interface ShareStats {
  total_shares: number;
  successful_shares: number;
  failed_shares: number;
  native_shares: number;
  clipboard_shares: number;
  mobile_shares: number;
  desktop_shares: number;
}

export const AdminShares = () => {
  const [shares, setShares] = useState<ShareRecord[]>([]);
  const [stats, setStats] = useState<ShareStats>({
    total_shares: 0,
    successful_shares: 0,
    failed_shares: 0,
    native_shares: 0,
    clipboard_shares: 0,
    mobile_shares: 0,
    desktop_shares: 0
  });
  const [loading, setLoading] = useState(true);

  const loadShares = async () => {
    try {
      setLoading(true);

      // Buscar compartilhamentos com dados dos vídeos e modelos
      const { data: sharesData, error: sharesError } = await supabase
        .from('video_shares')
        .select(`
          *,
          videos (
            title,
            model_id
          ),
          models (
            name,
            username
          )
        `)
        .order('created_at', { ascending: false })
        .limit(100);

      if (sharesError) throw sharesError;

      setShares(sharesData || []);

      // Calcular estatísticas
      if (sharesData) {
        const totalShares = sharesData.length;
        const successfulShares = sharesData.filter(s => s.success).length;
        const failedShares = totalShares - successfulShares;
        const nativeShares = sharesData.filter(s => s.share_method === 'web_share_api').length;
        const clipboardShares = sharesData.filter(s => s.share_method === 'copy_link').length;
        const mobileShares = sharesData.filter(s => s.device_type === 'mobile').length;
        const desktopShares = sharesData.filter(s => s.device_type === 'desktop').length;

        setStats({
          total_shares: totalShares,
          successful_shares: successfulShares,
          failed_shares: failedShares,
          native_shares: nativeShares,
          clipboard_shares: clipboardShares,
          mobile_shares: mobileShares,
          desktop_shares: desktopShares
        });
      }

    } catch (error) {
      console.error('Erro ao carregar compartilhamentos:', error);
      toast.error('Erro ao carregar dados de compartilhamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShares();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const getPlatformIcon = (platform: string, method: string) => {
    if (method === 'web_share_api') return <Share2 className="w-4 h-4" />;
    if (method === 'copy_link') return <Copy className="w-4 h-4" />;
    return <ExternalLink className="w-4 h-4" />;
  };

  const getDeviceIcon = (deviceType: string) => {
    return deviceType === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />;
  };

  const getSuccessBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Sucesso" : "Falhou"}
      </Badge>
    );
  };

  const successRate = stats.total_shares > 0 ? (stats.successful_shares / stats.total_shares * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Compartilhamentos</h2>
          <p className="text-muted-foreground">
            Análise detalhada dos compartilhamentos de vídeos
          </p>
        </div>
        <Button onClick={loadShares} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Compartilhamentos</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total_shares}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Sucesso</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.successful_shares} de {stats.total_shares}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compartilhamento Nativo</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.native_shares}</div>
            <p className="text-xs text-muted-foreground">
              Web Share API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mobile vs Desktop</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mobile_shares}/{stats.desktop_shares}</div>
            <p className="text-xs text-muted-foreground">
              Mobile / Desktop
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Compartilhamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Compartilhamentos</CardTitle>
          <CardDescription>
            Últimos 100 compartilhamentos registrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Vídeo</TableHead>
                <TableHead>Modelo</TableHead>
                <TableHead>Método</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shares.map((share) => (
                <TableRow key={share.id}>
                  <TableCell className="font-mono text-sm">
                    {formatDate(share.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate">
                      {share.videos?.title || 'Vídeo removido'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[150px] truncate">
                      {share.models?.name || share.models?.username || 'Modelo removido'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getPlatformIcon(share.platform, share.share_method)}
                      <span className="text-sm">
                        {share.share_method === 'web_share_api' ? 'Nativo' : 'Clipboard'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(share.device_type)}
                      <span className="text-sm capitalize">{share.device_type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getSuccessBadge(share.success)}
                    {!share.success && share.error_message && (
                      <div className="text-xs text-muted-foreground mt-1 max-w-[150px] truncate">
                        {share.error_message}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(share.shared_url, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {shares.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum compartilhamento registrado ainda.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};