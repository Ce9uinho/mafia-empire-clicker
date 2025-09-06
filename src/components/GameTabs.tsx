import { TabType } from '@/types/game';
import { Skull, Users, Building2, Key } from 'lucide-react';

interface GameTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const GameTabs = ({ activeTab, onTabChange }: GameTabsProps) => {
  const tabs = [
    { id: 'crimes' as TabType, label: 'Crimes', icon: Skull },
    { id: 'capangas' as TabType, label: 'Capangas', icon: Users },
    { id: 'buildings' as TabType, label: 'Edifícios', icon: Building2 },
    { id: 'bribes' as TabType, label: 'Subornos', icon: Key },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2 backdrop-blur-lg bg-black/20 rounded-2xl p-2 border border-white/10">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`game-tab ${activeTab === tab.id ? 'active' : ''}`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-sm font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};