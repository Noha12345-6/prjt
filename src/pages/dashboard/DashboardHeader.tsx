import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DashboardHeaderProps {
  isLoading: boolean;
  onRefresh: () => void;
}

export default function DashboardHeader({ isLoading, onRefresh }: DashboardHeaderProps) {
  const { t } = useTranslation();
  return (
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
      <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('dashboard.title')}
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300 text-lg">
              {t('dashboard.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="bg-white/50 hover:bg-white/80 border-white/30"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t('dashboard.refresh')}
            </Button>
            
          </div>
        </div>
      </div>
    </div>
  );
} 