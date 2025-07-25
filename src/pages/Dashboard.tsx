import React, { useState, useEffect } from 'react';
import { Users, Target, Star, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStatsCards from './dashboard/DashboardStatsCards';
import DashboardPerformanceChart from './dashboard/DashboardPerformanceChart';
import DashboardRecentActivities from './dashboard/DashboardRecentActivities';
import DashboardQuickActions from './dashboard/DashboardQuickActions';

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    members: 0 as number,
    projects: 0 as number,
    time: 0 as number,
    score: 0 as number
  });
  useEffect(() => {
    const onLangChanged = () => {};
    i18n.on('languageChanged', onLangChanged);
    return () => i18n.off('languageChanged', onLangChanged);
  }, [i18n]);
  useEffect(() => {
    const targets = { members: 42, projects: 18, time: 2.4, score: 94 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setAnimatedValues({
        members: Math.floor(targets.members * easeOut),
        projects: Math.floor(targets.projects * easeOut),
        time: Number((targets.time * easeOut).toFixed(1)),
        score: Math.floor(targets.score * easeOut)
      });
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);
    return () => clearInterval(interval);
  }, []);
  const statsCards = [
    {
      title: t('dashboard.stats.activeMembers'),
      value: animatedValues.members,
      change: '12%',
      trend: 'up' as const,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
    },
    {
      title: t('dashboard.stats.completedProjects'),
      value: animatedValues.projects,
      change: '8%',
      trend: 'up' as const,
      icon: Target,
      gradient: 'from-emerald-500 to-emerald-600',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900'
    },
    {
      title: t('dashboard.stats.avgTime'),
      value: `${animatedValues.time}h`,
      change: '15%',
      trend: 'down' as const,
      icon: Zap,
      gradient: 'from-amber-500 to-amber-600',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900'
    },
    {
      title: t('dashboard.stats.performanceScore'),
      value: `${animatedValues.score}%`,
      change: '5%',
      trend: 'up' as const,
      icon: Star,
      gradient: 'from-purple-500 to-purple-600',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'
    }
  ];
  const recentActivities = [
    { id: '1', user: 'Marie Dupont', action: t('dashboard.activities.completedProject', { project: 'Alpha' }), time: t('dashboard.activities.timeAgo', { time: '2h' }), type: 'success', avatar: 'MD' },
    { id: '2', user: 'Pierre Martin', action: t('dashboard.activities.joinedTeam', { team: 'Design' }), time: t('dashboard.activities.timeAgo', { time: '4h' }), type: 'info', avatar: 'PM' },
    { id: '3', user: 'Sophie Bernard', action: t('dashboard.activities.updatedReport'), time: t('dashboard.activities.timeAgo', { time: '6h' }), type: 'warning', avatar: 'SB' },
    { id: '4', user: 'Thomas Dubois', action: t('dashboard.activities.createdTask'), time: t('dashboard.activities.timeAgo', { time: '8h' }), type: 'info', avatar: 'TD' }
  ];
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="p-6 md:p-8 max-w-7xl mx-auto pt-16">
        <DashboardHeader isLoading={isLoading} onRefresh={handleRefresh} />
        <DashboardStatsCards statsCards={statsCards} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DashboardPerformanceChart selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />
          <DashboardRecentActivities recentActivities={recentActivities} />
        </div>
        <DashboardQuickActions />
      </div>
    </div>
  );
};

export default Dashboard;