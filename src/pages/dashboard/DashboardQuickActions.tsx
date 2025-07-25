import { Button } from '@/components/ui/button';
import { Users, Target,  Plus, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function DashboardQuickActions() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-white/70 to-slate-50/70 dark:from-slate-900/70 dark:to-slate-800/70 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <CardTitle className="text-xl">{t('dashboard.quickActions')}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4">
          <Button
            variant="default"
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/members/add')}
          >
            <Users className="w-4 h-4 mr-2" />
            {t('dashboard.addMember')}
          </Button>
          <Button
            variant="default"
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/tasks/new')}
          >
            <Target className="w-4 h-4 mr-2" />
            {t('dashboard.newProject')}
          </Button>
         
          <Button variant="default" className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-200">
            <Plus className="w-4 h-4 mr-2" />
            {t('dashboard.moreActions')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 