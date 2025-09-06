import { CRIMES } from '@/types/game';
import { GameState } from '@/types/game';
import { 
  Skull, 
  ShoppingCart, 
  Car, 
  Warehouse, 
  Fuel, 
  Building2, 
  User, 
  UserPlus, 
  UserMinus, 
  DollarSign, 
  Flame,
  Users,
  Lock
} from 'lucide-react';

const crimeIcons = {
  pickpocket: Skull,
  loja: ShoppingCart,
  carro: Car,
  armazem: Warehouse,
  posto: Fuel,
  banco: Building2,
};

interface CrimesPanelProps {
  state: GameState;
  onlyPlayerLevel: boolean;
  ceilFormat: (n: number) => string;
  onAssignPlayer: (id: string) => void;
  onAddCapanga: (id: string, delta: number) => void;
  getCrimeWorkers: (id: string) => number;
  availableCapangas: () => number;
}

export const CrimesPanel = ({
  state,
  onlyPlayerLevel,
  ceilFormat,
  onAssignPlayer,
  onAddCapanga,
  getCrimeWorkers,
  availableCapangas
}: CrimesPanelProps) => {
  const filteredCrimes = CRIMES.filter(crime => 
    !onlyPlayerLevel || state.lv >= crime.reqLv
  );

  if (filteredCrimes.length === 0) {
    return (
      <div className="game-card text-center py-12">
        <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">Nenhum Crime Disponível</h3>
        <p className="text-muted-foreground">
          Suba de nível para desbloquear novos crimes!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {filteredCrimes.map((crime, index) => {
        const isPlayerActive = state.playerCrime === crime.id;
        const workers = getCrimeWorkers(crime.id);
        const canAssign = state.lv >= crime.reqLv;
        const hasAvailableCapangas = availableCapangas() > 0;
        const CrimeIcon = crimeIcons[crime.id as keyof typeof crimeIcons] || Skull;

        return (
          <div 
            key={crime.id}
            className={`crime-item slide-up ${isPlayerActive ? 'item-active' : ''}`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="icon-wrapper">
                  <CrimeIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    {crime.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="game-chip bg-black/30 text-white border-white/20">
                      Nível {crime.reqLv}
                    </span>
                    {!canAssign && (
                      <span className="text-yellow-300 text-sm font-medium">
                        Bloqueado
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {isPlayerActive && (
                <div className="floating-animation">
                  <div className="bg-white/20 rounded-full px-3 py-1 text-white text-sm font-semibold">
                    ATIVO
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <DollarSign className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium text-white/80">Renda</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(crime.dirty)}/s
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-medium text-white/80">Heat</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {ceilFormat(crime.heat)}/s
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-white/80">Capangas</span>
                </div>
                <p className="text-lg font-bold text-white">
                  {workers}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => onAssignPlayer(crime.id)}
                disabled={!canAssign}
                className={`game-button ${
                  isPlayerActive 
                    ? 'danger' 
                    : 'gold'
                } flex-1 min-w-0`}
              >
                <User className="w-4 h-4 mr-2" />
                {isPlayerActive ? 'Parar' : 'Trabalhar'}
              </button>
              
              <button
                onClick={() => onAddCapanga(crime.id, 1)}
                disabled={!canAssign || !hasAvailableCapangas}
                className="game-button success"
              >
                <UserPlus className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => onAddCapanga(crime.id, -1)}
                disabled={!canAssign || workers === 0}
                className="game-button danger"
              >
                <UserMinus className="w-4 h-4" />
              </button>
            </div>

            {!canAssign && (
              <div className="mt-3 p-3 rounded-lg bg-black/30 border border-yellow-500/30">
                <p className="text-yellow-300 text-sm font-medium">
                  Requer nível {crime.reqLv} para desbloquear
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};