import { useState } from 'react';
import { useGameState } from '@/hooks/useGameState';
import { GameStats } from './GameStats';
import { GameControls } from './GameControls';
import { CrimesPanel } from './CrimesPanel';
import { CapangasPanel } from './CapangasPanel';
import { BuildingsPanel } from './BuildingsPanel';
import { BribesPanel } from './BribesPanel';
import { GameTabs } from './GameTabs';
import { TabType } from '@/types/game';

export const MafiaGame = () => {
  const [activeTab, setActiveTab] = useState<TabType>('crimes');
  const {
    state,
    gameSpeed,
    setGameSpeed,
    onlyPlayerLevel,
    setOnlyPlayerLevel,
    ceilFormat,
    assignPlayer,
    addCapangaToCrime,
    getCrimeWorkers,
    availableCapangas,
    hireCapanga,
    fireCapanga,
    buyBuilding,
    sellBuilding,
    buyBribe,
    saveGame,
    loadGame,
    resetGame
  } = useGameState();

  const renderActivePanel = () => {
    switch (activeTab) {
      case 'crimes':
        return (
          <CrimesPanel
            state={state}
            onlyPlayerLevel={onlyPlayerLevel}
            ceilFormat={ceilFormat}
            onAssignPlayer={assignPlayer}
            onAddCapanga={addCapangaToCrime}
            getCrimeWorkers={getCrimeWorkers}
            availableCapangas={availableCapangas}
          />
        );
      case 'capangas':
        return (
          <CapangasPanel
            state={state}
            ceilFormat={ceilFormat}
            onHire={hireCapanga}
            onFire={fireCapanga}
          />
        );
      case 'buildings':
        return (
          <BuildingsPanel
            state={state}
            ceilFormat={ceilFormat}
            onBuy={buyBuilding}
            onSell={sellBuilding}
          />
        );
      case 'bribes':
        return (
          <BribesPanel
            state={state}
            ceilFormat={ceilFormat}
            onBuy={buyBribe}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="game-background">
      <div className="max-w-7xl mx-auto p-6 pb-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Império da Máfia
          </h1>
          <div className="inline-block px-6 py-2 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 backdrop-blur-sm">
            <p className="text-accent font-bold text-lg">
              Elite Edition
            </p>
          </div>
          <p className="text-muted-foreground text-lg mt-4 max-w-2xl mx-auto">
            Construa seu império criminoso e domine as ruas da cidade
          </p>
        </div>

        {/* Stats */}
        <GameStats state={state} ceilFormat={ceilFormat} />

        {/* Controls */}
        <GameControls
          gameSpeed={gameSpeed}
          setGameSpeed={setGameSpeed}
          onlyPlayerLevel={onlyPlayerLevel}
          setOnlyPlayerLevel={setOnlyPlayerLevel}
          onSave={saveGame}
          onLoad={loadGame}
          onReset={resetGame}
        />

        {/* Active Panel Content */}
        <div className="mb-24">
          {renderActivePanel()}
        </div>
      </div>

      {/* Tabs */}
      <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};