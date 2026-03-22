import type { DialogueTree, DialogueNode, DialogueOption } from '../types/game';
import { ITEMS } from '../data/items';
import { useGameStore } from '../store/gameStore';

class DialogueEngine {
  private currentTree: DialogueTree | null = null;
  private visitedNodes: Set<string> = new Set();

  startDialogue(tree: DialogueTree) {
    this.currentTree = tree;
    this.visitedNodes.clear();
    const startNode = tree.nodes[tree.startNodeId];
    if (startNode) {
      this.enterNode(startNode);
    }
    return startNode;
  }

  enterNode(node: DialogueNode) {
    this.visitedNodes.add(node.id);
    const store = useGameStore.getState();

    if (node.onEnter?.addItem) {
      const item = ITEMS[node.onEnter.addItem];
      if (item) {
        store.addItem(item);
      }
    }
    if (node.onEnter?.setFlag) {
      store.setFlag(node.onEnter.setFlag, true);
    }

    store.setDialogueNode(node);
    store.addDialogueHistory(
      node.speaker === 'player' ? store.nickname || '你' : this.getSpeakerName(node.speaker),
      node.text
    );
  }

  advanceToNext(): DialogueNode | null {
    if (!this.currentTree) return null;
    const store = useGameStore.getState();
    const currentNode = store.currentDialogueNode;
    if (!currentNode || !currentNode.nextNodeId) return null;

    const nextNode = this.currentTree.nodes[currentNode.nextNodeId];
    if (nextNode) {
      this.enterNode(nextNode);
    }
    return nextNode ?? null;
  }

  selectOption(option: DialogueOption): DialogueNode | null {
    if (!this.currentTree) return null;
    const store = useGameStore.getState();

    store.applyDialogueEffect(option);

    if (option.effect?.addItem) {
      const item = ITEMS[option.effect.addItem];
      if (item) {
        store.addItem(item);
      }
    }

    store.addDialogueHistory(store.nickname || '你', option.text);

    if (!option.nextNodeId) {
      this.endDialogue();
      return null;
    }

    const nextNode = this.currentTree.nodes[option.nextNodeId];
    if (nextNode) {
      this.enterNode(nextNode);
    }
    return nextNode ?? null;
  }

  endDialogue() {
    const scene = this.currentTree?.scene;
    this.currentTree = null;
    const store = useGameStore.getState();
    store.setDialogueNode(null);
    if (scene) {
      store.setFlag(`${scene}_dialogue_completed`, true);
    }
    if (scene === 'paradox') {
      store.setPhase('ending');
    } else {
      store.setPhase('playing');
    }
  }

  getAvailableOptions(node: DialogueNode): DialogueOption[] {
    if (!node.options) return [];
    const store = useGameStore.getState();

    return node.options.filter((opt) => {
      if (!opt.condition) return true;
      if (opt.condition.item && !store.hasItem(opt.condition.item)) return false;
      if (opt.condition.choice) {
        const prevChoice = store.getChoice(opt.condition.choice.nodeId);
        if (prevChoice !== opt.condition.choice.choiceKey) return false;
      }
      return true;
    });
  }

  isDialogueActive(): boolean {
    return this.currentTree !== null;
  }

  getSpeakerName(speaker: string): string {
    switch (speaker) {
      case 'past-self': return '过去的你';
      case 'future-self': return '未来的你';
      case 'narrator': return '旁白';
      case 'player': return useGameStore.getState().nickname || '你';
      default: return speaker;
    }
  }

  getSpeakerColor(speaker: string): string {
    switch (speaker) {
      case 'past-self': return '#f59e0b';
      case 'future-self': return '#06b6d4';
      case 'narrator': return '#94a3b8';
      case 'player': return '#10b981';
      default: return '#ffffff';
    }
  }
}

export const dialogueEngine = new DialogueEngine();
