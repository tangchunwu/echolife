import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';

export function usePlayTimer() {
  const phase = useGameStore((s) => s.phase);
  const incrementPlayTime = useGameStore((s) => s.incrementPlayTime);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (phase === 'playing' || phase === 'dialogue') {
      intervalRef.current = window.setInterval(() => {
        incrementPlayTime(1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phase, incrementPlayTime]);
}
