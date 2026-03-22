import { hallDialogue, hallReturnDialogue } from './hallDialogue';
import { pastDialogue } from './pastDialogue';
import { futureDialogue } from './futureDialogue';
import { paradoxDialogue } from './paradoxDialogue';
import type { DialogueTree, SceneId } from '../../types/game';

export const ALL_DIALOGUES: DialogueTree[] = [
  hallDialogue,
  hallReturnDialogue,
  pastDialogue,
  futureDialogue,
  paradoxDialogue,
];

export function getDialogueForScene(scene: SceneId, hasVisited: boolean): DialogueTree | undefined {
  if (scene === 'hall') {
    return hasVisited ? hallReturnDialogue : hallDialogue;
  }
  return ALL_DIALOGUES.find((d) => d.scene === scene && d.id !== 'hall_return');
}

export { hallDialogue, hallReturnDialogue, pastDialogue, futureDialogue, paradoxDialogue };
