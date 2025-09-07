import { BUILDINGS } from '@/types/game';
import { GameState } from '@/types/game';
import { 
  Wine, 
  Coffee, 
  Truck, 
  Building2, 
  DollarSign, 
  ArrowRightLeft,
  Plus,
  Trash2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';

const buildingIcons = {
  bar: Wine,
  cafe: Coffee,
  trans: Truck,
};

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
    <div className="grid gap-6">
      {BUILDINGS.map((building, index) => {
        const count = getBuildingCount(building.id);
        const canBuy = state.dirty >= building.cost && state.builds.length < state.bldMax;
        const canSell = count > 0;
        const BuildingIcon = buildingIcons[building.id as keyof typeof buildingIcons] || Building2;
        const isLaundry = building.type === 'launder';

        return (
          <div 
            key={building.id} 
            className="building-item slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper">
                  <BuildingIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {building.name}
                  </h3>
                  {count > 0 && (
                    <div className="game-chip bg-black/30 text-white border-white/20">
                      <Building2 className="w-3 h-3" />
                      {count} construído{count > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white/80">Custo</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(building.cost)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {isLaundry ? (
                    <ArrowRightLeft className="w-4 h-4 text-blue-400" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  <span className="text-sm font-medium text-white/80">
                    {isLaundry ? 'Lavagem' : 'Geração'}
                  </span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(building.rate)}/s
                </p>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-3 mb-4">
              <p className="text-sm text-white/80">
                {isLaundry 
                  ? 'Converte dinheiro sujo em limpo automaticamente'
                  : 'Gera dinheiro limpo passivamente'
                }
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => onBuy(building)}
                disabled={!canBuy}
                className="game-button primary flex-1"
              >
                <Plus className="w-4 h-4 mr-2" />
                Construir ({ceilFormat(building.cost)})
              </button>
              
              <button
                onClick={() => onSell(building)}
                disabled={!canSell}
                className="game-button primary"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {!canBuy && (
              <div className="mt-3 p-3 rounded-lg bg-black/30 border border-red-500/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm font-medium">
                    {state.dirty < building.cost 
                      ? `Precisa de ${ceilFormat(building.cost - state.dirty)} mais` 
                      : `Limite atingido (${state.bldMax})`
                    }
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