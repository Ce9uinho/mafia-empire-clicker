import { GameState } from '@/types/game';

interface GameStatsProps {
  state: GameState;
  ceilFormat: (n: number) => string;
}

export const GameStats = ({ state, ceilFormat }: GameStatsProps) => {
  const heatPercent = Math.round((1 - state.eff) * 100);
  const xpPercent = Math.min(100, Math.round((state.xp / state.xpNeed) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Dirty Money */}
      <div className="mafia-card">
        <div className="mafia-stat text-dirty-money">
          💉 {ceilFormat(state.dirty)}
        </div>
        <div className="mafia-label">
          $ Sujo • +{ceilFormat(state.dirtyPer)}/s
        </div>
      </div>

      {/* Clean Money */}
      <div className="mafia-card">
        <div className="mafia-stat text-clean-money">
          🧼 {ceilFormat(state.clean)}
        </div>
        <div className="mafia-label">
          $ Limpo • +{ceilFormat(state.cleanPer)}/s
          <span className="text-muted-foreground ml-2">
            (−{ceilFormat(state.cleanCost)}/s subornos)
          </span>
        </div>
      </div>

      {/* Heat */}
      <div className="mafia-card">
        <div className="mafia-stat text-heat">
          🔥 {Math.ceil(Math.max(0, state.heat))}
        </div>
        <div className="mafia-label mb-2">
          Heat • Eficiência {Math.round(state.eff * 100)}%
        </div>
        <div className="mafia-progress-bar">
          <div 
            className="mafia-progress-fill mafia-progress-heat" 
            style={{ width: `${heatPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="mafia-chip">
            Capangas {state.capangas.length}/{state.capMax}
          </span>
          <span className="mafia-chip">
            Edifícios {state.builds.length}/{state.bldMax}
          </span>
          <span className="mafia-chip">
            Subornos {state.bribes.length}/{state.subMax}
          </span>
        </div>
      </div>

      {/* Player Level */}
      <div className="mafia-card">
        <div className="mafia-stat text-accent">
          Lv {state.lv}
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="mafia-label">
            XP {Math.ceil(state.xp)} / {Math.ceil(state.xpNeed)}
          </span>
          <span className="mafia-label">
            {xpPercent}%
          </span>
        </div>
        <div className="mafia-progress-bar">
          <div 
            className="mafia-progress-fill mafia-progress-xp" 
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};