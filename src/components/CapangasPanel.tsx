import { CAPANGAS } from '@/types/game';
import { GameState } from '@/types/game';

interface CapangasPanelProps {
  state: GameState;
  ceilFormat: (n: number) => string;
  onHire: (capanga: typeof CAPANGAS[0]) => void;
  onFire: (capanga: typeof CAPANGAS[0]) => void;
}

export const CapangasPanel = ({ 
  state, 
  ceilFormat, 
  onHire, 
  onFire 
}: CapangasPanelProps) => {
  const getPerkText = (buffs: any) => {
    const perks = [];
    if (buffs?.dirtyMul && buffs.dirtyMul !== 1) {
      perks.push(`x${Math.round(buffs.dirtyMul * 100) / 100} 💉`);
    }
    if (buffs?.heatMul && buffs.heatMul !== 1) {
      perks.push(`x${Math.round(buffs.heatMul * 100) / 100} 🔥`);
    }
    return perks.length ? perks.join(' • ') : '—';
  };

  const getCapangaCount = (capangaId: string) => {
    return state.capangas.filter(c => c.kind.id === capangaId).length;
  };

  return (
    <div className="grid gap-4">
      {CAPANGAS.map(capanga => {
        const count = getCapangaCount(capanga.id);
        const canHire = state.dirty >= capanga.hire && state.capangas.length < state.capMax;
        const canFire = count > 0;

        return (
          <div key={capanga.id} className="mafia-item">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🧑‍💼 {capanga.name}
                {count > 0 && (
                  <span className="mafia-chip bg-success text-white">
                    {count} contratado{count > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
            </div>

            <div className="mafia-label mb-4">
              Perks: {getPerkText(capanga.buffs)} • 
              💉 Custo: {ceilFormat(capanga.hire)} • 
              💉 Salário: {ceilFormat(capanga.salary)}/s
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onHire(capanga)}
                disabled={!canHire}
                className="mafia-button mafia-button-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Contratar ({ceilFormat(capanga.hire)} 💉)
              </button>
              
              <button
                onClick={() => onFire(capanga)}
                disabled={!canFire}
                className="mafia-button mafia-button-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Dispensar
              </button>
            </div>

            {!canHire && state.dirty < capanga.hire && (
              <p className="text-warning text-sm mt-2">
                Precisa de {ceilFormat(capanga.hire - state.dirty)} 💉 mais
              </p>
            )}
            
            {!canHire && state.capangas.length >= state.capMax && (
              <p className="text-warning text-sm mt-2">
                Limite de capangas atingido ({state.capMax})
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};