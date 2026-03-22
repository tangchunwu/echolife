import { Play, Save, RotateCcw, Home, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../systems/AudioManager';
import { useAudioState } from '../../hooks/useAudio';

export function PauseMenu() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const resetGame = useGameStore((s) => s.resetGame);
  const { muted, bgmVolume, sfxVolume } = useAudioState();

  if (phase !== 'paused') return null;

  const handleClick = (fn: () => void) => {
    audioManager.playSfx('ui_click');
    fn();
  };

  const menuItems = [
    {
      icon: Play,
      label: 'Continue',
      onClick: () => handleClick(() => setPhase('playing')),
      color: '#10b981',
    },
    {
      icon: Save,
      label: 'Save (Auto)',
      onClick: () => handleClick(() => setPhase('playing')),
      color: '#06b6d4',
    },
    {
      icon: RotateCcw,
      label: 'Restart Chapter',
      onClick: () => handleClick(() => setPhase('playing')),
      color: '#f59e0b',
    },
    {
      icon: Home,
      label: 'Main Menu',
      onClick: () => handleClick(resetGame),
      color: '#f43f5e',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={() => { audioManager.playSfx('ui_click'); setPhase('playing'); }}
      />

      <div className="relative z-10 w-full max-w-xs">
        <div className="text-center mb-8">
          <div className="text-white/30 text-xs tracking-[0.3em] uppercase mb-2">Paused</div>
          <div className="h-px w-16 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="w-full flex items-center gap-4 px-6 py-3.5 rounded-lg
                bg-white/5 border border-white/5
                hover:bg-white/10 hover:border-white/15
                transition-all duration-200 group"
            >
              <item.icon
                size={18}
                className="text-white/30 group-hover:text-white/70 transition-colors"
              />
              <span className="text-white/60 text-sm tracking-wider group-hover:text-white/90 transition-colors">
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-6 rounded-lg bg-white/3 border border-white/5 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/40 text-xs tracking-wider">AUDIO</span>
            <button
              onClick={() => { audioManager.setMuted(!muted); }}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
            >
              {muted
                ? <VolumeX size={16} className="text-white/30" />
                : <Volume2 size={16} className="text-white/60" />
              }
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs w-8">BGM</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={bgmVolume}
                onChange={(e) => audioManager.setBgmVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 accent-cyan-400 cursor-pointer"
              />
              <span className="text-white/20 text-xs w-8 text-right">
                {Math.round(bgmVolume * 100)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-white/30 text-xs w-8">SFX</span>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={sfxVolume}
                onChange={(e) => audioManager.setSfxVolume(parseFloat(e.target.value))}
                className="flex-1 h-1 accent-cyan-400 cursor-pointer"
              />
              <span className="text-white/20 text-xs w-8 text-right">
                {Math.round(sfxVolume * 100)}
              </span>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-white/15 text-xs">
          Press ESC or click outside to resume
        </div>
      </div>
    </div>
  );
}
