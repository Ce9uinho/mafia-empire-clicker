import { BRIBES } from '@/types/game';
import { GameState } from '@/types/game';

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
    <div className="grid gap-4">
      {BRIBES.map(bribe => {
        const count = getBribeCount(bribe.id);
        const canBuy = state.bribes.length < state.subMax;

        return (
          <div key={bribe.id} className="mafia-item">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🗝️ {bribe.name}
                {count > 0 && (
                  <span className="mafia-chip bg-success text-white">
                    {count} ativo{count > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
            </div>

            <div className="mafia-label mb-4">
              🧼 {ceilFormat(bribe.costPer)}/s • 
              Reduz 🔥 {ceilFormat(bribe.reduce)}/s
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onBuy(bribe)}
                disabled={!canBuy}
                className="mafia-button mafia-button-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Comprar ({ceilFormat(bribe.costPer)} 🧼/s)
              </button>
            </div>

            {!canBuy && (
              <p className="text-warning text-sm mt-2">
                Limite de subornos atingido ({state.subMax})
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};