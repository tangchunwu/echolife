import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../systems/AudioManager';

export function MainMenu() {
  const phase = useGameStore((s) => s.phase);
  const setPhase = useGameStore((s) => s.setPhase);
  const setNickname = useGameStore((s) => s.setNickname);
  const unlockTimeline = useGameStore((s) => s.unlockTimeline);
  const [showNameInput, setShowNameInput] = useState(false);
  const [name, setName] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showNameInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showNameInput]);

  if (phase !== 'menu') return null;

  const handleStart = () => {
    audioManager.playSfx('ui_click');
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }
    const trimmed = name.trim() || 'Traveler';
    setNickname(trimmed);
    unlockTimeline('hall');
    setPhase('playing');
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-b from-[#020817] via-[#0a1628] to-[#020817]" />

      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 text-center transition-all duration-1000
        ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}`}>
        <div className="mb-2">
          <span className="text-white/20 text-sm tracking-[0.3em] uppercase">Temporal Echo</span>
        </div>

        <h1 className="text-6xl md:text-8xl font-thin text-white tracking-wider mb-4
          bg-gradient-to-r from-cyan-400 via-white to-amber-400 bg-clip-text text-transparent">
          时空回响
        </h1>

        <p className="text-white/30 text-sm tracking-widest mb-12 max-w-md mx-auto leading-relaxed">
          在时间的裂隙中，与过去和未来的自己相遇
        </p>

        {!showNameInput ? (
          <div className="space-y-4">
            <button
              onClick={handleStart}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="px-12 py-3 rounded-full border border-cyan-400/30
                text-cyan-400 text-sm tracking-widest uppercase
                hover:bg-cyan-400/10 hover:border-cyan-400/50
                transition-all duration-300 backdrop-blur-sm"
            >
              New Game
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-white/40 text-sm tracking-wider">
              Tell me your name, traveler...
            </div>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder="Enter name..."
                maxLength={20}
                className="w-64 px-6 py-3 bg-transparent border-b border-white/20
                  text-white text-center text-lg tracking-wider
                  focus:outline-none focus:border-cyan-400/50
                  placeholder:text-white/15 transition-colors"
              />
            </div>
            <button
              onClick={handleStart}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="px-10 py-2.5 rounded-full border border-white/20
                text-white/70 text-sm tracking-widest
                hover:bg-white/5 hover:border-white/30 hover:text-white
                transition-all duration-300"
            >
              Begin
            </button>
          </div>
        )}

        <div className="mt-16 flex items-center justify-center gap-8 text-white/10 text-xs tracking-widest">
          <span>PAST</span>
          <div className="w-16 h-px bg-gradient-to-r from-amber-400/30 via-white/20 to-cyan-400/30" />
          <span>PRESENT</span>
          <div className="w-16 h-px bg-gradient-to-r from-amber-400/30 via-white/20 to-cyan-400/30" />
          <span>FUTURE</span>
        </div>
      </div>
    </div>
  );
}
