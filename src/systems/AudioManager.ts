export type SfxKey =
  | 'portal_enter'
  | 'portal_unlock'
  | 'collect'
  | 'ui_click'
  | 'ui_hover'
  | 'typing'
  | 'transition'
  | 'hourglass';

export type BgmKey = 'menu' | 'hall' | 'past' | 'future' | 'paradox';

const BGM_PATHS: Record<BgmKey, string> = {
  menu: '/audio/bgm/menu_theme.mp3',
  hall: '/audio/bgm/hall_ambient.mp3',
  past: '/audio/bgm/past_theme.mp3',
  future: '/audio/bgm/future_theme.mp3',
  paradox: '/audio/bgm/paradox_theme.mp3',
};

const SFX_PATHS: Record<SfxKey, string> = {
  portal_enter: '/audio/sfx/portal_enter.mp3',
  portal_unlock: '/audio/sfx/portal_unlock.mp3',
  collect: '/audio/sfx/collect.mp3',
  ui_click: '/audio/sfx/ui_click.mp3',
  ui_hover: '/audio/sfx/ui_hover.mp3',
  typing: '/audio/sfx/typing.mp3',
  transition: '/audio/sfx/transition.mp3',
  hourglass: '/audio/sfx/hourglass.mp3',
};

class AudioManager {
  private bgmElements: Map<BgmKey, HTMLAudioElement> = new Map();
  private sfxElements: Map<SfxKey, HTMLAudioElement> = new Map();
  private currentBgm: BgmKey | null = null;
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;

  private bgmVolume = 0.4;
  private sfxVolume = 0.7;
  private muted = false;
  private initialized = false;

  private listeners: Set<() => void> = new Set();

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  subscribe(fn: () => void) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  init() {
    if (this.initialized) return;
    this.initialized = true;

    for (const [key, path] of Object.entries(BGM_PATHS) as [BgmKey, string][]) {
      const el = new Audio(path);
      el.loop = true;
      el.volume = 0;
      el.preload = 'none';
      this.bgmElements.set(key, el);
    }

    for (const [key, path] of Object.entries(SFX_PATHS) as [SfxKey, string][]) {
      const el = new Audio(path);
      el.preload = 'none';
      el.volume = this.muted ? 0 : this.sfxVolume;
      this.sfxElements.set(key, el);
    }
  }

  private getBgmTargetVolume() {
    return this.muted ? 0 : this.bgmVolume;
  }

  playBgm(key: BgmKey, fadeDuration = 1500) {
    this.init();
    if (this.currentBgm === key) return;

    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }

    const prev = this.currentBgm;
    const prevEl = prev ? this.bgmElements.get(prev) : null;
    const nextEl = this.bgmElements.get(key);

    if (!nextEl) return;

    this.currentBgm = key;

    const steps = 30;
    const interval = fadeDuration / steps;
    const targetVol = this.getBgmTargetVolume();

    if (prevEl && !prevEl.paused) {
      let step = 0;
      const startVol = prevEl.volume;
      const fadeOutTimer = setInterval(() => {
        step++;
        prevEl.volume = Math.max(0, startVol * (1 - step / steps));
        if (step >= steps) {
          clearInterval(fadeOutTimer);
          prevEl.pause();
          prevEl.currentTime = 0;
        }
      }, interval);
    }

    nextEl.volume = 0;
    nextEl.currentTime = 0;
    nextEl.play().catch(() => {});

    let stepIn = 0;
    const fadeInTimer = setInterval(() => {
      stepIn++;
      nextEl.volume = Math.min(targetVol, targetVol * (stepIn / steps));
      if (stepIn >= steps) {
        clearInterval(fadeInTimer);
      }
    }, interval);
  }

  stopBgm(fadeDuration = 1000) {
    if (!this.currentBgm) return;
    const el = this.bgmElements.get(this.currentBgm);
    if (!el) return;

    const steps = 20;
    const interval = fadeDuration / steps;
    const startVol = el.volume;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      el.volume = Math.max(0, startVol * (1 - step / steps));
      if (step >= steps) {
        clearInterval(timer);
        el.pause();
        el.currentTime = 0;
      }
    }, interval);

    this.currentBgm = null;
  }

  playSfx(key: SfxKey) {
    this.init();
    if (this.muted) return;

    const el = this.sfxElements.get(key);
    if (!el) return;

    const clone = el.cloneNode() as HTMLAudioElement;
    clone.volume = this.sfxVolume;
    clone.play().catch(() => {});
  }

  setMuted(muted: boolean) {
    this.muted = muted;

    if (this.currentBgm) {
      const el = this.bgmElements.get(this.currentBgm);
      if (el) el.volume = muted ? 0 : this.bgmVolume;
    }

    this.notify();
  }

  setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.currentBgm && !this.muted) {
      const el = this.bgmElements.get(this.currentBgm);
      if (el) el.volume = this.bgmVolume;
    }
    this.notify();
  }

  setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this.notify();
  }

  getMuted() { return this.muted; }
  getBgmVolume() { return this.bgmVolume; }
  getSfxVolume() { return this.sfxVolume; }
  getCurrentBgm() { return this.currentBgm; }
}

export const audioManager = new AudioManager();
