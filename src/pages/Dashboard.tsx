import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  UserCheck, Clock, Target, Award, BarChart3, Users, ArrowUp, ArrowDown,
  TrendingUp, Activity, Zap, Star, Plus, Filter, RefreshCw
} from 'lucide-react';

const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [isLoading, setIsLoading] = useState(false);

  // Animation des compteurs
  const [animatedValues, setAnimatedValues] = useState({
    members: 0,
    projects: 0,
    time: 0,
    score: 0
  });

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
        time: (targets.time * easeOut).toFixed(1),
        score: Math.floor(targets.score * easeOut)
      });

      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Données pour les cartes de statistiques avec animations
  const statsCards = [
    {
      title: 'Membres Actifs',
      value: animatedValues.members,
      change: '12%',
      trend: 'up' as const,
      icon: UserCheck,
      gradient: 'from-blue-500 to-blue-600',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900'
    },
    {
      title: 'Projets Complétés',
      value: animatedValues.projects,
      change: '8%',
      trend: 'up' as const,
      icon: Target,
      gradient: 'from-emerald-500 to-emerald-600',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900'
    },
    {
      title: 'Temps Moyen',
      value: `${animatedValues.time}h`,
      change: '15%',
      trend: 'down' as const,
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      bgPattern: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900'
    },
    {
      title: 'Score Performance',
      value: `${animatedValues.score}%`,
      change: '5%',
      trend: 'up' as const,
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgPattern: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900'
    }
  ];

  // Activités récentes avec plus de détails
  const recentActivities = [
    { 
      id: '1', 
      user: 'Marie Dupont', 
      action: 'a complété le projet Alpha', 
      time: 'il y a 2h',
      type: 'success',
      avatar: 'MD'
    },
    { 
      id: '2', 
      user: 'Pierre Martin', 
      action: "a rejoint l'équipe Design", 
      time: 'il y a 4h',
      type: 'info',
      avatar: 'PM'
    },
    { 
      id: '3', 
      user: 'Sophie Bernard', 
      action: 'a mis à jour le rapport', 
      time: 'il y a 6h',
      type: 'warning',
      avatar: 'SB'
    },
    { 
      id: '4', 
      user: 'Thomas Dubois', 
      action: 'a créé une nouvelle tâche', 
      time: 'il y a 8h',
      type: 'info',
      avatar: 'TD'
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500';
      case 'warning': return 'bg-amber-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      <div className="p-6 md:p-8 max-w-7xl mx-auto pt-16">
        {/* En-tête amélioré */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-xl"></div>
          <div className="relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tableau de Bord
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-lg">
                  Aperçu des performances de votre équipe ✨
                </p>
              </div>
              <div className="flex items-center gap-3 mt-4 md:mt-0">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className="bg-white/50 hover:bg-white/80 border-white/30"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  <Filter className="w-4 h-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cartes de statistiques améliorées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <Card key={index} className={`group hover:scale-105 transition-all duration-300 border-0 shadow-lg hover:shadow-2xl ${card.bgPattern} overflow-hidden relative`}>
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent dark:from-white/10"></div>
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {card.title}
                </CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent className="relative">
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
                    vs mois dernier
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Grille de contenu améliorée */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graphique de performance */}
          <Card className="lg:col-span-2 border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-xl">Performance de l'équipe</CardTitle>
                </div>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-[180px] bg-white/50 dark:bg-slate-800/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 derniers jours</SelectItem>
                    <SelectItem value="30">30 derniers jours</SelectItem>
                    <SelectItem value="90">3 derniers mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
                <div className="relative flex flex-col items-center">
                  <BarChart3 className="w-16 h-16 text-slate-400 mb-4" />
                  <p className="text-slate-500 text-sm">Graphique interactif bientôt disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activités récentes améliorées */}
          <Card className="border-0 shadow-xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-xl">Activité Récente</CardTitle>
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
        </div>

        {/* Actions rapides améliorées */}
        <Card className="mt-8 border-0 shadow-xl bg-gradient-to-r from-white/70 to-slate-50/70 dark:from-slate-900/70 dark:to-slate-800/70 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xl">Actions Rapides</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Users className="w-4 h-4 mr-2" />
                Ajouter Membre
              </Button>
              <Button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Target className="w-4 h-4 mr-2" />
                Nouveau Projet
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Star className="w-4 h-4 mr-2" />
                Créer Rapport
              </Button>
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg hover:shadow-xl transition-all duration-200">
                <Plus className="w-4 h-4 mr-2" />
                Plus d'actions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;