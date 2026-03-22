import { X } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

interface TimelineViewProps {
  onClose: () => void;
}

const TIMELINE_NODES = [
  {
    id: 'hall',
    label: '时间裂隙',
    chapter: 1,
    color: '#22d3ee',
    flag: 'hall_visited',
    description: '你在时间裂隙大厅中醒来',
  },
  {
    id: 'past',
    label: '过去的世界',
    chapter: 1,
    color: '#f59e0b',
    flag: 'past_dialogue_started',
    description: '与过去的自己对话',
  },
  {
    id: 'future',
    label: '未来的世界',
    chapter: 2,
    color: '#06b6d4',
    flag: 'future_dialogue_started',
    description: '与未来的自己对话',
  },
  {
    id: 'paradox',
    label: '悖论空间',
    chapter: 3,
    color: '#f43f5e',
    flag: 'paradox_visited',
    description: '三条时间线的交汇',
  },
];

export function TimelineView({ onClose }: TimelineViewProps) {
  const flags = useGameStore((s) => s.flags);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg backdrop-blur-xl bg-black/70
        border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-medium">
            <span className="text-white/40 mr-2">///</span>
            Timeline
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40
              hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6">
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

            {TIMELINE_NODES.map((node, i) => {
              const isVisited = !!flags[node.flag];
              const isLast = i === TIMELINE_NODES.length - 1;

              return (
                <div key={node.id} className={`relative flex items-start gap-4 ${isLast ? '' : 'pb-8'}`}>
                  <div
                    className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center
                      border-2 shrink-0"
                    style={{
                      borderColor: isVisited ? node.color : '#333',
                      backgroundColor: isVisited ? `${node.color}20` : 'transparent',
                    }}
                  >
                    {isVisited && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-sm font-medium"
                        style={{ color: isVisited ? node.color : '#555' }}
                      >
                        {node.label}
                      </span>
                      <span className="text-xs text-white/20">
                        {`Ch.${node.chapter}`}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isVisited ? 'text-white/40' : 'text-white/15'}`}>
                      {isVisited ? node.description : '???'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
