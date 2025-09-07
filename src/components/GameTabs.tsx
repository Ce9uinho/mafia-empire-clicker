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
    <div className="mb-6">
      <div className="flex gap-2 bg-card/50 rounded-2xl p-2 border border-border backdrop-blur-sm">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`game-tab-inline ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};