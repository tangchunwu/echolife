import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../systems/AudioManager';

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

export function TransitionOverlay() {
  const isTransitioning = useGameStore((s) => s.isTransitioning);
  const currentScene = useGameStore((s) => s.currentScene);
  const color = SCENE_COLORS[currentScene] ?? '#ffffff';
  const prevTransitioning = useRef(false);

  useEffect(() => {
    if (isTransitioning && !prevTransitioning.current) {
      audioManager.playSfx('transition');
    }
    prevTransitioning.current = isTransitioning;
  }, [isTransitioning]);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-black pointer-events-none
        transition-opacity duration-700
        ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}
    >
      {isTransitioning && (
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: color, animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>
          <div
            className="text-sm tracking-[0.3em] font-light animate-pulse"
            style={{ color }}
          >
            {SCENE_NAMES[currentScene]}
          </div>
        </div>
      )}
    </div>
  );
}
