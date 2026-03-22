import { useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { audioManager } from '../../systems/AudioManager';
import type { BgmKey } from '../../systems/AudioManager';

const SCENE_BGM_MAP: Record<string, BgmKey> = {
  hall: 'hall',
  past: 'past',
  future: 'future',
  paradox: 'paradox',
};

export function BgmController() {
  const phase = useGameStore((s) => s.phase);
  const scene = useGameStore((s) => s.currentScene);

  useEffect(() => {
    if (phase === 'menu') {
      audioManager.playBgm('menu');
      return;
    }

    if (phase === 'ending') {
      audioManager.stopBgm(2000);
      return;
    }

    if (phase === 'playing' || phase === 'dialogue' || phase === 'paused') {
      const bgmKey = SCENE_BGM_MAP[scene];
      if (bgmKey) {
        audioManager.playBgm(bgmKey);
      }
    }
  }, [phase, scene]);

  return null;
}
