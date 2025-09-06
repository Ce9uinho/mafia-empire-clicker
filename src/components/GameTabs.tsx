import { TabType } from '@/types/game';

interface GameTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const GameTabs = ({ activeTab, onTabChange }: GameTabsProps) => {
  const tabs = [
    { id: 'crimes' as TabType, label: 'Crimes', icon: '🔫' },
    { id: 'capangas' as TabType, label: 'Capangas', icon: '🧑‍💼' },
    { id: 'buildings' as TabType, label: 'Edifícios', icon: '🏢' },
    { id: 'bribes' as TabType, label: 'Subornos', icon: '🗝️' },
  ];

  return (
    <div className="sticky bottom-0 p-4 bg-gradient-to-t from-background via-background to-transparent">
      <div className="flex gap-3">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`mafia-tab ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};