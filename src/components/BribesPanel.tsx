import { BRIBES } from '@/types/game';
import { GameState } from '@/types/game';
import { 
  BadgeCheck, 
  Scale, 
  Key, 
  DollarSign, 
  TrendingDown,
  Plus,
  AlertCircle
} from 'lucide-react';

const bribeIcons = {
  cop: BadgeCheck,
  juiz: Scale,
};

interface BribesPanelProps {
  state: GameState;
  ceilFormat: (n: number) => string;
  onBuy: (bribe: typeof BRIBES[0]) => void;
}

export const BribesPanel = ({ 
  state, 
  ceilFormat, 
  onBuy 
}: BribesPanelProps) => {
  const getBribeCount = (brideId: string) => {
    return state.bribes.filter(b => b.s.id === brideId).length;
  };

  return (
    <div className="grid gap-6">
      {BRIBES.map((bribe, index) => {
        const count = getBribeCount(bribe.id);
        const canBuy = state.bribes.length < state.subMax;
        const BribeIcon = bribeIcons[bribe.id as keyof typeof bribeIcons] || Key;

        return (
          <div 
            key={bribe.id} 
            className="bribe-item slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper">
                  <BribeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {bribe.name}
                  </h3>
                  {count > 0 && (
                    <div className="game-chip bg-black/30 text-white border-white/20">
                      <Key className="w-3 h-3" />
                      {count} ativo{count > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-medium text-white/80">Custo</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(bribe.costPer)}/s
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <TrendingDown className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white/80">Reduz Heat</span>
                </div>
                <p className="text-lg font-bold text-white">
                  -{ceilFormat(bribe.reduce)}/s
                </p>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-white/80">
                Reduz permanentemente o acúmulo de heat através de corrupção
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onBuy(bribe)}
                disabled={!canBuy}
                className="game-button success flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Comprar ({ceilFormat(bribe.costPer)}/s)
              </button>
            </div>

            {!canBuy && (
              <div className="mt-3 p-3 rounded-lg bg-black/30 border border-red-500/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm font-medium">
                    Limite de subornos atingido ({state.subMax})
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};