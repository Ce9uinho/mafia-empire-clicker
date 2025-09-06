import { BUILDINGS } from '@/types/game';
import { GameState } from '@/types/game';

interface BuildingsPanelProps {
  state: GameState;
  ceilFormat: (n: number) => string;
  onBuy: (building: typeof BUILDINGS[0]) => void;
  onSell: (building: typeof BUILDINGS[0]) => void;
}

export const BuildingsPanel = ({ 
  state, 
  ceilFormat, 
  onBuy, 
  onSell 
}: BuildingsPanelProps) => {
  const getBuildingCount = (buildingId: string) => {
    return state.builds.filter(b => b.b.id === buildingId).length;
  };

  return (
    <div className="grid gap-4">
      {BUILDINGS.map(building => {
        const count = getBuildingCount(building.id);
        const canBuy = state.dirty >= building.cost && state.builds.length < state.bldMax;
        const canSell = count > 0;

        return (
          <div key={building.id} className="mafia-item">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🏢 {building.name}
                {count > 0 && (
                  <span className="mafia-chip bg-success text-white">
                    {count} construído{count > 1 ? 's' : ''}
                  </span>
                )}
              </h3>
            </div>

            <div className="mafia-label mb-4">
              {building.type === 'launder' 
                ? `Lava 💉→🧼 a ${ceilFormat(building.rate)}/s`
                : `Gera 🧼 ${ceilFormat(building.rate)}/s`
              } • 
              Custo: {ceilFormat(building.cost)} 💉
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onBuy(building)}
                disabled={!canBuy}
                className="mafia-button mafia-button-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Construir ({ceilFormat(building.cost)} 💉)
              </button>
              
              <button
                onClick={() => onSell(building)}
                disabled={!canSell}
                className="mafia-button mafia-button-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Demolir
              </button>
            </div>

            {!canBuy && state.dirty < building.cost && (
              <p className="text-warning text-sm mt-2">
                Precisa de {ceilFormat(building.cost - state.dirty)} 💉 mais
              </p>
            )}
            
            {!canBuy && state.builds.length >= state.bldMax && (
              <p className="text-warning text-sm mt-2">
                Limite de edifícios atingido ({state.bldMax})
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};