import { GameState } from '@/types/game';
import { DollarSign, Banknote, Flame, Trophy, Users, Building, Key } from 'lucide-react';

interface GameStatsProps {
  state: GameState;
  ceilFormat: (n: number) => string;
}

export const GameStats = ({ state, ceilFormat }: GameStatsProps) => {
  const heatPercent = Math.round((1 - state.eff) * 100);
  const xpPercent = Math.min(100, Math.round((state.xp / state.xpNeed) * 100));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Dirty Money */}
      <div className="stat-card slide-up">
        <div className="icon-wrapper mx-auto mb-4">
          <DollarSign className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="stat-value dirty">
          {ceilFormat(state.dirty)}
        </div>
        <div className="stat-label">
          Dinheiro Sujo
        </div>
        <p className="text-xs text-muted-foreground">
          +{ceilFormat(state.dirtyPer)}/s
        </p>
      </div>

      {/* Clean Money */}
      <div className="stat-card slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="icon-wrapper mx-auto mb-4">
          <Banknote className="w-5 h-5 text-green-400" />
        </div>
        <div className="stat-value clean">
          {ceilFormat(state.clean)}
        </div>
        <div className="stat-label">
          Dinheiro Limpo
        </div>
        <p className="text-xs text-muted-foreground">
          +{ceilFormat(state.cleanPer)}/s
          {state.cleanCost > 0 && (
            <span className="text-red-400"> (−{ceilFormat(state.cleanCost)}/s)</span>
          )}
        </p>
      </div>

      {/* Heat */}
      <div className="stat-card slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="icon-wrapper mx-auto mb-4">
          <Flame className="w-5 h-5 text-red-400" />
        </div>
        <div className="stat-value heat">
          {Math.ceil(Math.max(0, state.heat))}
        </div>
        <div className="stat-label mb-3">
          Heat • Eficiência {Math.round(state.eff * 100)}%
        </div>
        <div className="progress-bar mb-4">
          <div 
            className="progress-fill progress-heat" 
            style={{ width: `${heatPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="game-chip">
            <Users className="w-3 h-3" />
            {state.capangas.length}/{state.capMax}
          </span>
          <span className="game-chip">
            <Building className="w-3 h-3" />
            {state.builds.length}/{state.bldMax}
          </span>
          <span className="game-chip">
            <Key className="w-3 h-3" />
            {state.bribes.length}/{state.subMax}
          </span>
        </div>
      </div>

      {/* Player Level */}
      <div className="stat-card slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="icon-wrapper mx-auto mb-4">
          <Trophy className="w-5 h-5 text-purple-400" />
        </div>
        <div className="stat-value level">
          Nível {state.lv}
        </div>
        <div className="flex justify-between items-center mb-3 text-xs text-muted-foreground">
          <span>XP {Math.ceil(state.xp)}</span>
          <span>{Math.ceil(state.xpNeed)}</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill progress-xp" 
            style={{ width: `${xpPercent}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {xpPercent}% para próximo nível
        </p>
      </div>
    </div>
  );
};