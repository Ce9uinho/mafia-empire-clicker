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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6 pb-32">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Império da Máfia —{' '}
            <span className="text-accent">Elite</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Construa seu império criminoso e domine as ruas
          </p>
        </div>

        {/* Stats */}
        <GameStats state={state} ceilFormat={ceilFormat} />

        {/* Controls */}
        <div className="mt-6">
          <GameControls
            gameSpeed={gameSpeed}
            setGameSpeed={setGameSpeed}
            onlyPlayerLevel={onlyPlayerLevel}
            setOnlyPlayerLevel={setOnlyPlayerLevel}
            onSave={saveGame}
            onLoad={loadGame}
            onReset={resetGame}
          />
        </div>

        {/* Active Panel Content */}
        <div className="mt-6">
          {renderActivePanel()}
        </div>
      </div>

      {/* Tabs */}
      <GameTabs activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};