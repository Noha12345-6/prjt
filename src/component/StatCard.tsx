import { type LucideIcon } from 'lucide-react';
import { useTheme } from './ThemeContext';

type StatCardProps = {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: string;
};

export const StatCard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  color 
}: StatCardProps) => {
  const { isDark } = useTheme();
  
  return (
    <div className={`rounded-xl shadow-sm border p-6 transition-colors ${
      isDark 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-100'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-medium ${
          trend === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          {change}
        </span>
        <span className={`text-sm ml-2 ${
          isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          vs mois dernier
        </span>
      </div>
    </div>
  );
};