import { ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  gradient: string;
  bgPattern: string;
}

interface DashboardStatsCardsProps {
  statsCards: StatCard[];
}

export default function DashboardStatsCards({ statsCards }: DashboardStatsCardsProps) {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsCards.map((card, index) => (
        <div key={index} className={`group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl ${card.bgPattern} overflow-hidden relative`}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10"></div>
          <div className="relative flex flex-row items-center justify-between pb-2 p-6">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{card.title}</span>
            <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <card.icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="relative p-6 pt-0">
            <div className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
              {card.value}
            </div>
            <div className="flex items-center">
              <div className={`flex items-center px-2 py-1 rounded-full ${
                card.trend === 'up' 
                  ? 'bg-emerald-100 dark:bg-emerald-900' 
                  : 'bg-rose-100 dark:bg-rose-900'
              }`}>
                {card.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-rose-600 dark:text-rose-400" />
                )}
                <span className={`ml-1 text-xs font-semibold ${
                  card.trend === 'up' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {card.change}
                </span>
              </div>
              <span className="ml-2 text-xs text-slate-500 dark:text-slate-400">
                {t('dashboard.vsLastMonth')}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 