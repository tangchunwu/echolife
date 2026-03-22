import { X, Sparkles, Key, Heart, Diamond, Mail, Hourglass, Compass, Eye, type LucideProps } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { InventoryItem } from '../../types/game';

type LucideIcon = React.FC<LucideProps>;

const ICON_MAP: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  key: Key,
  heart: Heart,
  diamond: Diamond,
  mail: Mail,
  hourglass: Hourglass,
  compass: Compass,
  eye: Eye,
};

const TYPE_COLORS: Record<string, string> = {
  memory: '#f59e0b',
  key: '#10b981',
  artifact: '#06b6d4',
};

interface InventoryPanelProps {
  onClose: () => void;
}

function ItemCard({ item }: { item: InventoryItem }) {
  const IconComponent: LucideIcon = ICON_MAP[item.icon] ?? Sparkles;
  const color = TYPE_COLORS[item.type] ?? '#ffffff';

  return (
    <div className="p-3 rounded-lg bg-white/5 border border-white/10
      hover:bg-white/10 transition-all group">
      <div className="flex items-start gap-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: `${color}15` }}
        >
          <IconComponent size={20} color={color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-white/90">{item.name}</div>
          <div className="text-xs text-white/50 mt-0.5 line-clamp-2">{item.description}</div>
        </div>
      </div>
    </div>
  );
}

export function InventoryPanel({ onClose }: InventoryPanelProps) {
  const inventory = useGameStore((s) => s.inventory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md backdrop-blur-xl bg-black/70
        border border-white/10 rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h2 className="text-white font-medium">
            <span className="text-white/40 mr-2">///</span>
            Items
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/40
              hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-4 max-h-80 overflow-y-auto">
          {inventory.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-sm">
              No items yet...
            </div>
          ) : (
            <div className="space-y-2">
              {inventory.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        <div className="px-5 py-3 border-t border-white/10 text-white/30 text-xs">
          {inventory.length} items collected
        </div>
      </div>
    </div>
  );
}
