import { useState, useEffect, useCallback, useRef } from 'react';
import { useGameStore } from '../../store/gameStore';
import { dialogueEngine } from '../../systems/DialogueEngine';
import { audioManager } from '../../systems/AudioManager';
import type { DialogueOption } from '../../types/game';

export function DialoguePanel() {
  const currentNode = useGameStore((s) => s.currentDialogueNode);
  const phase = useGameStore((s) => s.phase);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const typingCharCount = useRef(0);

  useEffect(() => {
    if (!currentNode) {
      setDisplayedText('');
      setShowOptions(false);
      return;
    }

    setIsTyping(true);
    setShowOptions(false);
    setDisplayedText('');
    typingCharCount.current = 0;

    let index = 0;
    const text = currentNode.text;
    const speed = 35;

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
        typingCharCount.current++;
        if (typingCharCount.current % 3 === 0) {
          audioManager.playSfx('typing');
        }
      } else {
        clearInterval(interval);
        setIsTyping(false);
        if (currentNode.autoAdvance && currentNode.nextNodeId) {
          const delay = currentNode.delay ?? 2000;
          setTimeout(() => {
            dialogueEngine.advanceToNext();
          }, delay);
        } else if (currentNode.options && currentNode.options.length > 0) {
          setShowOptions(true);
        }
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentNode]);

  const handleAdvance = useCallback(() => {
    if (!currentNode) return;

    if (isTyping) {
      setDisplayedText(currentNode.text);
      setIsTyping(false);
      if (currentNode.options && currentNode.options.length > 0) {
        setShowOptions(true);
      }
      return;
    }

    if (currentNode.autoAdvance) return;

    if (!currentNode.options || currentNode.options.length === 0) {
      audioManager.playSfx('ui_click');
      if (currentNode.nextNodeId) {
        dialogueEngine.advanceToNext();
      } else {
        dialogueEngine.endDialogue();
      }
    }
  }, [currentNode, isTyping]);

  const handleSelectOption = useCallback((option: DialogueOption) => {
    audioManager.playSfx('ui_click');
    dialogueEngine.selectOption(option);
  }, []);

  if (phase !== 'dialogue' || !currentNode) return null;

  const speakerName = dialogueEngine.getSpeakerName(currentNode.speaker);
  const speakerColor = dialogueEngine.getSpeakerColor(currentNode.speaker);
  const availableOptions = dialogueEngine.getAvailableOptions(currentNode);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 p-4 pointer-events-none">
      <div className="max-w-3xl mx-auto pointer-events-auto">
        {showOptions && availableOptions.length > 0 && (
          <div className="mb-3 space-y-2">
            {availableOptions.map((opt, i) => (
              <button
                key={opt.key}
                onClick={() => handleSelectOption(opt)}
                onMouseEnter={() => audioManager.playSfx('ui_hover')}
                className="w-full text-left px-5 py-3 rounded-lg backdrop-blur-md
                  bg-white/5 border border-white/10 text-white/90
                  hover:bg-white/10 hover:border-white/20
                  transition-all duration-200 group"
              >
                <span className="text-white/40 mr-3 font-mono text-sm group-hover:text-white/60">
                  {i + 1}.
                </span>
                {opt.text}
              </button>
            ))}
          </div>
        )}

        <div
          onClick={handleAdvance}
          className="relative rounded-xl backdrop-blur-md bg-black/60 border border-white/10
            px-6 py-5 cursor-pointer select-none"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: speakerColor }}
            />
            <span
              className="text-sm font-medium tracking-wide"
              style={{ color: speakerColor }}
            >
              {speakerName}
            </span>
          </div>

          <p className="text-white/90 text-base leading-relaxed min-h-[1.5em]">
            {displayedText}
            {isTyping && (
              <span className="inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse" />
            )}
          </p>

          {!isTyping && !showOptions && !currentNode.autoAdvance && (
            <div className="absolute bottom-2 right-4 text-white/30 text-xs animate-pulse">
              {currentNode.nextNodeId ? '...' : '[End]'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
