import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: string;
  avatar: string;
}

interface DashboardRecentActivitiesProps {
  recentActivities: ActivityItem[];
}

export default function DashboardRecentActivities({ recentActivities }: DashboardRecentActivitiesProps) {
  const { t } = useTranslation();
  // Ajout de la fonction manquante
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };
  return (
    <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-xl">{t('dashboard.recentActivity')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="group flex items-start space-x-4 p-3 rounded-xl hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all duration-200">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {activity.avatar}
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getActivityColor(activity.type)} rounded-full border-2 border-white dark:border-slate-900`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <span className="font-semibold">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs mt-1 text-slate-500 dark:text-slate-400">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 