import { Code, Eye } from 'lucide-react';

interface TabViewProps {
  activeTab: 'code' | 'preview';
  onTabChange: (tab: 'code' | 'preview') => void;
}

export function TabView({ activeTab, onTabChange }: TabViewProps) {
  const tabs = [
    {
      key: 'code',
      label: 'Code',
      icon: Code,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-300',
    },
    {
      key: 'preview',
      label: 'Preview',
      icon: Eye,
      color: 'from-green-500 to-teal-500',
      textColor: 'text-green-300',
    },
  ] as const;

  return (
    <div className="flex space-x-3 mb-4">
      {tabs.map(({ key, label, icon: Icon, color, textColor }) => {
        const isActive = activeTab === key;
        return (
          <button
            key={key}
            onClick={() => onTabChange(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 backdrop-blur-md ${
              isActive
                ? `bg-gradient-to-br ${color} text-white shadow-lg shadow-${color.split(' ')[0]}/30`
                : 'bg-gray-800/40 border-gray-700 text-gray-400 hover:border-indigo-600/50 hover:bg-gray-800/70 hover:text-gray-100'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
            <span className={`text-sm font-medium ${isActive ? 'text-white' : textColor}`}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
