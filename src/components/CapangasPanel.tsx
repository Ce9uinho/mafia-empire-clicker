import { CAPANGAS } from '@/types/game';
import { GameState } from '@/types/game';
import { 
  UserCheck, 
  Laptop, 
  Crown, 
  Shield, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  UserPlus,
  UserMinus,
  AlertCircle,
  Users
} from 'lucide-react';

const capangaIcons = {
  thug: UserCheck,
  sold: Shield,
  capo: Crown,
  hacker: Laptop,
};

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
  const getPerkComponents = (buffs: any) => {
    const perks = [];
    if (buffs?.dirtyMul && buffs.dirtyMul !== 1) {
      const isPositive = buffs.dirtyMul > 1;
      perks.push({
        icon: isPositive ? TrendingUp : TrendingDown,
        text: `${Math.round(buffs.dirtyMul * 100)}%`,
        color: isPositive ? 'text-green-400' : 'text-red-400',
        label: 'Renda'
      });
    }
    if (buffs?.heatMul && buffs.heatMul !== 1) {
      const isPositive = buffs.heatMul < 1; // Lower heat is better
      perks.push({
        icon: isPositive ? TrendingDown : TrendingUp,
        text: `${Math.round(buffs.heatMul * 100)}%`,
        color: isPositive ? 'text-green-400' : 'text-red-400',
        label: 'Heat'
      });
    }
    return perks;
  };

  const getCapangaCount = (capangaId: string) => {
    return state.capangas.filter(c => c.kind.id === capangaId).length;
  };

  return (
    <div className="grid gap-6">
      {CAPANGAS.map((capanga, index) => {
        const count = getCapangaCount(capanga.id);
        const canHire = state.dirty >= capanga.hire && state.capangas.length < state.capMax;
        const canFire = count > 0;
        const perks = getPerkComponents(capanga.buffs);
        const CapangaIcon = capangaIcons[capanga.id as keyof typeof capangaIcons] || UserCheck;

        return (
          <div 
            key={capanga.id} 
            className="capanga-item slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper">
                  <CapangaIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {capanga.name}
                  </h3>
                  {count > 0 && (
                    <div className="game-chip bg-black/30 text-white border-white/20">
                      <Users className="w-3 h-3" />
                      {count} contratado{count > 1 ? 's' : ''}
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
                  {ceilFormat(capanga.hire)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white/80">Salário</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(capanga.salary)}/s
                </p>
              </div>
            </div>

            {perks.length > 0 && (
              <div className="bg-black/30 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-medium text-white/80 mb-2">Benefícios:</h4>
                <div className="flex gap-3">
                  {perks.map((perk, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <perk.icon className={`w-4 h-4 ${perk.color}`} />
                      <span className="text-sm font-medium text-white">
                        {perk.text} {perk.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => onHire(capanga)}
                disabled={!canHire}
                className="game-button success flex-1"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Contratar ({ceilFormat(capanga.hire)})
              </button>
              
              <button
                onClick={() => onFire(capanga)}
                disabled={!canFire}
                className="game-button danger"
              >
                <UserMinus className="w-4 h-4" />
              </button>
            </div>

            {!canHire && (
              <div className="mt-3 p-3 rounded-lg bg-black/30 border border-red-500/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-300 text-sm font-medium">
                    {state.dirty < capanga.hire 
                      ? `Precisa de ${ceilFormat(capanga.hire - state.dirty)} mais` 
                      : `Limite atingido (${state.capMax})`
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