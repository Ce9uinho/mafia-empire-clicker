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
    <div className="flex flex-wrap gap-3 items-center p-4 bg-card rounded-lg border border-border">
      <div className="flex items-center gap-2">
        <span className="mafia-chip">
          Velocidade
          <select 
            value={gameSpeed}
            onChange={(e) => setGameSpeed(Number(e.target.value))}
            className="ml-2 bg-muted text-muted-foreground border border-border rounded px-2 py-1"
          >
            <option value="1">1×</option>
            <option value="10">10×</option>
            <option value="100">100×</option>
            <option value="1000">1000×</option>
          </select>
        </span>
      </div>
      
      <label className="flex items-center gap-2 mafia-chip cursor-pointer">
        <input
          type="checkbox"
          checked={onlyPlayerLevel}
          onChange={(e) => setOnlyPlayerLevel(e.target.checked)}
          className="accent-accent"
        />
        Só crimes ≤ nível
      </label>

      <div className="flex gap-2 ml-auto">
        <button onClick={onSave} className="mafia-button mafia-button-gold">
          Guardar
        </button>
        <button onClick={onLoad} className="mafia-button mafia-button-ghost">
          Carregar
        </button>
        <button onClick={onReset} className="mafia-button mafia-button-danger">
          Reset
        </button>
      </div>
    </div>
  );
};