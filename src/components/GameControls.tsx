import { Settings, Save, Upload, RotateCcw, Zap, Filter } from 'lucide-react';

interface GameControlsProps {
  gameSpeed: number;
  setGameSpeed: (speed: number) => void;
  onlyPlayerLevel: boolean;
  setOnlyPlayerLevel: (value: boolean) => void;
  onSave: () => void;
  onLoad: () => void;
  onReset: () => void;
}

export const GameControls = ({
  gameSpeed,
  setGameSpeed,
  onlyPlayerLevel,
  setOnlyPlayerLevel,
  onSave,
  onLoad,
  onReset
}: GameControlsProps) => {
  return (
    <div className="game-card mb-6">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3">
          <Zap className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-medium text-muted-foreground">Velocidade:</span>
          <select 
            value={gameSpeed}
            onChange={(e) => setGameSpeed(Number(e.target.value))}
            className="bg-secondary/50 text-foreground border border-border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent backdrop-blur-5"
          >
            <option value="1">1×</option>
            <option value="10">10×</option>
            <option value="100">100×</option>
            <option value="1000">1000×</option>
          </select>
        </div>
        
        <label className="flex items-center gap-3 cursor-pointer">
          <Filter className="w-4 h-4 text-blue-400" />
          <input
            type="checkbox"
            checked={onlyPlayerLevel}
            onChange={(e) => setOnlyPlayerLevel(e.target.checked)}
            className="w-4 h-4 text-primary bg-secondary/50 border-border rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-sm font-medium text-muted-foreground">
            Filtrar por nível
          </span>
        </label>

        <div className="flex gap-3 ml-auto">
          <button onClick={onSave} className="game-button gold">
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </button>
          <button onClick={onLoad} className="game-button ghost">
            <Upload className="w-4 h-4 mr-2" />
            Carregar
          </button>
          <button onClick={onReset} className="game-button danger">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};