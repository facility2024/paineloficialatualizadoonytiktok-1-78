import { Video } from '@/types/database';
import { Heart, MessageCircle, Share, User, Volume2, VolumeX, Play, Pause, Radio, Eye } from 'lucide-react';

interface SideMenuProps {
  video: Video;
  isLiked: boolean;
  isMuted: boolean;
  isPlaying: boolean;
  onToggleLike: () => void;
  onToggleSound: () => void;
  onTogglePlay: () => void;
  onOpenComments: () => void;
  onOpenProfile: () => void;
  onShare: () => void;
  onOpenLive?: () => void;
  onBlockVideo?: () => void;
  onOpenPremium?: () => void;
}

export const SideMenu = ({
  video,
  isLiked,
  isMuted,
  isPlaying,
  onToggleLike,
  onToggleSound,
  onTogglePlay,
  onOpenComments,
  onOpenProfile,
  onShare,
  onOpenLive,
  onBlockVideo,
  onOpenPremium
}: SideMenuProps) => {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'k';
    }
    return count.toString();
  };

  return (
    <div className="flex flex-col gap-4 z-[9999] pointer-events-auto touch-manipulation">
      {/* Profile */}
      <div className="flex flex-col items-center cursor-pointer" onClick={onOpenProfile}>
        <div className="relative">
          <img
            src={video.user?.avatar_url || '/lovable-uploads/41dbca56-0539-491b-a599-1fae357d5331.png'}
            alt="Profile"
            className="w-12 h-12 rounded-full border-2 border-white object-cover"
          />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
            +
          </div>
        </div>
        <span className="text-white text-xs mt-1">Perfil</span>
      </div>

      {/* Like */}
      <div 
        className="flex flex-col items-center cursor-pointer touch-manipulation select-none relative"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔥 SideMenu like CLICK triggered');
          console.log('🔥 Click event:', e);
          onToggleLike();
        }}
        onTouchStart={(e) => {
          console.log('🔥 SideMenu like TOUCH START');
          e.stopPropagation();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          e.stopPropagation();
          console.log('🔥 SideMenu like TOUCH END triggered');
          console.log('🔥 Touch event:', e);
          onToggleLike();
        }}
        style={{
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'manipulation'
        }}
      >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 transition-all duration-200 active:scale-95 ${
          isLiked ? 'bg-red-500/30 scale-110' : 'bg-white/10 hover:bg-white/20'
        }`}>
          <span className={`text-2xl ${isLiked ? 'text-red-500' : 'text-white'}`}>
            {isLiked ? '❤️' : '♡'}
          </span>
        </div>
        <span className="text-white text-xs mt-1">{formatCount(video.likes_count)}</span>
        {/* Debug overlay to verify positioning */}
        <div className="absolute -inset-2 border border-green-500 opacity-20 pointer-events-none rounded-xl"></div>
      </div>

      {/* Comment */}
      <div className="flex flex-col items-center cursor-pointer" onClick={() => {
        console.log('SideMenu comments clicked');
        onOpenComments();
      }}>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-white text-xl">💬</span>
        </div>
        <span className="text-white text-xs mt-1">{formatCount(video.comments_count)}</span>
      </div>

      {/* Share */}
      <div className="flex flex-col items-center cursor-pointer" onClick={() => {
        console.log('SideMenu share clicked');
        onShare();
      }}>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-white text-xl">↗</span>
        </div>
        <span className="text-white text-xs mt-1">{formatCount(video.shares_count)}</span>
      </div>

      {/* Block Video (Eye Icon) - Só aparece quando configurado pelo admin */}
      {onBlockVideo && (
        <div className="flex flex-col items-center cursor-pointer" onClick={() => {
          console.log('🔒 SideMenu block video clicked!');
          onBlockVideo();
        }}>
          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 hover:bg-white/20 transition-colors">
            <Eye className="w-5 h-5 text-white" />
          </div>
          <span className="text-white text-xs mt-1">Bloquear</span>
        </div>
      )}

      {/* Premium */}
      <div className="flex flex-col items-center cursor-pointer" onClick={onOpenPremium}>
        <div className="relative w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center border-2 border-yellow-300 animate-pulse shadow-[0_0_20px_rgba(251,191,36,0.8)] hover:shadow-[0_0_30px_rgba(251,191,36,1)] transition-all duration-300">
          <span className="text-white text-xl drop-shadow-lg">👑</span>
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-orange-500/30 animate-ping"></div>
        </div>
        <span className="text-white text-xs mt-1 drop-shadow-md">Premium</span>
      </div>

      {/* Sound */}
      <div className="flex flex-col items-center cursor-pointer" onClick={onToggleSound}>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-white text-xl">
            {isMuted ? '🔇' : '🔊'}
          </span>
        </div>
        <span className="text-white text-xs mt-1">{isMuted ? 'Som' : 'Mudo'}</span>
      </div>

      {/* Play/Pause */}
      <div className="flex flex-col items-center cursor-pointer" onClick={onTogglePlay}>
        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
          <span className="text-blue-400 text-xl">
            {isPlaying ? '⏸️' : '▶️'}
          </span>
        </div>
        <span className="text-white text-xs mt-1">{isPlaying ? 'Pausar' : 'Play'}</span>
      </div>

    </div>
  );
};