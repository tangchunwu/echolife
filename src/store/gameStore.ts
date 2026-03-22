import { create } from 'zustand';
import type { SceneId, GamePhase, InventoryItem, PlayerPosition, DialogueNode, DialogueOption } from '../types/game';

interface GameState {
  phase: GamePhase;
  currentScene: SceneId;
  chapter: number;
  playerPosition: PlayerPosition;
  inventory: InventoryItem[];
  unlockedTimelines: SceneId[];
  flags: Record<string, boolean>;
  dialogueChoices: Record<string, string>;
  playTimeSeconds: number;
  nickname: string;

  currentDialogueNode: DialogueNode | null;
  dialogueHistory: { speaker: string; text: string }[];
  isTransitioning: boolean;
  currentSaveSlot: number;

  setPhase: (phase: GamePhase) => void;
  setScene: (scene: SceneId) => void;
  setChapter: (chapter: number) => void;
  setPlayerPosition: (pos: PlayerPosition) => void;
  addItem: (item: InventoryItem) => void;
  removeItem: (itemId: string) => void;
  hasItem: (itemId: string) => boolean;
  unlockTimeline: (scene: SceneId) => void;
  setFlag: (flag: string, value: boolean) => void;
  hasFlag: (flag: string) => boolean;
  recordChoice: (nodeId: string, choiceKey: string) => void;
  getChoice: (nodeId: string) => string | undefined;
  setDialogueNode: (node: DialogueNode | null) => void;
  addDialogueHistory: (speaker: string, text: string) => void;
  clearDialogueHistory: () => void;
  setTransitioning: (v: boolean) => void;
  setNickname: (name: string) => void;
  incrementPlayTime: (seconds: number) => void;
  setSaveSlot: (slot: number) => void;

  applyDialogueEffect: (option: DialogueOption) => void;

  resetGame: () => void;
  loadSaveData: (data: {
    chapter: number;
    scene: SceneId;
    dialogueChoices: Record<string, string>;
    inventory: InventoryItem[];
    unlockedTimelines: SceneId[];
    playerPosition: PlayerPosition;
    playTimeSeconds: number;
  }) => void;
}

const CHAPTER_MAP: Record<string, number> = {
  hall: 1,
  past: 1,
  future: 2,
  paradox: 3,
};

const initialState = {
  phase: 'menu' as GamePhase,
  currentScene: 'hall' as SceneId,
  chapter: 1,
  playerPosition: { x: 0, y: 1.5, z: 5 },
  inventory: [] as InventoryItem[],
  unlockedTimelines: ['hall' as SceneId],
  flags: {} as Record<string, boolean>,
  dialogueChoices: {} as Record<string, string>,
  playTimeSeconds: 0,
  nickname: '',
  currentDialogueNode: null as DialogueNode | null,
  dialogueHistory: [] as { speaker: string; text: string }[],
  isTransitioning: false,
  currentSaveSlot: 1,
};

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),
  setScene: (scene) => set({ currentScene: scene, chapter: CHAPTER_MAP[scene] ?? 1 }),
  setChapter: (chapter) => set({ chapter }),
  setPlayerPosition: (pos) => set({ playerPosition: pos }),

  addItem: (item) => {
    const s = get();
    if (s.inventory.some((i) => i.id === item.id)) return;
    set({ inventory: [...s.inventory, item] });
    if (item.sceneUnlock) {
      s.unlockTimeline(item.sceneUnlock);
    }
  },

  removeItem: (itemId) => set((s) => ({
    inventory: s.inventory.filter((i) => i.id !== itemId),
  })),

  hasItem: (itemId) => get().inventory.some((i) => i.id === itemId),

  unlockTimeline: (scene) => set((s) => {
    if (s.unlockedTimelines.includes(scene)) return s;
    return { unlockedTimelines: [...s.unlockedTimelines, scene] };
  }),

  setFlag: (flag, value) => set((s) => ({
    flags: { ...s.flags, [flag]: value },
  })),

  hasFlag: (flag) => !!get().flags[flag],

  recordChoice: (nodeId, choiceKey) => set((s) => ({
    dialogueChoices: { ...s.dialogueChoices, [nodeId]: choiceKey },
  })),

  getChoice: (nodeId) => get().dialogueChoices[nodeId],

  setDialogueNode: (node) => set({ currentDialogueNode: node }),

  addDialogueHistory: (speaker, text) => set((s) => ({
    dialogueHistory: [...s.dialogueHistory, { speaker, text }],
  })),

  clearDialogueHistory: () => set({ dialogueHistory: [] }),

  setTransitioning: (v) => set({ isTransitioning: v }),

  setNickname: (name) => set({ nickname: name }),

  incrementPlayTime: (seconds) => set((s) => ({
    playTimeSeconds: s.playTimeSeconds + seconds,
  })),

  setSaveSlot: (slot) => set({ currentSaveSlot: slot }),

  applyDialogueEffect: (option) => {
    const state = get();
    if (option.effect?.unlockTimeline) {
      state.unlockTimeline(option.effect.unlockTimeline);
    }
    if (option.effect?.setFlag) {
      state.setFlag(option.effect.setFlag, true);
    }
    if (option.effect?.triggerScene) {
      state.setScene(option.effect.triggerScene);
    }
    state.recordChoice(state.currentDialogueNode?.id ?? '', option.key);
  },

  resetGame: () => set({ ...initialState, phase: 'menu' }),

  loadSaveData: (data) => set({
    chapter: data.chapter,
    currentScene: data.scene,
    dialogueChoices: data.dialogueChoices,
    inventory: data.inventory,
    unlockedTimelines: data.unlockedTimelines,
    playerPosition: data.playerPosition,
    playTimeSeconds: data.playTimeSeconds,
    phase: 'playing',
  }),
}));
