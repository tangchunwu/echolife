import { useState, useEffect, useMemo } from 'react';
import { Sparkles, Key, Heart, Diamond, Mail, Hourglass, Compass, Eye, RotateCcw, type LucideProps } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { InventoryItem } from '../../types/game';

type LucideIcon = React.FC<LucideProps>;

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  key: Key,
  heart: Heart,
  diamond: Diamond,
  mail: Mail,
  hourglass: Hourglass,
  compass: Compass,
  eye: Eye,
};

const TYPE_COLORS: Record<string, string> = {
  memory: '#f59e0b',
  key: '#10b981',
  artifact: '#06b6d4',
};

interface EndingTheme {
  title: string;
  subtitle: string;
  description: string;
  color: string;
  gradient: string;
  bgGradient: string;
}

const ENDINGS: Record<string, EndingTheme> = {
  ending_merge: {
    title: '合而为一',
    subtitle: 'CONVERGENCE',
    description: '你选择了将三条时间线融为一体。过去的天真、现在的坚韧、未来的智慧，汇聚成了最完整的你。时间裂隙永远闭合了。',
    color: '#f59e0b',
    gradient: 'from-amber-400 via-orange-300 to-yellow-500',
    bgGradient: 'from-[#1a0f00] via-[#0a0817] to-[#0f0a00]',
  },
  ending_separate: {
    title: '各行其道',
    subtitle: 'DIVERGENCE',
    description: '你选择让每条时间线保持独立。虽然分离，但羁绊永存。过去继续成长，未来继续守望，而你珍惜当下的每一刻。',
    color: '#10b981',
    gradient: 'from-emerald-400 via-teal-300 to-green-500',
    bgGradient: 'from-[#000f0a] via-[#0a0817] to-[#000a0f]',
  },
  ending_transcend: {
    title: '超越时间',
    subtitle: 'TRANSCENDENCE',
    description: '你超越了时间线的束缚，获得了在任何时间中自由穿行的能力。过去不再是遗憾，未来不再是恐惧。',
    color: '#06b6d4',
    gradient: 'from-cyan-400 via-sky-300 to-blue-500',
    bgGradient: 'from-[#000a0f] via-[#0a0817] to-[#00050a]',
  },
  ending_loop: {
    title: '破环者',
    subtitle: 'LOOP BREAKER',
    description: '你发现了真相——时间裂隙的源头就是无数个"你"反复试图修改过去。你是唯一一个选择打破循环的人。没有裂隙，没有悖论，没有时间旅行。一切回到了最初。这是隐藏的真结局。',
    color: '#e11d48',
    gradient: 'from-rose-400 via-red-300 to-pink-500',
    bgGradient: 'from-[#0f0005] via-[#0a0817] to-[#0a000f]',
  },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function EndingItemCard({ item, index, color }: { item: InventoryItem; index: number; color: string }) {
  const [visible, setVisible] = useState(false);
  const IconComp: LucideIcon = ICON_MAP[item.icon] ?? Sparkles;
  const typeColor = TYPE_COLORS[item.type] ?? '#ffffff';

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 800 + index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderColor: `${color}15`,
      }}
    >
      <div className="p-1.5 rounded" style={{ backgroundColor: `${typeColor}15` }}>
        <IconComp size={16} color={typeColor} />
      </div>
      <span className="text-white/70 text-sm">{item.name}</span>
    </div>
  );
}

export function EndingScreen() {
  const phase = useGameStore((s) => s.phase);
  const flags = useGameStore((s) => s.flags);
  const inventory = useGameStore((s) => s.inventory);
  const playTimeSeconds = useGameStore((s) => s.playTimeSeconds);
  const nickname = useGameStore((s) => s.nickname);
  const resetGame = useGameStore((s) => s.resetGame);

  const [fadeIn, setFadeIn] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const endingKey = useMemo(() => {
    if (flags.ending_loop) return 'ending_loop';
    if (flags.ending_transcend) return 'ending_transcend';
    if (flags.ending_separate) return 'ending_separate';
    if (flags.ending_merge) return 'ending_merge';
    return 'ending_merge';
  }, [flags]);

  const theme = ENDINGS[endingKey];

  useEffect(() => {
    if (phase !== 'ending') return;
    const t1 = setTimeout(() => setFadeIn(true), 100);
    const t2 = setTimeout(() => setShowContent(true), 1200);
    const t3 = setTimeout(() => setShowItems(true), 2400);
    const t4 = setTimeout(() => setShowActions(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, [phase]);

  if (phase !== 'ending') return null;

  const handleRestart = () => {
    setFadeIn(false);
    setShowContent(false);
    setShowItems(false);
    setShowActions(false);
    setTimeout(() => resetGame(), 600);
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div
        className={`min-h-full flex flex-col items-center justify-center py-12 px-4
          bg-gradient-to-b ${theme.bgGradient}
          transition-opacity duration-[1200ms]
          ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {Array.from({ length: 60 }, (_, i) => (
            <div
              key={i}
              className="absolute w-px rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                height: `${2 + Math.random() * 4}px`,
                backgroundColor: theme.color,
                opacity: Math.random() * 0.3 + 0.05,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className={`relative z-10 text-center max-w-lg transition-all duration-1000 delay-200
          ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-3">
            <span className="text-white/20 text-xs tracking-[0.4em] uppercase">{theme.subtitle}</span>
          </div>

          <h1
            className={`text-5xl md:text-7xl font-thin tracking-wider mb-3
              bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}
          >
            {theme.title}
          </h1>

          <div
            className="w-24 h-px mx-auto mb-6"
            style={{ background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)` }}
          />

          <p className="text-white/40 text-sm leading-relaxed max-w-md mx-auto mb-2">
            {theme.description}
          </p>

          <div className="flex items-center justify-center gap-6 mt-6 text-white/20 text-xs tracking-wider">
            <span>{nickname || 'Traveler'}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{formatTime(playTimeSeconds)}</span>
            <span className="w-px h-3 bg-white/10" />
            <span>{inventory.length} items</span>
          </div>
        </div>

        <div className={`relative z-10 mt-10 w-full max-w-md transition-all duration-1000
          ${showItems ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="text-center mb-4">
            <span className="text-white/20 text-xs tracking-[0.3em] uppercase">Journey Collection</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {inventory.map((item, i) => (
              <EndingItemCard key={item.id} item={item} index={i} color={theme.color} />
            ))}
          </div>
        </div>

        <div className={`relative z-10 mt-12 transition-all duration-1000
          ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={handleRestart}
            className="group flex items-center gap-2.5 px-8 py-3 rounded-full border
              text-sm tracking-widest uppercase
              hover:bg-white/5 transition-all duration-300 backdrop-blur-sm"
            style={{
              borderColor: `${theme.color}30`,
              color: `${theme.color}cc`,
            }}
          >
            <RotateCcw
              size={14}
              className="group-hover:rotate-[-180deg] transition-transform duration-500"
            />
            Return to Menu
          </button>
        </div>

        <div className={`relative z-10 mt-16 text-center transition-all duration-1000 delay-300
          ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center justify-center gap-8 text-white/10 text-xs tracking-widest">
            <span>PAST</span>
            <div
              className="w-16 h-px"
              style={{ background: `linear-gradient(90deg, #f59e0b40, ${theme.color}40, #06b6d440)` }}
            />
            <span>PRESENT</span>
            <div
              className="w-16 h-px"
              style={{ background: `linear-gradient(90deg, #f59e0b40, ${theme.color}40, #06b6d440)` }}
            />
            <span>FUTURE</span>
          </div>
          <div className="mt-4 text-white/10 text-[10px] tracking-widest">
            TEMPORAL ECHO
          </div>
        </div>
      </div>
    </div>
  );
}
