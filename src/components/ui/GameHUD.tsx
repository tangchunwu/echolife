import { useState, useEffect, useRef } from 'react';
import { Clock, Package, Pause, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { InventoryPanel } from './InventoryPanel';
import { TimelineView } from './TimelineView';
import { audioManager } from '../../systems/AudioManager';
import { useAudioState } from '../../hooks/useAudio';

const SCENE_NAMES: Record<string, string> = {
  hall: '时间裂隙大厅',
  past: '过去的世界',
  future: '未来的世界',
  paradox: '悖论空间',
};

const SCENE_COLORS: Record<string, string> = {
  hall: '#22d3ee',
  past: '#f59e0b',
  future: '#06b6d4',
  paradox: '#f43f5e',
};

const TYPE_COLORS: Record<string, string> = {
  memory: '#f59e0b',
  key: '#10b981',
  artifact: '#06b6d4',
};

function ItemNotification({ name, type, onDone }: { name: string; type: string; onDone: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 500);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  const color = TYPE_COLORS[type] ?? '#ffffff';

  return (
    <div
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg backdrop-blur-md border transition-all duration-500
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderColor: `${color}40`,
        boxShadow: `0 0 20px ${color}20`,
      }}
    >
      <Sparkles size={16} style={{ color }} />
      <div>
        <div className="text-[10px] tracking-wider text-white/40">NEW ITEM</div>
        <div className="text-sm font-medium" style={{ color }}>{name}</div>
      </div>
    </div>
  );
}

export function GameHUD() {
  const phase = useGameStore((s) => s.phase);
  const currentScene = useGameStore((s) => s.currentScene);
  const chapter = useGameStore((s) => s.chapter);
  const inventory = useGameStore((s) => s.inventory);
  const setPhase = useGameStore((s) => s.setPhase);
  const [showInventory, setShowInventory] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; name: string; type: string }[]>([]);
  const prevCount = useRef(0);
  const notifId = useRef(0);
  const { muted } = useAudioState();

  useEffect(() => {
    if (inventory.length > prevCount.current && prevCount.current >= 0) {
      const newItem = inventory[inventory.length - 1];
      const id = ++notifId.current;
      setNotifications((prev) => [...prev, { id, name: newItem.name, type: newItem.type }]);
    }
    prevCount.current = inventory.length;
  }, [inventory]);

  if (phase !== 'playing' && phase !== 'dialogue') return null;

  const sceneColor = SCENE_COLORS[currentScene] ?? '#ffffff';

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        <div className="flex items-start justify-between p-4">
          <div className="pointer-events-auto flex items-center gap-3
            backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-4 py-2">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: sceneColor }} />
            <div>
              <div className="text-white/60 text-xs tracking-wider">
                {`Chapter ${chapter}`}
              </div>
              <div className="text-white text-sm font-medium" style={{ color: sceneColor }}>
                {SCENE_NAMES[currentScene]}
              </div>
            </div>
          </div>

          <div className="pointer-events-auto flex gap-2">
            <button
              onClick={() => { audioManager.playSfx('ui_click'); setShowTimeline(!showTimeline); }}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="p-2.5 rounded-lg backdrop-blur-md bg-black/40 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title="时间线"
            >
              <Clock size={18} />
            </button>
            <button
              onClick={() => { audioManager.playSfx('ui_click'); setShowInventory(!showInventory); }}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="relative p-2.5 rounded-lg backdrop-blur-md bg-black/40 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title="背包"
            >
              <Package size={18} />
              {inventory.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[10px]
                  flex items-center justify-center text-white font-bold">{inventory.length}</span>
              )}
            </button>
            <button
              onClick={() => audioManager.setMuted(!muted)}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="p-2.5 rounded-lg backdrop-blur-md bg-black/40 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title={muted ? '取消静音' : '静音'}
            >
              {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={() => { audioManager.playSfx('ui_click'); setPhase('paused'); }}
              onMouseEnter={() => audioManager.playSfx('ui_hover')}
              className="p-2.5 rounded-lg backdrop-blur-md bg-black/40 border border-white/10
                text-white/60 hover:text-white hover:bg-white/10 transition-all"
              title="暂停"
            >
              <Pause size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="fixed right-4 top-20 z-50 flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map((n) => (
          <ItemNotification
            key={n.id}
            name={n.name}
            type={n.type}
            onDone={() => setNotifications((prev) => prev.filter((x) => x.id !== n.id))}
          />
        ))}
      </div>

      {showInventory && (
        <InventoryPanel onClose={() => setShowInventory(false)} />
      )}
      {showTimeline && (
        <TimelineView onClose={() => setShowTimeline(false)} />
      )}

      {phase === 'playing' && (
        <div className="fixed bottom-6 inset-x-0 z-30 flex justify-center pointer-events-none">
          <div className="backdrop-blur-md bg-black/30 border border-white/10 rounded-lg
            px-4 py-2 text-white/40 text-xs tracking-wider flex items-center gap-3">
            <span>WASD 移动</span>
            <span className="w-px h-3 bg-white/20" />
            <span>鼠标旋转视角</span>
            <span className="w-px h-3 bg-white/20" />
            <span>点击物体交互</span>
          </div>
        </div>
      )}
    </>
  );
}
