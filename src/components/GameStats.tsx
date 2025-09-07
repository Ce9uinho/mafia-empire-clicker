import { GameState } from '@/types/game';
import { DollarSign, Banknote, Flame, Trophy, Users, Building, Key } from 'lucide-react';

interface GameStatsProps {
  state: GameState;
  ceilFormat: (n: number) => string;
}

const StatDonut = ({ 
  value, 
  maxValue, 
  color, 
  size = 60 
}: { 
  value: number; 
  maxValue: number; 
  color: string; 
  size?: number; 
}) => {
  const percentage = Math.min(100, (value / maxValue) * 100);
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeOpacity={0.2}
          strokeWidth={4}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={4}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-foreground">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
};

export const GameStats = ({ state, ceilFormat }: GameStatsProps) => {
  const heatPercent = Math.round((1 - state.eff) * 100);
  const xpPercent = Math.min(100, Math.round((state.xp / state.xpNeed) * 100));

  return (
    <div className="space-y-6 mb-8">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Dirty Money */}
        <div className="stat-card-compact slide-up">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="icon-wrapper-small">
                <DollarSign className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="stat-value-compact dirty">
                {ceilFormat(state.dirty)}
              </div>
              <div className="stat-label-compact">Sujo</div>
              <div className="text-xs text-muted-foreground truncate">
                +{ceilFormat(state.dirtyPer)}/s
              </div>
            </div>
          </div>
        </div>

        {/* Clean Money */}
        <div className="stat-card-compact slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="icon-wrapper-small">
                <Banknote className="w-4 h-4 text-green-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="stat-value-compact clean">
                {ceilFormat(state.clean)}
              </div>
              <div className="stat-label-compact">Limpo</div>
              <div className="text-xs text-muted-foreground truncate">
                +{ceilFormat(state.cleanPer)}/s
                {state.cleanCost > 0 && (
                  <span className="text-red-400"> (-{ceilFormat(state.cleanCost)})</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Heat */}
        <div className="stat-card-compact slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <StatDonut 
                value={state.heat} 
                maxValue={100} 
                color="hsl(var(--heat))" 
                size={50}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="stat-value-compact heat">
                {Math.ceil(Math.max(0, state.heat))}
              </div>
              <div className="stat-label-compact">Heat</div>
              <div className="text-xs text-muted-foreground">
                {Math.round(state.eff * 100)}% Efic.
              </div>
            </div>
          </div>
        </div>

        {/* Player Level */}
        <div className="stat-card-compact slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <StatDonut 
                value={state.xp} 
                maxValue={state.xpNeed} 
                color="hsl(var(--primary))" 
                size={50}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="stat-value-compact level">
                Nv {state.lv}
              </div>
              <div className="stat-label-compact">Nível</div>
              <div className="text-xs text-muted-foreground truncate">
                {Math.ceil(state.xp)}/{Math.ceil(state.xpNeed)} XP
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Limits Section */}
      <div className="stat-card slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground">Capacidades</h3>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Users className="w-4 h-4 text-capanga" />
              <span className="text-xs font-medium text-muted-foreground">Capangas</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {state.capangas.length}/{state.capMax}
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
              <div 
                className="bg-capanga h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (state.capangas.length / state.capMax) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Building className="w-4 h-4 text-building" />
              <span className="text-xs font-medium text-muted-foreground">Edifícios</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {state.builds.length}/{state.bldMax}
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
              <div 
                className="bg-building h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (state.builds.length / state.bldMax) * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Key className="w-4 h-4 text-bribe" />
              <span className="text-xs font-medium text-muted-foreground">Subornos</span>
            </div>
            <div className="text-lg font-bold text-foreground">
              {state.bribes.length}/{state.subMax}
            </div>
            <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1">
              <div 
                className="bg-bribe h-1.5 rounded-full transition-all duration-300" 
                style={{ width: `${Math.min(100, (state.bribes.length / state.subMax) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};