import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { audioManager } from '../systems/AudioManager';
import type { BgmKey, SfxKey } from '../systems/AudioManager';

function subscribe(cb: () => void) {
  return audioManager.subscribe(cb);
}

function getSnapshot() {
  return `${audioManager.getMuted()}|${audioManager.getBgmVolume()}|${audioManager.getSfxVolume()}|${audioManager.getCurrentBgm()}`;
}

export function useAudioState() {
  const snap = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const [mutedStr, bgmStr, sfxStr, bgmKey] = snap.split('|');
  return {
    muted: mutedStr === 'true',
    bgmVolume: parseFloat(bgmStr),
    sfxVolume: parseFloat(sfxStr),
    currentBgm: bgmKey === 'null' ? null : (bgmKey as BgmKey),
  };
}

export function useBgm(key: BgmKey | null) {
  useEffect(() => {
    if (!key) {
      audioManager.stopBgm();
      return;
    }
    audioManager.playBgm(key);
  }, [key]);
}

export function useSfx() {
  const play = useCallback((key: SfxKey) => {
    audioManager.playSfx(key);
  }, []);
  return play;
}
