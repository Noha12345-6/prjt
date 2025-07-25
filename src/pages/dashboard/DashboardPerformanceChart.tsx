import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';

interface DashboardPerformanceChartProps {
  selectedPeriod: string;
  setSelectedPeriod: (value: string) => void;
}

export default function DashboardPerformanceChart({ selectedPeriod, setSelectedPeriod }: DashboardPerformanceChartProps) {
  const { t } = useTranslation();
  return (
    <Card className="lg:col-span-2 border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl">{t('dashboard.performanceTitle')}</CardTitle>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px] bg-white/50 dark:bg-slate-800/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">{t('dashboard.period.7days')}</SelectItem>
              <SelectItem value="30">{t('dashboard.period.30days')}</SelectItem>
              <SelectItem value="90">{t('dashboard.period.3months')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
          <div className="relative flex flex-col items-center">
            <BarChart3 className="w-16 h-16 text-slate-400 mb-4" />
            <p className="text-slate-500 text-sm">{t('dashboard.chartSoon')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 