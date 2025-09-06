import { CRIMES } from '@/types/game';
import { GameState } from '@/types/game';

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
  return (
    <div className="grid gap-4">
      {CRIMES.map(crime => {
        if (onlyPlayerLevel && state.lv < crime.reqLv) return null;
        
        const isPlayerActive = state.playerCrime === crime.id;
        const workers = getCrimeWorkers(crime.id);
        const canAssign = state.lv >= crime.reqLv;
        const hasAvailableCapangas = availableCapangas() > 0;

        return (
          <div 
            key={crime.id}
            className={`mafia-item ${isPlayerActive ? 'player-active pulse-glow' : ''}`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🔫 {crime.name}
                <span className="mafia-chip bg-accent text-accent-foreground">
                  Lv {crime.reqLv}
                </span>
              </h3>
              {!canAssign && (
                <span className="text-warning text-sm">
                  Requer nível {crime.reqLv}
                </span>
              )}
            </div>

            <div className="mafia-label mb-4">
              💉 {ceilFormat(crime.dirty)}/s • 🔥 {ceilFormat(crime.heat)}/s • 
              Capangas <span className="text-accent font-bold">{workers}</span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onAssignPlayer(crime.id)}
                disabled={!canAssign}
                className={`mafia-button ${
                  isPlayerActive 
                    ? 'mafia-button-danger' 
                    : 'mafia-button-gold'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isPlayerActive ? '🚫 Parar' : '👤 Jogador'}
              </button>
              
              <button
                onClick={() => onAddCapanga(crime.id, 1)}
                disabled={!canAssign || !hasAvailableCapangas}
                className="mafia-button mafia-button-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➕ Capanga
              </button>
              
              <button
                onClick={() => onAddCapanga(crime.id, -1)}
                disabled={!canAssign || workers === 0}
                className="mafia-button mafia-button-danger disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ➖ Capanga
              </button>
            </div>
          </div>
        );
      })}
      
      {onlyPlayerLevel && CRIMES.filter(c => state.lv >= c.reqLv).length === 0 && (
        <div className="mafia-card text-center py-8">
          <p className="text-muted-foreground">
            Nenhum crime disponível no seu nível atual.
          </p>
        </div>
      )}
    </div>
  );
};