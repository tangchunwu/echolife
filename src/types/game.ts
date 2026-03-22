export type SceneId = 'hall' | 'past' | 'future' | 'paradox';
export type CharacterId = 'past-self' | 'future-self' | 'narrator';
export type GamePhase = 'menu' | 'playing' | 'paused' | 'dialogue' | 'cutscene' | 'ending';

export interface PlayerPosition {
  x: number;
  y: number;
  z: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'memory' | 'key' | 'artifact';
  sceneUnlock?: SceneId;
}

export interface DialogueOption {
  key: string;
  text: string;
  nextNodeId: string | null;
  condition?: {
    item?: string;
    choice?: { nodeId: string; choiceKey: string };
  };
  effect?: {
    addItem?: string;
    unlockTimeline?: SceneId;
    setFlag?: string;
    triggerScene?: SceneId;
  };
}

export interface DialogueNode {
  id: string;
  speaker: CharacterId | 'player';
  text: string;
  options?: DialogueOption[];
  nextNodeId?: string | null;
  autoAdvance?: boolean;
  delay?: number;
  onEnter?: {
    addItem?: string;
    setFlag?: string;
  };
}

export interface DialogueTree {
  id: string;
  chapter: number;
  scene: SceneId;
  startNodeId: string;
  nodes: Record<string, DialogueNode>;
}

export interface GameSave {
  id?: string;
  slot: number;
  chapter: number;
  scene: SceneId;
  dialogueProgress: Record<string, string>;
  inventory: string[];
  unlockedTimelines: SceneId[];
  playerPosition: PlayerPosition;
  playTimeSeconds: number;
  updatedAt?: string;
}

export interface TimelineEvent {
  eventType: string;
  eventData: Record<string, unknown>;
  chapter: number;
}
